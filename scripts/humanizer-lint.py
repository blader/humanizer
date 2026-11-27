#!/usr/bin/env python3
"""Score prose for Humanizer's AI tells with a small linear model.

The approach follows ste-lint: strip code and quotations, count each tell as
a feature, normalize by length, and report. Each feature has a weight. The
weighted sum plus a bias gives a logistic score from 0 to 1.

A text is flagged when it has a hard tell (one that justifies an edit on one
sighting, per SKILL.md) or when its score reaches THRESHOLD. Short texts are
flagged only for hard tells, because rates are noisy below MIN_WORDS.

Usage:
  humanizer-lint.py FILE...     one summary line per file
  humanizer-lint.py < text      full JSON report
"""

from __future__ import annotations

import json
import math
import re
import statistics
import sys
from dataclasses import dataclass

THRESHOLD = 0.5
MIN_WORDS = 40
BIAS = -3.0


@dataclass(frozen=True)
class Lexical:
    ref: str  # SKILL.md pattern, such as "§1"
    name: str
    pattern: re.Pattern[str]
    weight: float
    hard: bool = False  # flag on one sighting
    cap: int = 3  # extra hits past this add nothing


def rx(*alternatives: str, flags: int = re.I) -> re.Pattern[str]:
    return re.compile("|".join(alternatives), flags)


LEXICAL: list[Lexical] = [
    Lexical("§1", "Not X but Y", rx(
        r"\bnot (?:just|only|merely|simply)\b[^.!?\n]{1,80}?\bbut\b",
        r"\b(?:it'?s|this is|that'?s|it is) not\b[^.!?;\n]{1,60}?[,;]\s*(?:it'?s|this is|that'?s|it is)\b",
    ), 2.5, hard=True),
    Lexical("§1", "Split contrast", rx(
        r"\b(?:this|that|it) (?:does not|doesn'?t) mean\b[^.!?\n]{1,80}[.!?]\s+(?:it|this|that) means\b",
    ), 2.0, hard=True),
    Lexical("§2", "One-line closer", rx(
        r"\blet that sink in\b", r"\bread that again\b", r"\bthat is the real win\b",
        r"\bthat distinction matters\b", r"\bevery\. single\. \w+", r"\bthe message was clear:",
    ), 2.5, hard=True),
    Lexical("§3", "Saying that sounds deep", rx(
        r"\bthe real question is\b", r"\bat its core\b", r"\bwhat really matters\b",
        r"\bthe heart of the matter\b", r"\bthe deeper issue\b",
    ), 2.0, hard=True),
    Lexical("§4", "Staged run-up", rx(
        r"\blet'?s (?:dive in|dive into|break (?:this|it) down|be honest|explore)\b",
        r"\bhere'?s (?:what you need to know|the thing|the kicker|the catch)\b",
        r"\bwithout further ado\b", r"\breal talk\b", r"(?:^|[.!?]\s+)the thing is\b",
        r"(?:^|[.!?]\s+)(?:honestly|look)\?(?=\s|$)",
        r"\bthe (?:hard|tricky|interesting|new) part is\b",
        flags=re.I | re.M,
    ), 2.0, hard=True),
    Lexical("§5", "Arguing with no one", rx(
        r"\bI'?m not saying\b", r"\bdon'?t get me wrong\b", r"\bthis is not to say\b",
        r"\ba tempting approach would be\b", r"\bone might be tempted to\b",
        r"\bthis isn'?t (?:mainly |really )?about\b",
    ), 2.0, hard=True),
    Lexical("§8", "Dash as connector", re.compile(r"[—–]| -- "), 1.5, hard=True),
    Lexical("§12", "Overused AI word", rx(
        r"\bdelv(?:e|es|ed|ing)\b", r"\btapestry\b", r"\ba testament to\b",
    ), 2.0, hard=True),
    Lexical("§12", "Common AI word", rx(
        r"\bcrucial\b", r"\bpivotal\b", r"\bintricate\b", r"\bintricacies\b",
        r"\bmeticulous(?:ly)?\b", r"\bshowcas(?:e|es|ed|ing)\b", r"\bunderscor(?:e|es|ed|ing)\b",
        r"\binterplay\b", r"\bgarner(?:s|ed)?\b", r"\bbolster(?:s|ed)?\b", r"\bvibrant\b",
        r"\benduring\b", r"\bseamless(?:ly)?\b", r"\brobust\b", r"\bleverag(?:e|es|ed|ing)\b",
        r"\blandscape\b",
    ), 0.6, cap=5),
    Lexical("§13", "Inflated significance", rx(
        r"\bgame[- ]chang(?:er|ing)\b", r"\bparadigm shift\b", r"\brevolutioni[sz](?:e|es|ed|ing)\b",
        r"\bmarks? a (?:new|significant|pivotal) (?:era|milestone|chapter)\b",
        r"\bplays? a (?:crucial|vital|key|pivotal|significant) role\b",
    ), 1.2),
    Lexical("§22", "Chatbot residue", rx(
        r"\bI hope this helps\b", r"\bgreat question\b", r"\byou'?re absolutely right\b",
        r"(?:^|\n)\s*(?:certainly|of course|absolutely)!",
    ), 2.5, hard=True),
    Lexical("§22", "Chatbot offer", rx(
        r"\bfeel free to\b", r"\bhappy to help\b", r"\bwould you like me to\b",
        r"\blet me know if you(?:'d| would)? (?:like|want|need)\b",
    ), 1.0),
    Lexical("§23", "Knowledge-limit disclaimer", rx(
        r"\bas of my (?:last|latest) (?:update|training)\b", r"\bas an AI\b",
        r"\bmy knowledge cutoff\b",
    ), 2.0, hard=True),
]

