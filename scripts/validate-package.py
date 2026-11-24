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
EN_RULES_PATH = ROOT / "references" / "en.md"
ZH_RULES_PATH = ROOT / "references" / "zh-CN.md"
EN_RULES = read_package_file(EN_RULES_PATH)
ZH_RULES = read_package_file(ZH_RULES_PATH)
README = read_package_file(ROOT / "README.md")
CHANGELOG = read_package_file(ROOT / "CHANGELOG.md")
try:
    PACKAGE = json.loads(read_package_file(ROOT / "package.json"))
except json.JSONDecodeError as error:
    raise SystemExit(f"Fix the JSON in package.json: {error}")
try:
    PLUGIN = json.loads(read_package_file(ROOT / ".claude-plugin" / "plugin.json"))
except json.JSONDecodeError as error:
    raise SystemExit(f"Fix the JSON in .claude-plugin/plugin.json: {error}")
try:
    CURSOR_PLUGIN = json.loads(
        read_package_file(ROOT / ".cursor-plugin" / "plugin.json")
    )
except json.JSONDecodeError as error:
    raise SystemExit(f"Fix the JSON in .cursor-plugin/plugin.json: {error}")


def require_match(match: re.Match[str] | None, message: str) -> re.Match[str]:
    if match is None:
        raise SystemExit(message)
    return match


def numbered_patterns(matches: list[tuple[str, str]], where: str) -> dict[int, str]:
    # A dict keeps only the last entry for a number, so check for repeats first.
    numbers = [int(number) for number, _ in matches]
    repeated = sorted({number for number in numbers if numbers.count(number) > 1})
    if repeated:
        raise SystemExit(f"Use each pattern number once in {where}: {repeated}")
    return {int(number): name for number, name in matches}


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
changelog_version = require_match(
    re.search(r"(?m)^## ([0-9]+\.[0-9]+\.[0-9]+)$", CHANGELOG),
    "Add a version heading to CHANGELOG.md",
).group(1)

package_versions = {
    skill_version,
    changelog_version,
    str(PLUGIN.get("version", "")),
    str(CURSOR_PLUGIN.get("version", "")),
}
if len(package_versions) != 1:
    raise SystemExit(
        f"Use one package version in all files: {sorted(package_versions)}"
    )

skill_files = {path.relative_to(ROOT) for path in ROOT.rglob("SKILL.md")}
if SKILL_PATH.is_symlink() or skill_files != {Path("SKILL.md")}:
    raise SystemExit("Keep one regular SKILL.md at the repo root")
if PLUGIN.get("skills") != ["./"]:
    raise SystemExit("Point the Claude plugin skill loader at the repo root")
if PACKAGE.get("pi", {}).get("skills") != ["./"]:
    raise SystemExit("Point the pi package skill loader at the repo root")
if "version" in PACKAGE:
    raise SystemExit("Do not add a version field to package.json; pi installs from git")
if CURSOR_PLUGIN.get("name") != "humanizer":
    raise SystemExit("Set the Cursor plugin name to humanizer")
if "skills" in CURSOR_PLUGIN:
    raise SystemExit("Omit skills from the Cursor plugin so it loads the root SKILL.md")

skill_description = " ".join(
    require_match(
        re.search(r"(?m)^description: \|\n((?:  .*\n)+)", yaml_metadata + "\n"),
        "Write the SKILL.md description as an indented block",
    ).group(1).split()
)
try:
    MARKETPLACE = json.loads(
        read_package_file(ROOT / ".claude-plugin" / "marketplace.json")
    )
except json.JSONDecodeError as error:
    raise SystemExit(f"Fix the JSON in .claude-plugin/marketplace.json: {error}")
package_descriptions = {
    str(PACKAGE.get("description", "")),
    str(PLUGIN.get("description", "")),
    str(CURSOR_PLUGIN.get("description", "")),
    *(str(plugin.get("description", "")) for plugin in MARKETPLACE.get("plugins", [])),
}
if len(package_descriptions) != 1 or not skill_description.startswith(
    next(iter(package_descriptions))
):
    raise SystemExit(
        "Use the first sentence of the SKILL.md description in every plugin manifest: "
        f"{sorted(package_descriptions)}"
    )


en_matches = re.findall(r"(?m)^### ([0-9]+)\. (.+)$", EN_RULES)
zh_matches = re.findall(r"(?m)^### ([0-9]+)\. (.+)$", ZH_RULES)
en_skill_patterns = numbered_patterns(en_matches, "references/en.md")
zh_skill_patterns = numbered_patterns(zh_matches, "references/zh-CN.md")

