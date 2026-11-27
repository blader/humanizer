#!/usr/bin/env python3
"""Score prose for Humanizer's AI tells with a small linear model.

The approach follows ste-lint: strip code and quotations, count each tell as
a feature, normalize by length, and report. Each feature has a weight. The
weighted sum plus a bias gives a logistic score from 0 to 1.

A text is flagged when it has a hard tell (one that justifies an edit on one
sighting, per SKILL.md) or when its score reaches THRESHOLD. Under MIN_WORDS,
only hard tells count, because rates are noisy in short texts.

Weights for stock AI words come from published frequency ratios (Kobak et
al., Sci. Adv. 2025; Reinhart et al., PNAS 2025). Other weights follow the
strength order in SKILL.md. Passive voice and type-token ratio are left out
on purpose: AI text uses less passive voice than people do, and the
direction of type-token ratio changes with the model (El Attar et al. 2026).

Usage:
  humanizer-lint.py FILE...     one summary line per file; exit 1 if any is flagged
  humanizer-lint.py < text      full JSON report
"""

from __future__ import annotations

import json
import math
import re
import statistics
import sys
from dataclasses import dataclass

BIAS = -3.0
THRESHOLD = 0.5
MIN_WORDS = 20  # below this, only hard tells count
RHYTHM_WORDS = 40  # below this, skip rhythm and paragraph features
SCALE_WORDS = 200  # non-hard features count per this many words


@dataclass(frozen=True)
class Lexical:
    ref: str  # SKILL.md pattern, such as "§1"
    name: str
    pattern: re.Pattern[str]
    weight: float
    cap: int = 2  # hits past this add nothing
    hard: bool = False  # flags the text on one sighting


def rx(*alternatives: str, flags: int = re.I | re.M) -> re.Pattern[str]:
    return re.compile("|".join(alternatives), flags)


START = r"(?:^|[.!?]\s+)"  # start of a sentence