STRIP = [
    re.compile(r"```.*?```|~~~.*?~~~", re.S),  # fenced code
    re.compile(r"<!--.*?-->", re.S),  # HTML comments
    re.compile(r"`[^`\n]*`"),  # inline code
    re.compile(r"https?://\S+"),  # URLs
    re.compile(r"(?m)^\s*>.*$"),  # blockquotes
    re.compile(r"\"[^\"\n]{1,200}\"|“[^”\n]{1,200}”"),  # quoted phrases
]

WORD = re.compile(r"[A-Za-z0-9][A-Za-z0-9'\-]*")
TRIAD = re.compile(r"\b\w+(?: \w+){0,2}, \w+(?: \w+){0,2},? and \w+", re.I)
BOLD_LABEL = re.compile(r"(?m)^\s*(?:[-*+]|\d+[.)])\s+\*\*[^*\n]{1,40}:?\*\*:?")


def clean(text: str) -> str:
    """Blank out skipped spans but keep newlines so line numbers stay right."""
    for pattern in STRIP:
        text = pattern.sub(lambda m: re.sub(r"[^\n]", " ", m.group(0)), text)
    return text


def sentences(text: str) -> list[str]:
    found = []
    for line in text.split("\n"):
        if line.lstrip().startswith("|"):
            continue  # table row
        line = re.sub(r"^\s*(?:#{1,6}|[-*+]|\d+[.)])\s+", "", line.strip())
        if line:
            found.extend(s for s in re.split(r"(?<=[.!?])\s+(?=[A-Z0-9])", line) if s.strip())
    return found


def structural(cleaned: str, sents: list[str], words: int) -> dict[str, float]:
    """Rate features per 100 words, as in ste-lint."""
    per100 = 100.0 / max(words, 1)
    lengths = [len(WORD.findall(s)) for s in sents if WORD.findall(s)]
    cv = statistics.pstdev(lengths) / statistics.mean(lengths) if len(lengths) >= 5 else 0.5
    openers = [s.split()[0].lower() for s in sents if s.split()]
    repeated = sum(c - 1 for w, c in _counts(openers).items() if c >= 3 and w.isalpha())
    repeated_share = repeated / max(len(openers), 1)
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", cleaned) if p.strip()]
    closers = sum(
        1 for prev, cur in zip(paragraphs, paragraphs[1:])
        if len(sentences(cur)) == 1 and len(WORD.findall(cur)) <= 8
        and len(sentences(prev)) >= 2 and not cur.lstrip().startswith(("#", "-", "*", "|"))
    )
    return {
        "triad_rate": len(TRIAD.findall(cleaned)) * per100,
        "bold_label_rate": len(BOLD_LABEL.findall(cleaned)) * per100,
        "flat_rhythm": max(0.0, 0.45 - cv),  # low sentence-length variation
        "repeated_openers": max(0.0, repeated_share - 0.15),
        "short_closers": closers / max(len(paragraphs) - 1, 1),
    }