language_ranges = {}
for language, path in (("English", "en.md"), ("Chinese", "zh-CN.md")):
    route = require_match(
        re.search(
            rf"For {language} text, read `references/{re.escape(path)}` "
            r"and apply patterns ([0-9]+) to ([0-9]+)",
            SKILL,
        ),
        f"Route {language} text to references/{path} with an explicit pattern range",
    )
    language_ranges[language] = (int(route.group(1)), int(route.group(2)))

for language, patterns in (
    ("English", en_skill_patterns),
    ("Chinese", zh_skill_patterns),
):
    start, end = language_ranges[language]
    if list(patterns) != list(range(start, end + 1)):
        raise SystemExit(
            f"Keep {language} rules in their routed range {start}–{end}: "
            f"{list(patterns)}"
        )

skill_patterns = numbered_patterns(
    en_matches + zh_matches, "the language rule files"
)
pattern_numbers = list(skill_patterns)
pattern_count = len(pattern_numbers)
if pattern_count == 0 or pattern_numbers != list(range(1, pattern_count + 1)):
    raise SystemExit(
        "Number English then Chinese patterns from 1 upward without gaps: "
        f"{pattern_numbers}"
    )

readme_patterns = numbered_patterns(
    re.findall(r"(?m)^\| ([0-9]+) \| \*\*(.+?)\*\*", README), "the README tables"
)
if sorted(readme_patterns) != pattern_numbers:
    raise SystemExit(
        f"List patterns 1 through {pattern_count} once each in the README tables: {sorted(readme_patterns)}"
    )
renamed = [
    f"{number}: {readme_patterns[number]!r} should be {name!r}"
    for number, name in skill_patterns.items()
    if readme_patterns[number] != name
]
if renamed:
    raise SystemExit("Match the README pattern names to the language rules: " + "; ".join(renamed))
if f"## The {pattern_count} patterns" not in README:
    raise SystemExit(f"Title the README pattern section 'The {pattern_count} patterns'")

readme_groups = require_match(
    re.search(
        r"(?ms)^### English patterns \((?P<en_start>[0-9]+)–(?P<en_end>[0-9]+)\)\n"
        r"(?P<en_body>.*?)"
        r"^### Chinese patterns \((?P<zh_start>[0-9]+)–(?P<zh_end>[0-9]+)\)\n"
        r"(?P<zh_body>.*?)(?=^The full recognition criteria)",
        README,
    ),
    "Keep separate English and Chinese pattern groups in README.md",
)
for language, start_group, end_group in (
    ("English", "en_start", "en_end"),
    ("Chinese", "zh_start", "zh_end"),
):
    heading_range = (
        int(readme_groups.group(start_group)),
        int(readme_groups.group(end_group)),
    )
    if heading_range != language_ranges[language]:
        raise SystemExit(
            f"Match the README {language} heading range to SKILL.md: "
            f"{heading_range} should be {language_ranges[language]}"
        )

for language, expected, body in (
    ("English", en_skill_patterns, readme_groups.group("en_body")),
    ("Chinese", zh_skill_patterns, readme_groups.group("zh_body")),
):
    actual = numbered_patterns(
        re.findall(r"(?m)^\| ([0-9]+) \| \*\*(.+?)\*\*", body),
        f"the README {language} table",
    )
    if actual != expected:
        raise SystemExit(
            f"Match the README {language} table to its language rules and range"
        )

# A renumber can leave a section reference pointing at the wrong pattern or at
# nothing. CHANGELOG.md keeps the numbers each release used, so read only the
# shared skill and current language rules.
skill_references = sorted(
    {
        int(number)
        for text in (SKILL, EN_RULES, ZH_RULES)
        for number in re.findall(r"§([0-9]+)", text)
    }
)
missing_patterns = [
    number for number in skill_references if not 1 <= number <= pattern_count
]
if missing_patterns:
    raise SystemExit(
        f"Point every section reference at a pattern from 1 to "
        f"{pattern_count}: {missing_patterns}"
    )

# Each use loads the shared skill and one language file, except mixed text.
# Apply the old word budget to each complete load rather than to both languages.
for language, rules in (("English", EN_RULES), ("Chinese", ZH_RULES)):
    skill_words = len((SKILL + "\n" + rules).split())
    if skill_words > 5500:
        raise SystemExit(
            f"Keep the {language} skill load at 5,500 words or fewer; "
            f"it has {skill_words}"
        )

print(f"Humanizer package v{skill_version} is valid with {pattern_count} patterns")
