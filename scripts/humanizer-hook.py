#!/usr/bin/env python3
"""Enforce Humanizer in Claude Code through plugin hooks.

hooks/hooks.json runs this script on four events. It reads the event as JSON
on stdin and scores text with humanizer-lint.py.

- SessionStart, UserPromptSubmit: add the writing rules to the agent's
  context, so replies and thinking follow them from the start. Also report
  tells found in the previous turn's thinking, which cannot be rewritten.
- PreToolUse (Write, Edit, MultiEdit): score the text about to be written to
  a prose file. Exit code 2 blocks the write until the agent rewrites it.
- Stop: score the agent's final reply. Exit code 2 makes the agent send a
  rewritten reply. Score its thinking too and save the findings for the
  next prompt.

Set HUMANIZER_HOOK=off to turn every hook off.
"""

from __future__ import annotations

import importlib.util
import json
import os
import re
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("humanizer_lint", HERE / "humanizer-lint.py")
lint_module = importlib.util.module_from_spec(_spec)
sys.modules["humanizer_lint"] = lint_module
_spec.loader.exec_module(lint_module)
lint = lint_module.lint
format_findings = lint_module.format_findings

PROSE_EXTENSIONS = {".md", ".mdx", ".markdown", ".txt", ".rst", ".adoc"}

RULES = """Humanizer is on. Write replies, thinking, and prose files so they read like a person wrote them:
- State each point directly. No "not X but Y" contrasts, staged openers ("Here's the thing", "Let's dive in"), or one-line closers that repeat the point.
- No em dashes or en dashes; use a period, comma, colon, or parentheses.
- No chatbot wrappers ("Great question!", "I hope this helps"), no inflated words (delve, pivotal, crucial, tapestry, testament).
- Vary sentence length. Use lists of three only when there are three things. Bold only what the reader must not miss.
Prose writes and final replies with these tells are blocked until rewritten."""

REMINDER = "Humanizer is on: direct statements, no dashes, no staged openers or closers, no chatbot wrappers, in replies, thinking, and files."


def state_path(session_id: str) -> Path:
    base = os.environ.get("CLAUDE_PLUGIN_DATA") or tempfile.gettempdir()
    safe = re.sub(r"[^A-Za-z0-9_-]", "_", session_id or "default")
    return Path(base) / f"humanizer-{safe}.json"


def add_context(event_name: str, text: str) -> int:
    print(json.dumps({"hookSpecificOutput": {"hookEventName": event_name, "additionalContext": text}}))
    return 0


def on_context(event: dict, event_name: str) -> int:
    text = RULES if event_name == "SessionStart" else REMINDER
    path = state_path(event.get("session_id", ""))
    if path.exists():
        try:
            note = json.loads(path.read_text(encoding="utf-8")).get("thinking", "")
        except (OSError, json.JSONDecodeError):
            note = ""
        path.unlink(missing_ok=True)
        if note:
            text += "\n\nYour thinking in the last turn had AI tells. Avoid them this turn:\n" + note
    return add_context(event_name, text)


def written_text(tool_input: dict) -> str:
    if "content" in tool_input:
        return str(tool_input["content"])
    if "new_string" in tool_input:
        return str(tool_input["new_string"])
    return "\n".join(str(e.get("new_string", "")) for e in tool_input.get("edits", []))


def on_write(event: dict) -> int:
    tool_input = event.get("tool_input") or {}
    path = str(tool_input.get("file_path", ""))
    if Path(path).suffix.lower() not in PROSE_EXTENSIONS:
        return 0
    report = lint(written_text(tool_input))
    if not report["flagged"]:
        return 0
    print(
        f"Humanizer blocked this write to {path} (AI score {report['score']:.2f}):\n"
        f"{format_findings(report)}\n\n"
        "Rewrite the text with the humanizer skill so it states each point directly, "
        "then write it again. Keep every fact. A watched phrase is fine inside a quotation or code.",
        file=sys.stderr,
    )
    return 2


def last_turn(transcript_path: str) -> tuple[str, str]:
    """Return the text and thinking the agent wrote since the last user prompt."""
    texts: list[str] = []
    thinking: list[str] = []
    try:
        lines = Path(transcript_path).read_text(encoding="utf-8").splitlines()
    except OSError:
        return "", ""
    for line in reversed(lines):
        try:
            entry = json.loads(line)
        except json.JSONDecodeError:
            continue
        message = entry.get("message") or {}
        content = message.get("content")
        if entry.get("type") == "user":
            # A tool result is part of the same turn; a typed prompt ends it.
            if isinstance(content, str) or any(
                isinstance(b, dict) and b.get("type") == "text" for b in content or []
            ):
                break
            continue
        if entry.get("type") != "assistant" or not isinstance(content, list):
            continue
        for block in reversed(content):
            if block.get("type") == "text":
                texts.insert(0, block.get("text", ""))
            elif block.get("type") == "thinking" and block.get("thinking"):
                thinking.insert(0, block["thinking"])
    return "\n\n".join(texts), "\n\n".join(thinking)


def on_stop(event: dict) -> int:
    if event.get("stop_hook_active"):
        return 0  # The agent is already answering a block; do not loop.
    text, thinking = last_turn(event.get("transcript_path", ""))
    # The transcript holds every text block of the turn. Fall back to the
    # event field when the transcript is not written yet.
    reply = text or str(event.get("last_assistant_message") or "")

    if thinking:
        report = lint(thinking)
        if report["flagged"]:
            path = state_path(event.get("session_id", ""))
            try:
                path.write_text(json.dumps({"thinking": format_findings(report, 6)}), encoding="utf-8")
            except OSError:
                pass

    if not reply.strip():
        return 0
    report = lint(reply)
    if not report["flagged"]:
        return 0
    print(
        f"Humanizer: your last reply reads as AI-written (score {report['score']:.2f}):\n"
        f"{format_findings(report)}\n\n"
        "Send the reply again, rewritten with the humanizer skill. Keep every fact, "
        "command, path, and result. Do not mention this check.",
        file=sys.stderr,
    )
    return 2


def main() -> int:
    if os.environ.get("HUMANIZER_HOOK", "").lower() in {"off", "0", "false"}:
        return 0
    try:
        event = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0
    name = event.get("hook_event_name", "")
    if name in {"SessionStart", "UserPromptSubmit"}:
        return on_context(event, name)
    if name == "Stop":
        return on_stop(event)
    if name == "PreToolUse" or "tool_input" in event:
        return on_write(event)
    return 0


if __name__ == "__main__":
    sys.exit(main())