STRUCTURAL_WEIGHTS = {
    "triad_rate": ("§6", "Forced triads", 0.8),
    "bold_label_rate": ("§19", "Bold labels", 0.5),
    "flat_rhythm": ("§7", "Flat sentence rhythm", 4.0),
    "repeated_openers": ("§7", "Repeated sentence openings", 6.0),
    "short_closers": ("§2", "Short closer paragraphs", 3.0),
}


def _counts(items: list[str]) -> dict[str, int]:
    out: dict[str, int] = {}
    for item in items:
        out[item] = out.get(item, 0) + 1
    return out


def lint(text: str) -> dict:
    cleaned = clean(text)
    lines = text.splitlines()
    sents = sentences(cleaned)
    words = len(WORD.findall(cleaned))

    score = BIAS
    hard: list[str] = []
    findings: list[dict] = []
    for feature in LEXICAL:
        matches = list(feature.pattern.finditer(cleaned))
        if not matches:
            continue
        score += feature.weight * min(len(matches), feature.cap)
        for match in matches:
            line_no = cleaned.count("\n", 0, match.start()) + 1
            excerpt = lines[line_no - 1].strip() if line_no <= len(lines) else ""
            findings.append({
                "ref": feature.ref, "name": feature.name, "hard": feature.hard,
                "match": match.group(0).strip(), "line": line_no,
                "excerpt": excerpt if len(excerpt) <= 120 else excerpt[:117] + "...",
            })
        if feature.hard:
            hard.append(feature.ref)

    features = structural(cleaned, sents, words) if words >= MIN_WORDS else {}
    for key, value in features.items():
        ref, name, weight = STRUCTURAL_WEIGHTS[key]
        score += weight * value
        if weight * value >= 0.5:
            findings.append({"ref": ref, "name": name, "hard": False,
                             "match": f"{key}={value:.2f}", "line": 0, "excerpt": ""})

    probability = 1.0 / (1.0 + math.exp(-score))
    flagged = bool(hard) or (words >= MIN_WORDS and probability >= THRESHOLD)
    return {
        "words": words,
        "sentences": len(sents),
        "score": round(probability, 3),
        "flagged": flagged,
        "hard_tells": sorted(set(hard), key=lambda r: int(r[1:])),
        "features": {k: round(v, 3) for k, v in features.items()},
        "findings": findings,
    }


def format_findings(report: dict, limit: int = 12) -> str:
    rows = []
    for f in report["findings"][:limit]:
        where = f" (line {f['line']}: {f['excerpt']})" if f["line"] else ""
        rows.append(f"- {f['ref']} {f['name']}: {f['match']!r}{where}")
    extra = len(report["findings"]) - limit
    if extra > 0:
        rows.append(f"- ...and {extra} more")
    return "\n".join(rows)


def main() -> int:
    files = sys.argv[1:]
    if not files:
        print(json.dumps(lint(sys.stdin.read()), indent=2))
        return 0
    flagged_any = False
    for name in files:
        with open(name, encoding="utf-8") as source:
            report = lint(source.read())
        flagged_any |= report["flagged"]
        print(f"{name:40} words={report['words']:5d} score={report['score']:.2f} "
              f"flagged={str(report['flagged']).lower():5} hard={','.join(report['hard_tells']) or '-'}")
    return 1 if flagged_any else 0


if __name__ == "__main__":
    sys.exit(main())