LEXICAL: list[Lexical] = [
    Lexical("§1", "Not X but Y", rx(
        r"\bnot (?:just|only|merely|simply)\b[^.!?\n]{1,80}?\bbut\b",
        r"\b(?:it'?s|this is|that'?s|it is|is|are|was) not\b[^.!?;\n]{1,60}?[,;]\s*(?:it'?s|this is|that'?s|it is|but)\b",
        r"\b(?:isn'?t|aren'?t|wasn'?t)\b[^.!?;\n]{1,60}?[,;]\s*(?:it'?s|they'?re|this is|that'?s|it was)\b",
        r"\b(?:isn'?t|is not|aren'?t|wasn'?t) (?:the|a|an|about)\b[^.!?\n]{1,60}\.\s+(?:It'?s|It is|It was|They'?re)\b",
        r"\b(?:does not|doesn'?t) mean\b[^.!?\n]{1,80}[.!?]\s+(?:it|this|that) means\b",
        r"\bnot because\b[^.!?\n]{1,80}[.,]\s+(?:but )?because\b",
    ), 2.5, hard=True),
    Lexical("§2", "One-line closer", rx(
        r"\blet that sink in\b", r"\bread that again\b", r"\bthat(?: is|'s) the real (?:win|story|lesson)\b",
        r"\bthat distinction matters\b", r"\bevery\. single\. \w+", r"\bthe message was clear\b",
        START + r"(?:problem solved|full stop|end of story)\.(?=\s|$)",
    ), 2.5, hard=True),
    Lexical("§2", "Fragment run", re.compile(
        r"(?:\b(?:No|Not|Zero|Just) \w+(?: \w+)?\.\s+){2,}(?:No|Not|Zero|Just) \w+"
    ), 2.0, hard=True),
    Lexical("§3", "Saying that sounds deep", rx(
        r"\bthe real (?:question|issue|problem|story) (?:is|here)\b", r"\bat its core\b",
        r"\bwhat (?:really|truly) matters\b", r"\bthe heart of the matter\b",
        r"\bthe deeper (?:issue|question|problem)\b", r"\bis the (?:language|currency|architecture) of\b",
        r"\bthe (?:uncomfortable )?truth is\b", r"\bthe reality is\b", r"\bat the end of the day\b",
    ), 2.0, hard=True),
    Lexical("§4", "Staged run-up", rx(
        r"\blet'?s (?:dive in|dive into|break (?:this|it) down|be honest|explore|unpack)\b",
        r"\bhere'?s (?:what you need to know|the thing|the kicker|the catch|the deal)\b",
        r"\bwithout further ado\b", r"\breal talk\b", START + r"the thing is\b",
        r"\bmake no mistake\b", r"\blet me (?:walk you through|be clear)\b",
        r"\bin today'?s (?:fast-paced|digital|modern|ever)", START + r"(?:honestly|look)\?(?=\s|$)",
        r"\bthe (?:hard|tricky|interesting|new|best) part(?: is\b|\?)",
        START + r"(?:the|our) (?:result|catch|answer|kicker|twist|culprit)\?",
    ), 2.0, hard=True),
    Lexical("§4", "Rhetorical question setup", rx(
        START + r"(?:Why|What|How|So what|Sound familiar)[^.?!\n]{0,50}\?\s+(?:Because|It'?s|The answer|Simple|Here'?s|That'?s)\b",
        START + r"what if\b",
    ), 1.5),
    Lexical("§5", "Arguing with no one", rx(
        r"\bI'?m not saying\b", r"\bdon'?t get me wrong\b", r"\bthis is not to say\b",
        START + r"to be clear,", r"\ba tempting approach would be\b", r"\bone might be tempted to\b",
        r"\bthis isn'?t (?:mainly |really |just )?about\b", r"\bsome might (?:say|argue)\b",
    ), 2.0, hard=True),
    Lexical("§12", "Strong AI word", rx(
        r"\bdelv(?:e|es|ed|ing)\b", r"\btapestr(?:y|ies)\b", r"\btestament\b",
        r"\bunderscor(?:e|es|ed|ing)\b(?! (?:character|prefix|separator))", r"\bshowcas(?:e|es|ed|ing)\b",
    ), 1.5, cap=3),
    Lexical("§12", "Common AI word", rx(
        r"\bcrucial(?:ly)?\b", r"\bpivotal\b", r"\bintricat(?:e|ely|acies)\b", r"\bmeticulous(?:ly)?\b",
        r"\binterplay\b", r"\bgarner\w*", r"\bbolster\w*", r"\bvibrant\b", r"\benduring\b",
        START + r"additionally,", r"\bnotably\b", r"\bcomprehensive\b", r"\benhanc(?:e|es|ed|ing)\b",
        r"\bfoster(?:s|ed|ing)?\b", r"\brealm\b", r"\bmultifaceted\b", r"\binvaluable\b", r"\bnuanced\b",
        r"\blandscape\b", r"\bleverag\w*", r"\bseamless(?:ly)?\b", r"\brobust\b", r"\bholistic\b", r"\bparamount\b",
    ), 0.6, cap=5),
    Lexical("§13", "Inflated significance", rx(
        r"\bstands? as a\b", r"\bmark(?:s|ed|ing)? a (?:pivotal|significant|new|major|key|turning)\b",
        r"\bpivotal moment\b", r"\bplays? a (?:crucial|vital|key|pivotal|significant) role\b",
        r"\bsetting the stage\b", r"\bindelible\b", r"\blasting legacy\b", r"\bevolving landscape\b",
        r"\bthe future looks bright\b", r"\bstep in the right direction\b", r"\bcommitment to\b",
        r"\bgame[- ]chang(?:er|ing)\b", r"\bparadigm shift\b",
    ), 1.5, cap=3),
    Lexical("§15", "Shallow -ing tail", rx(
        r",\s+(?:highlighting|underscoring|emphasizing|ensuring|reflecting|symbolizing|contributing to|"
        r"cultivating|fostering|encompassing|showcasing|enhancing|solidifying|paving the way)\b",
    ), 1.0, cap=3),
    Lexical("§16", "Sales language", rx(
        r"\bnestled\b", r"\bin the heart of\b", r"\bbreathtaking\b", r"\bmust-visit\b", r"\bstunning\b",
        r"\brenowned\b", r"\bdiverse array\b", r"\bworld-class\b", r"\bcutting-edge\b",
        r"\beffortless(?:ly)?\b", r"\bunlock(?:s|ing)? (?:the|new|your)\b", r"\bempower(?:s|ing)?\b",
        r"\bsupercharg\w*", r"\bgroundbreaking\b", r"\becosystem\b",
    ), 1.0, cap=3),
    Lexical("§17", "Borrowed authority", rx(
        r"\bexperts (?:argue|believe|say|agree)\b", r"\bobservers have\b", r"\bindustry reports\b",
        r"\bsome critics\b", r"\bstudies show\b",
    ), 1.0),
    Lexical("§18", "Avoiding is and has", rx(r"\b(?:serves|stands|functions|acts) as\b", r"\bboasts\b"), 0.7, cap=3),
    Lexical("§9", "Stacked qualifiers", rx(
        r"\bcould potentially\b", r"\bmight (?:arguably|possibly|potentially)\b",
        r"\bmay (?:possibly|potentially)\b", r"\bto be fair\b",
    ), 0.7, cap=3),
    Lexical("§22", "Chatbot residue", rx(
        r"\bI hope this helps\b", r"\bgreat question\b", r"\byou'?re (?:absolutely|totally|completely) right\b",
        r"^\s*(?:certainly|of course|absolutely|sure)!", r"\bhappy to help\b",
    ), 3.0, hard=True),
    Lexical("§22", "Chatbot offer", rx(
        r"\bwould you like me to\b", START + r"want me to\b",
        r"\blet me know if you(?:'d| would)? (?:like|want|need|have)\b", r"\bfeel free to\b",
        r"\bshould I (?:continue|proceed|go ahead)\?",
    ), 1.0),
    Lexical("§23", "Knowledge-limit disclaimer", rx(
        r"\bas of my (?:last|latest) (?:update|training)\b", r"\bas an AI\b", r"\bknowledge cutoff\b",
        r"\bbased on (?:the )?available information\b",
        r"\bnot (?:widely|publicly|extensively) (?:available|documented|disclosed)\b",
    ), 2.0, hard=True),
    Lexical("§25", "Writing about the document", rx(
        r"\bthe (?:table|list|section|diagram) below (?:shows|compares|lists|outlines)\b",
        r"\bin this (?:section|guide|document|post|article),? (?:we|I)(?:'ll| will)\b",
        r"\bthis (?:section|document|guide) (?:covers|explains|outlines|is organized)\b",
    ), 0.8),
    Lexical("§2", "Summary closer", rx(START + r"(?:in summary|in conclusion|ultimately|to sum up),"), 0.8),
]

