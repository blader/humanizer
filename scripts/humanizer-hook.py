#!/usr/bin/env python3
"""Block prose writes that contain Humanizer's strongest AI tells.

Claude Code runs this as a PreToolUse hook on Write, Edit, and MultiEdit.
It reads the tool call as JSON on stdin and checks only the text the agent
is about to write into a prose file. Exit code 2 blocks the write and sends
the findings back to the agent. Exit code 0 lets the write through.

Set HUMANIZER_HOOK=off to turn the hook off.
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

PROSE_EXTENSIONS = {".md", ".mdx", ".markdown", ".txt", ".rst", ".adoc"}

# Only tells that justify an edit on one sighting. Weak tells need context
# that a regex cannot see, so the skill handles them, not this hook.
CHECKS: list[tuple[str, str, re.Pattern[str]]] = [
    (
        "§1",
        "Not X but Y",
        re.compile(
            r"\bnot (?:just|only|merely|simply)\b[^.!?\n]{1,80}?\bbut\b"
            r"|\b(?:it'?s|this is|that'?s|it is) not\b[^.!?;\n]{1,60}?[,;]\s*"
            r"(?:it'?s|this is|that'?s|it is)\b",
            re.I,
        ),
    ),
    (
        "§2",
        "One-line closer",
        re.compile(
            r"\blet that sink in\b|\bread that again\b|\bthat is the real win\b"
            r"|\bthat distinction matters\b|\bevery\. single\. \w+",
            re.I,
        ),
    ),
    (
        "§3",
        "Saying that sounds deep",
        re.compile(
            r"\bthe real question is\b|\bat its core\b|\bwhat really matters\b"
            r"|\bthe heart of the matter\b|\bthe deeper issue\b",
            re.I,
        ),
    ),
    (
        "§4",
        "Staged run-up",
        re.compile(
            r"\blet'?s (?:dive in|dive into|break (?:this|it) down|be honest)\b"
            r"|\bhere'?s (?:what you need to know|the thing)\b|\bwithout further ado\b"
            r"|\breal talk\b|(?:^|[.!?]\s+)(?:honestly|look)\?(?=\s|$)",
            re.I | re.M,
        ),
    ),
    (
        "§5",
        "Arguing with no one",
        re.compile(
            r"\bI'?m not saying\b|\bdon'?t get me wrong\b|\bthis is not to say\b"
            r"|\ba tempting approach would be\b|\bone might be tempted to\b",
            re.I,
        ),
    ),
    ("§8", "Dash as connector", re.compile(r"[—–]| -- ")),
    (
        "§12",
        "Overused AI word",
        re.compile(r"\bdelv(?:e|es|ed|ing)\b|\btapestry\b|\ba testament to\b", re.I),
    ),
    (
        "§22",
        "Chatbot residue",
        re.compile(
            r"\bI hope this helps\b|\bgreat question\b|\byou'?re absolutely right\b"
            r"|(?:^|\n)\s*(?:certainly|of course)!",
            re.I,
        ),
    ),
]

STRIP = [
    re.compile(r"```.*?```|~~~.*?~~~", re.S),  # fenced code
    re.compile(r"<!--.*?-->", re.S),  # HTML comments
    re.compile(r"`[^`\n]*`"),  # inline code
    re.compile(r"https?://\S+"),  # URLs
    re.compile(r"(?m)^\s*>.*$"),  # blockquotes (quotations)
    re.compile(r"\"[^\"\n]{1,200}\"|“[^”\n]{1,200}”"),  # quoted phrases
]


def new_text(tool_input: dict) -> str:
    if "content" in tool_input:
        return str(tool_input["content"])
    if "new_string" in tool_input:
        return str(tool_input["new_string"])
    return "\n".join(str(edit.get("new_string", "")) for edit in tool_input.get("edits", []))


def clean(text: str) -> str:
    # Blank out skipped spans but keep newlines so line numbers stay right.
    for pattern in STRIP:
        text = pattern.sub(lambda m: re.sub(r"[^\n]", " ", m.group(0)), text)
    return text


def findings(text: str) -> list[str]:
    cleaned = clean(text)
    lines = text.splitlines()
    found = []
    for ref, name, pattern in CHECKS:
        for match in pattern.finditer(cleaned):
            line_no = cleaned.count("\n", 0, match.start()) + 1
            excerpt = lines[line_no - 1].strip() if line_no <= len(lines) else ""
            if len(excerpt) > 120:
                excerpt = excerpt[:117] + "..."
            found.append(f"- {ref} {name}: {match.group(0).strip()!r} (line {line_no}: {excerpt})")
    return found


def main() -> int:
    if os.environ.get("HUMANIZER_HOOK", "").lower() in {"off", "0", "false"}:
        return 0
    try:
        event = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0
    tool_input = event.get("tool_input") or {}
    path = str(tool_input.get("file_path", ""))
    if Path(path).suffix.lower() not in PROSE_EXTENSIONS:
        return 0

    found = findings(new_text(tool_input))
    if not found:
        return 0

    print(
        f"Humanizer blocked this write to {path}: the text has {len(found)} AI tell(s).\n"
        + "\n".join(found)
        + "\n\nRewrite the text with the humanizer skill so it states each point "
        "directly, then write it again. Keep every fact. A watched phrase is fine "
        "inside a quotation or code.",
        file=sys.stderr,
    )
    return 2


if __name__ == "__main__":
    sys.exit(main())
