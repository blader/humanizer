#!/usr/bin/env python3
"""
Structural validator for humanizer-classics.

Checks that the skill is internally consistent before a PR is opened:
- SKILL.md frontmatter parses as YAML
- Every Read references/*.md directive in SKILL.md points to an existing file
- Rule IDs are consistent across SKILL.md catalog, _rule-index.md, and reference sections
- Each book rule has the required structural sections (Source, pull-quote, Cross-references,
  Context tags, Detection cue, Problem, Before, After, How to apply)
- Every corpus sample has its .expected-fixes.md pair and cites valid rule IDs

Does NOT check behavioral correctness — that requires running the skill against the corpus
in a Claude Code session (see REVIEWING.md).

Usage:
    cd humanizer-classics/
    python3 tests/validate.py

Exit code 0 = all checks pass. Non-zero = at least one check failed.
"""

import os
import re
import sys

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML required. Install with: pip install pyyaml")
    sys.exit(2)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def check_frontmatter():
    path = os.path.join(ROOT, "SKILL.md")
    with open(path) as f:
        content = f.read()
    parts = content.split("---", 2)
    if len(parts) < 3:
        return False, "SKILL.md has no frontmatter delimiters"
    try:
        fm = yaml.safe_load(parts[1])
    except yaml.YAMLError as e:
        return False, f"SKILL.md frontmatter is not valid YAML: {e}"
    required = ["name", "version", "description", "license", "compatibility", "allowed-tools"]
    missing = [k for k in required if k not in fm]
    if missing:
        return False, f"SKILL.md frontmatter missing keys: {missing}"
    return True, f"SKILL.md frontmatter OK (name={fm['name']}, version={fm['version']})"


def check_references_resolve():
    path = os.path.join(ROOT, "SKILL.md")
    with open(path) as f:
        content = f.read()
    refs = set(re.findall(r"references/[A-Za-z0-9_\-]+\.md", content))
    missing = []
    for r in refs:
        if not os.path.isfile(os.path.join(ROOT, r)):
            missing.append(r)
    if missing:
        return False, f"SKILL.md references missing files: {missing}"
    return True, f"All {len(refs)} references/*.md directives in SKILL.md resolve to real files"


def collect_rule_ids():
    with open(os.path.join(ROOT, "SKILL.md")) as f:
        skill_ids = set(re.findall(r"\| ([WZSH]-\d+) \|", f.read()))
    with open(os.path.join(ROOT, "references", "_rule-index.md")) as f:
        index_ids = set(re.findall(r"\| ([WZSH]-\d+) \|", f.read()))
    ref_ids = set()
    for fname in [
        "wikipedia-signs-of-ai-writing.md",
        "zinsser-on-writing-well.md",
        "strunk-and-white-elements-of-style.md",
        "hbr-guide-better-business-writing.md",
    ]:
        with open(os.path.join(ROOT, "references", fname)) as f:
            ref_ids.update(re.findall(r"^### ([WZSH]-\d+)\.", f.read(), re.M))
    return skill_ids, index_ids, ref_ids


def check_id_consistency():
    skill_ids, index_ids, ref_ids = collect_rule_ids()
    problems = []
    if skill_ids - ref_ids:
        problems.append(f"in SKILL.md but no reference section: {sorted(skill_ids - ref_ids)}")
    if index_ids - ref_ids:
        problems.append(f"in _rule-index.md but no reference section: {sorted(index_ids - ref_ids)}")
    if ref_ids - skill_ids:
        problems.append(f"defined in reference but not in SKILL.md catalog: {sorted(ref_ids - skill_ids)}")
    if ref_ids - index_ids:
        problems.append(f"defined in reference but not in _rule-index.md: {sorted(ref_ids - index_ids)}")
    if problems:
        return False, "Rule ID inconsistency: " + "; ".join(problems)
    return True, f"All {len(ref_ids)} rule IDs consistent across SKILL.md, _rule-index.md, and reference files"


def check_rule_structure():
    """Each book rule needs: Source, pull-quote (>), Cross-references, Context tags,
    Detection cue, Problem, Before, After, How to apply."""
    book_files = {
        "zinsser-on-writing-well.md": "Z",
        "strunk-and-white-elements-of-style.md": "S",
        "hbr-guide-better-business-writing.md": "H",
    }
    required_markers = [
        "**Source:**",
        "**Cross-references:**",
        "**Context tags:**",
        "**Detection cue:**",
        "**Problem:**",
        "**Before**",
        "**After**",
        "**How to apply:**",
    ]
    problems = []
    total_rules = 0
    for fname, prefix in book_files.items():
        path = os.path.join(ROOT, "references", fname)
        with open(path) as f:
            content = f.read()
        rule_ids = re.findall(r"^### ([WZSH]-\d+)\. ", content, re.M)
        blocks = re.split(r"^### [WZSH]-\d+\. ", content, flags=re.M)
        for i, body in enumerate(blocks[1:], start=1):
            rid = rule_ids[i - 1]
            missing = [m for m in required_markers if m not in body]
            if missing:
                problems.append(f"{fname} {rid}: missing {missing}")
            total_rules += 1
    if problems:
        return False, "Rule structure problems: " + "; ".join(problems)
    return True, f"All {total_rules} book rules have required structural sections"


def check_corpus_pairs():
    corpus_dir = os.path.join(ROOT, "tests", "corpus")
    if not os.path.isdir(corpus_dir):
        return True, "tests/corpus/ does not exist (no corpus check)"
    files = os.listdir(corpus_dir)
    inputs = sorted(f for f in files if f.endswith(".md") and not f.endswith(".expected-fixes.md"))
    fixes = sorted(f for f in files if f.endswith(".expected-fixes.md"))
    problems = []
    for inp in inputs:
        if inp.replace(".md", ".expected-fixes.md") not in fixes:
            problems.append(f"{inp}: no .expected-fixes.md pair")
        with open(os.path.join(corpus_dir, inp)) as f:
            head = f.read(500)
        if "context:" not in head:
            problems.append(f"{inp}: missing 'context:' tag in frontmatter")
    # Validate cited rule IDs in expected-fixes are real
    _, _, valid_ids = collect_rule_ids()
    for fix in fixes:
        with open(os.path.join(corpus_dir, fix)) as f:
            cited = set(re.findall(r"\b([WZSH]-\d+)\b", f.read()))
        invalid = cited - valid_ids
        if invalid:
            problems.append(f"{fix}: references invalid rule IDs {sorted(invalid)}")
    if problems:
        return False, "Corpus problems: " + "; ".join(problems)
    return True, f"All {len(inputs)} corpus samples paired and cite valid rule IDs"


def main():
    checks = [
        ("SKILL.md frontmatter", check_frontmatter),
        ("references/*.md resolve", check_references_resolve),
        ("rule ID consistency", check_id_consistency),
        ("rule structural format", check_rule_structure),
        ("corpus pairs and IDs", check_corpus_pairs),
    ]
    failures = 0
    for name, fn in checks:
        ok, msg = fn()
        marker = "PASS" if ok else "FAIL"
        print(f"[{marker}] {name}: {msg}")
        if not ok:
            failures += 1
    print()
    if failures == 0:
        print(f"All {len(checks)} structural checks passed.")
        print("Note: behavioral correctness (rules actually firing on corpus) requires running")
        print("/humanizer-classics in a Claude Code session — see REVIEWING.md.")
        return 0
    print(f"{failures} of {len(checks)} checks failed. Fix before opening a PR.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
