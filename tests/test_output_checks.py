#!/usr/bin/env python3
"""Unit tests for behavior-test assertions; no agent or network required."""

from __future__ import annotations

import importlib.util
import subprocess
import unittest
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parent.parent
SPEC = importlib.util.spec_from_file_location(
    "run_behavior_tests", ROOT / "tests" / "run_behavior_tests.py"
)
assert SPEC and SPEC.loader
RUNNER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(RUNNER)


class OutputChecksTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.cases = {case["id"]: case for case in RUNNER.load_cases()}

    def test_reversed_numeric_relation_fails(self) -> None:
        failures = RUNNER.check_output(
            self.cases["zh_forced_numbering"], "冷启动时间从 2 秒升到 4 秒。"
        )
        self.assertTrue(
            any("required pattern" in failure for failure in failures), failures
        )

    def test_non_numeric_fabrication_fails(self) -> None:
        output = (
            "团队实行双人复核。过去一个月，发布失败率从 8% 降到 3%，"
            "回滚次数从 5 次降到 2 次。"
        )
        failures = RUNNER.check_output(
            self.cases["zh_no_invented_specifics"], output
        )
        self.assertTrue(
            any("双人复核" in failure for failure in failures), failures
        )

    def test_report_wrapper_fails(self) -> None:
        failures = RUNNER.check_output(
            self.cases["zh_forced_numbering"],
            "改写如下：\n冷启动时间从 4 秒降到 2 秒。",
        )
        self.assertIn("output contains a report label instead of only the final text", failures)

    def test_cjk_adjacent_new_number_fails(self) -> None:
        failures = RUNNER.check_output(
            {"input": "原文没有数字。", "no_new_numbers": True}, "新增2025年。"
        )
        self.assertTrue(any("2025" in failure for failure in failures), failures)

    def test_number_extraction_keeps_decimal_time_and_unit(self) -> None:
        self.assertEqual(
            RUNNER.NUMBER_RE.findall("样本新增216份，F1=0.87，22:00，2MB"),
            ["216", "0.87", "22:00", "2"],
        )

    def test_relation_assertions_accept_valid_variants(self) -> None:
        self.assertEqual(
            RUNNER.check_output(
                self.cases["zh_forced_numbering"], "冷启动时间从 4 秒降至 2 秒。"
            ),
            [],
        )
        self.assertEqual(
            RUNNER.check_output(
                self.cases["zh_no_invented_specifics"],
                "过去一个月，发布失败率从 8% 降至 3%，回滚次数从 5 次降至 2 次。",
            ),
            [],
        )

    def test_quoted_windows_executable_path(self) -> None:
        command = RUNNER.parse_agent_command(
            r'"C:\Program Files\Claude\claude.exe" -p --tools=""'
        )
        self.assertEqual(command[0], r"C:\Program Files\Claude\claude.exe")
        self.assertEqual(command[1:], ["-p", "--tools="])

    def test_subprocess_uses_utf8(self) -> None:
        completed = subprocess.CompletedProcess(["agent"], 0, "终稿", "")
        with mock.patch.object(RUNNER.subprocess, "run", return_value=completed) as run:
            self.assertEqual(RUNNER.run_agent(["agent"], "中文", 10), "终稿")
        self.assertEqual(run.call_args.kwargs["encoding"], "utf-8")
        self.assertEqual(run.call_args.kwargs["errors"], "replace")


if __name__ == "__main__":
    unittest.main()