# Dashes are scored and also blocked as a hard rule (§8 in SKILL.md).
DASH = re.compile(r"[—–]|\s--\s")

STRIP = [
    re.compile(r"\A---\n.*?\n---\n", re.S),  # front matter
    re.compile(r"(?:```|~~~).*?(?:```|~~~|\Z)", re.S),  # fenced code, even unclosed
    re.compile(r"(?:\A|\n\s*\n)(?:(?: {4}|\t).*(?:\n|\Z))+"),  # indented code
    re.compile(r"<!--.*?-->", re.S),  # HTML comments
    re.compile(r"<[^>\n]+>"),  # HTML tags
    re.compile(r"`[^`\n]*`"),  # inline code
    re.compile(r"https?://\S+"),  # URLs
    re.compile(r"(?<![\w])(?:~|\.{1,2})?/[\w./-]+"),  # paths
    re.compile(r"(?m)^\s*>.*$"),  # blockquotes
    re.compile(r"\"[^\"\n]{1,200}\"|“[^”\n]{1,200}”|‘[^’\n]{1,60}’"),  # quotes
]

# A word named as an example ("adjectives such as robust") is a mention, not
# a use. Only weak features get this exception, so it cannot hide a hard tell.
MENTION = re.compile(r"\b(?:such as|(?:words?|phrases?|terms?) like|e\.g\.|for example)\b[^.\n]{0,80}$", re.I)

WORD = re.compile(r"[A-Za-z0-9][A-Za-z0-9'’\-]*")
TRIAD = re.compile(r"\b[\w-]+(?: [\w-]+){0,2}, [\w-]+(?: [\w-]+){0,2},? (?:and|or) [\w-]+", re.I)
BOLD_LABEL = re.compile(r"(?m)^\s*(?:[-*+]|\d+[.)])\s+\*\*([^*\n]{1,40})\*\*\s*:?")
LIST_OR_BLOCK = ("#", "-", "*", "+", "|")


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
            found.extend(s for s in re.split(r"(?<=[.!?])\s+(?=[A-Z0-9\"'])", line) if s.strip())
    return found


