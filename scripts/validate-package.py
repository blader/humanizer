#!/usr/bin/env python3
"""Check Humanizer's package files without external dependencies."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def read_package_file(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except OSError as error:
        raise SystemExit(f"Cannot read {path.relative_to(ROOT)}: {error}")


SKILL_PATH = ROOT / "SKILL.md"
SKILL = read_package_file(SKILL_PATH)
README = read_package_file(ROOT / "README.md")
try:
    PLUGIN = json.loads(read_package_file(ROOT / ".claude-plugin" / "plugin.json"))
except json.JSONDecodeError as error:
    raise SystemExit(f"Fix the JSON in .claude-plugin/plugin.json: {error}")


def require_match(match: re.Match[str] | None, message: str) -> re.Match[str]:
    if match is None:
        raise SystemExit(message)
    return match


yaml_metadata = require_match(
    re.match(r"\A---\n(.*?)\n---\n", SKILL, re.DOTALL),
    "SKILL.md must begin with YAML metadata",
).group(1)

for unsupported_field in ("version:", "compatibility:", "allowed-tools:"):
    if re.search(rf"(?m)^{re.escape(unsupported_field)}", yaml_metadata):
        raise SystemExit(f"Remove unsupported YAML field: {unsupported_field[:-1]}")

skill_version = require_match(
    re.search(r'(?m)^\s+version:\s*["\']?([0-9]+\.[0-9]+\.[0-9]+)["\']?\s*$', yaml_metadata),
    "Add metadata.version to SKILL.md as a three-part version",
).group(1)
readme_version = require_match(
    re.search(r"(?m)^- \*\*([0-9]+\.[0-9]+\.[0-9]+)\*\*", README),
    "Add a version entry to README.md",
).group(1)

package_versions = {skill_version, readme_version, str(PLUGIN.get("version", ""))}
if len(package_versions) != 1:
    raise SystemExit(
        f"Use one package version in all files: {sorted(package_versions)}"
    )

skill_files = {path.relative_to(ROOT) for path in ROOT.rglob("SKILL.md")}
if SKILL_PATH.is_symlink() or skill_files != {Path("SKILL.md")}:
    raise SystemExit("Keep one regular SKILL.md at the repo root")
if PLUGIN.get("skills") != ["./"]:
    raise SystemExit("Point the Claude plugin skill loader at the repo root")

skill_name = require_match(
    re.search(r"(?m)^name:\s*(\S+)\s*$", yaml_metadata),
    "Add a name field to SKILL.md metadata",
).group(1)
if PLUGIN.get("name") != skill_name:
    raise SystemExit(
        f"plugin.json name ({PLUGIN.get('name')!r}) must match SKILL.md name ({skill_name!r})"
    )

referenced_files = sorted(set(re.findall(r"references/[\w.-]+\.md", SKILL)))
missing_references = [ref for ref in referenced_files if not (ROOT / ref).is_file()]
if missing_references:
    raise SystemExit(f"SKILL.md points to a missing file: {missing_references}")

pattern_numbers = [
    int(number)
    for number in re.findall(r"(?m)^### ([0-9]+)\. ", SKILL)
]
pattern_count = len(pattern_numbers)
if pattern_count == 0 or pattern_numbers != list(range(1, pattern_count + 1)):
    raise SystemExit(f"Number SKILL.md patterns from 1 upward without gaps: {pattern_numbers}")

readme_numbers = [
    int(number) for number in re.findall(r"(?m)^\| ([0-9]+) \|", README)
]
if sorted(readme_numbers) != pattern_numbers:
    raise SystemExit(
        f"List patterns 1 through {pattern_count} once each in the README tables: {sorted(readme_numbers)}"
    )
if f"## The {pattern_count} patterns" not in README:
    raise SystemExit(f"Title the README pattern section 'The {pattern_count} patterns'")

if len(SKILL.splitlines()) > 400:
    raise SystemExit("Keep SKILL.md at 400 lines or fewer")

print(
    f"{skill_name} package v{skill_version} is valid "
    f"({pattern_count} patterns, {len(referenced_files)} reference files)"
)
