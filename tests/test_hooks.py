"""Tests for scripts/humanizer-lint.py and scripts/humanizer-hook.py.

Run with: python3 -m unittest discover -s tests
"""

from __future__ import annotations

import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HOOK = ROOT / "scripts" / "humanizer-hook.py"
FIXTURES = json.loads((ROOT / "tests" / "fixtures.json").read_text(encoding="utf-8"))

_spec = importlib.util.spec_from_file_location("humanizer_lint", ROOT / "scripts" / "humanizer-lint.py")
lint_module = importlib.util.module_from_spec(_spec)
sys.modules["humanizer_lint"] = lint_module
_spec.loader.exec_module(lint_module)


def run_hook(event: dict, env: dict | None = None) -> subprocess.CompletedProcess:
    full_env = {k: v for k, v in os.environ.items() if k != "HUMANIZER_HOOK"}
    full_env.update(CLAUDE_PLUGIN_DATA=tempfile.gettempdir(), **(env or {}))
    return subprocess.run(
        [sys.executable, str(HOOK)], input=json.dumps(event),
        capture_output=True, text=True, env=full_env, timeout=10,
    )


def transcript(*entries: dict) -> str:
    handle = tempfile.NamedTemporaryFile("w", suffix=".jsonl", delete=False)
    for entry in entries:
        handle.write(json.dumps(entry) + "\n")
    handle.close()
    return handle.name


def user(text: str) -> dict:
    return {"type": "user", "message": {"role": "user", "content": text}}


def assistant(*blocks: dict) -> dict:
    return {"type": "assistant", "message": {"role": "assistant", "content": list(blocks)}}


class LintFixtures(unittest.TestCase):
    def test_ai_passages_are_flagged(self):
        for text in FIXTURES["ai"]:
            with self.subTest(text=text[:50]):
                self.assertTrue(lint_module.lint(text)["flagged"], lint_module.lint(text))

    def test_human_passages_pass(self):
        for text in FIXTURES["human"]:
            with self.subTest(text=text[:50]):
                self.assertFalse(lint_module.lint(text)["flagged"], lint_module.lint(text))

    def test_code_quotes_and_blockquotes_are_skipped(self):
        text = 'Avoid "Let that sink in." and `at its core`.\n\n> Here\'s the thing.\n\n```\na — b\n```\n'
        self.assertFalse(lint_module.lint(text)["flagged"])

    def test_lead_in_line_is_not_a_closer(self):
        para = "The server reads its config at start. It exits with code 2 if the file is missing."
        text = "\n\n".join([para, "Each option is listed below:", para, "Pick one of these:", para, "Run it like this:", para])
        self.assertEqual(lint_module.lint(text)["features"]["short_closers"], 0.0)

    def test_repo_docs_pass(self):
        for name in ("README.md", "AGENTS.md", "CHANGELOG.md"):
            with self.subTest(name=name):
                report = lint_module.lint((ROOT / name).read_text(encoding="utf-8"))
                self.assertEqual(report["hard_tells"], [], report["findings"][:5])


class HookEvents(unittest.TestCase):
    def test_write_to_prose_file_is_blocked(self):
        result = run_hook({"hook_event_name": "PreToolUse", "tool_name": "Write",
                           "tool_input": {"file_path": "a.md", "content": "Let that sink in."}})
        self.assertEqual(result.returncode, 2)
        self.assertIn("§2", result.stderr)

    def test_edit_and_multiedit_text_is_checked(self):
        edit = run_hook({"hook_event_name": "PreToolUse", "tool_input": {
            "file_path": "b.txt", "old_string": "x", "new_string": "Great question! Here it is."}})
        multi = run_hook({"hook_event_name": "PreToolUse", "tool_input": {
            "file_path": "c.rst", "edits": [{"new_string": "fine"}, {"new_string": "Don't get me wrong, we ship Friday."}]}})
        self.assertEqual((edit.returncode, multi.returncode), (2, 2))

    def test_code_file_is_ignored(self):
        result = run_hook({"hook_event_name": "PreToolUse", "tool_input": {
            "file_path": "a.py", "content": "# Let that sink in — at its core"}})
        self.assertEqual(result.returncode, 0)

    def test_off_switch(self):
        result = run_hook({"hook_event_name": "PreToolUse", "tool_input": {
            "file_path": "a.md", "content": "Let that sink in."}}, env={"HUMANIZER_HOOK": "off"})
        self.assertEqual(result.returncode, 0)

    def test_stop_blocks_ai_reply(self):
        path = transcript(user("fix it"), assistant(
            {"type": "text", "text": "Great question! It's not just a bug, it's a design flaw."}))
        result = run_hook({"hook_event_name": "Stop", "session_id": "t1",
                           "transcript_path": path, "stop_hook_active": False})
        self.assertEqual(result.returncode, 2)
        self.assertIn("reply", result.stderr)

    def test_stop_passes_plain_reply_and_reads_whole_turn(self):
        path = transcript(
            user("old prompt"), assistant({"type": "text", "text": "Let that sink in."}),
            user("fix it"),
            assistant({"type": "text", "text": "Running the tests."},
                      {"type": "tool_use", "id": "1", "name": "Bash", "input": {}}),
            {"type": "user", "message": {"content": [{"type": "tool_result", "tool_use_id": "1", "content": "ok"}]}},
            assistant({"type": "text", "text": "All 12 tests pass. The fix is in parser.py line 40."}),
        )
        result = run_hook({"hook_event_name": "Stop", "session_id": "t2", "transcript_path": path})
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_stop_does_not_loop(self):
        path = transcript(user("x"), assistant({"type": "text", "text": "Let that sink in."}))
        result = run_hook({"hook_event_name": "Stop", "transcript_path": path, "stop_hook_active": True})
        self.assertEqual(result.returncode, 0)

    def test_stop_falls_back_to_event_field(self):
        result = run_hook({"hook_event_name": "Stop", "transcript_path": "/nonexistent",
                           "last_assistant_message": "I hope this helps!"})
        self.assertEqual(result.returncode, 2)

    def test_thinking_tells_reach_next_prompt(self):
        path = transcript(user("x"), assistant(
            {"type": "thinking", "thinking": "Let's dive in. At its core, this is simple."},
            {"type": "text", "text": "Done. The file is saved."}))
        stop = run_hook({"hook_event_name": "Stop", "session_id": "t3", "transcript_path": path})
        self.assertEqual(stop.returncode, 0, stop.stderr)
        prompt = run_hook({"hook_event_name": "UserPromptSubmit", "session_id": "t3", "prompt": "next"})
        context = json.loads(prompt.stdout)["hookSpecificOutput"]["additionalContext"]
        self.assertIn("thinking in the last turn", context)
        again = run_hook({"hook_event_name": "UserPromptSubmit", "session_id": "t3", "prompt": "next"})
        self.assertNotIn("thinking in the last turn", again.stdout)

    def test_session_start_injects_rules(self):
        result = run_hook({"hook_event_name": "SessionStart", "session_id": "t4"})
        out = json.loads(result.stdout)["hookSpecificOutput"]
        self.assertEqual(out["hookEventName"], "SessionStart")
        self.assertIn("Humanizer is on", out["additionalContext"])


if __name__ == "__main__":
    unittest.main()