def structural(cleaned: str, sents: list[str], words: int) -> dict[str, float]:
    """Return raw feature values; weights live in STRUCTURAL."""
    labels = [
        label for label in BOLD_LABEL.findall(cleaned)
        if not re.match(r"\s*[-`]", label) and not re.search(r"[_./]|--", label)
    ]
    out = {
        "dashes": float(len(DASH.findall(cleaned))),
        "triads": float(len(TRIAD.findall(cleaned))),
        "bold_labels": float(len(labels)) if len(labels) >= 2 else 0.0,
    }
    if words < RHYTHM_WORDS:
        return out

    lengths = [n for n in (len(WORD.findall(s)) for s in sents) if n]
    cv = statistics.pstdev(lengths) / statistics.mean(lengths) if len(lengths) >= 6 else 1.0
    out["flat_rhythm"] = max(0.0, 0.40 - cv)

    openers = [s.split()[0].lower().strip("\"'") for s in sents if s.split()]
    runs, streak = 0, 1
    for prev, cur in zip(openers, openers[1:]):
        streak = streak + 1 if cur == prev and cur != "the" else 1
        runs += streak == 3
    out["repeated_openers"] = float(runs)

    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", cleaned) if p.strip()]
    closers = sum(
        1 for prev, cur in zip(paragraphs, paragraphs[1:])
        # A line ending in a colon introduces what follows; it is not a closer.
        if not cur.startswith(LIST_OR_BLOCK) and not prev.startswith("#") and not cur.endswith(":")
        and len(sentences(cur)) == 1 and len(WORD.findall(cur)) <= 10 and len(sentences(prev)) >= 2
    )
    out["short_closers"] = float(closers)
    return out


# key: (ref, name, weight, cap, scaled by length)
STRUCTURAL = {
    "dashes": ("§8", "Dashes", 0.9, 4, True),
    "triads": ("§6", "Forced triads", 0.6, 3, True),
    "bold_labels": ("§19", "Bold labels", 0.8, 5, True),
    "flat_rhythm": ("§7", "Flat sentence rhythm", 3.0, 1, False),
    "repeated_openers": ("§7", "Repeated sentence openings", 0.6, 3, False),
    "short_closers": ("§2", "Short closer paragraphs", 0.9, 3, False),
}


def lint(text: str) -> dict:
    cleaned = clean(text)
    lines = text.splitlines()
    sents = sentences(cleaned)
    words = len(WORD.findall(cleaned))
    scale = 1.0 / max(1.0, words / SCALE_WORDS)

    z = BIAS
    hard: set[str] = set()
    findings: list[dict] = []

    def add(ref: str, name: str, is_hard: bool, match: str, start: int | None) -> None:
        line_no = cleaned.count("\n", 0, start) + 1 if start is not None else 0
        excerpt = lines[line_no - 1].strip() if 0 < line_no <= len(lines) else ""
        findings.append({
            "ref": ref, "name": name, "hard": is_hard, "match": match, "line": line_no,
            "excerpt": excerpt if len(excerpt) <= 120 else excerpt[:117] + "...",
        })

    for feature in LEXICAL:
        matches = [
            m for m in feature.pattern.finditer(cleaned)
            if feature.hard or not MENTION.search(cleaned, cleaned.rfind("\n", 0, m.start()) + 1, m.start())
        ]
        if not matches:
            continue
        z += feature.weight * min(len(matches), feature.cap) * (1.0 if feature.hard else scale)
        if feature.hard:
            hard.add(feature.ref)
        for match in matches:
            add(feature.ref, feature.name, feature.hard, match.group(0).strip(" .!?\n\t"), match.start())

    for match in DASH.finditer(cleaned):
        hard.add("§8")
        add("§8", "Dash as connector", True, match.group(0).strip(), match.start())

    features = structural(cleaned, sents, words)
    for key, value in features.items():
        ref, name, weight, cap, scaled = STRUCTURAL[key]
        contribution = weight * min(value, cap) * (scale if scaled else 1.0)
        z += contribution
        if contribution >= 0.5 and key != "dashes":
            add(ref, name, False, f"{key}={value:.2f}", None)

    probability = 1.0 / (1.0 + math.exp(-z))
    flagged = bool(hard) or (words >= MIN_WORDS and probability >= THRESHOLD)
    return {
        "words": words,
        "sentences": len(sents),
        "score": round(probability, 3),
        "flagged": flagged,
        "hard_tells": sorted(hard, key=lambda r: int(r[1:])),
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
