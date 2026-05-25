#!/usr/bin/env python3
"""Lightweight post-run checks for the humanizer voice calibration eval.

Caliper's autorater decides pass/fail from the transcript. This script adds
cheap, explainable checks over the saved results JSON so regressions are easier
to inspect in CI logs.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


AI_TELLS = [
    "rapidly evolving landscape",
    "pivotal milestone",
    "serves as",
    "seamless",
    "unlock",
    "let's dive in",
    "i hope this message finds you well",
    "future looks bright",
    "journey toward excellence",
]


def iter_outputs(results: dict) -> list[tuple[str, str]]:
    outputs: list[tuple[str, str]] = []
    for task in results.get("task_results", []):
        name = task.get("task_name", "unknown")
        for attempt in task.get("attempts", []):
            output = attempt.get("output") or ""
            outputs.append((name, output))
    return outputs


def check_output(task: str, output: str) -> list[str]:
    checked = final_rewrite(output)
    text = checked.lower()
    failures: list[str] = []

    if task != "no_sample_default" and not has_voice_card(output):
        failures.append(f"{task}: did not include a voice card before rewriting")

    for tell in AI_TELLS:
        if tell in text:
            failures.append(f"{task}: left AI tell {tell!r}")

    if re.search(r"\*\*[^*\n]+:\*\*", checked):
        failures.append(f"{task}: used bold inline-header formatting")

    if checked.count("—") > 1:
        failures.append(f"{task}: used more than one em dash")

    if task == "dry_technical_voice" and re.search(r"\bI\b|\bwe\b|\bmy\b|\bour\b", checked):
        failures.append(f"{task}: added first-person language to dry technical voice")

    if task == "casual_email_voice" and "quick" not in text and "worked" not in text:
        failures.append(f"{task}: did not preserve casual/plain email wording")

    return failures


def has_voice_card(output: str) -> bool:
    head = output[:1000].lower()
    return "voice card" in head or "voice target" in head or "style target" in head


def final_rewrite(output: str) -> str:
    """Return the final rewrite section when the skill uses its standard format."""
    patterns = [
        r"\*\*Final rewrite\*\*\s*(.*?)(?:\n\s*\*\*Changes made\*\*|\Z)",
        r"Final rewrite\s*\n+(.+?)(?:\n\s*Changes made|\Z)",
    ]
    for pattern in patterns:
        match = re.search(pattern, output, flags=re.IGNORECASE | re.DOTALL)
        if match:
            return match.group(1).strip()
    return output


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("results", type=Path, help="Path to Caliper results.json")
    args = parser.parse_args()

    results = json.loads(args.results.read_text())
    failures: list[str] = []
    for task, output in iter_outputs(results):
        failures.extend(check_output(task, output))

    if failures:
        print("Voice assertion failures:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print("Voice assertions passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
