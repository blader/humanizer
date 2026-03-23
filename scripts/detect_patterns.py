#!/usr/bin/env python3
"""
AI Writing Pattern Detector

Scans text for measurable signs of AI-generated writing based on the
humanizer skill's 25-pattern taxonomy. Reads from stdin or a file argument.

Outputs a structured report with per-pattern hit counts, matched snippets,
and an overall AI-ism score.

Usage:
    echo "some text" | python3 detect_patterns.py
    python3 detect_patterns.py input.txt
    python3 detect_patterns.py --json input.txt
"""

import re
import sys
import json
import unicodedata
from collections import defaultdict
from dataclasses import dataclass, field

# ---------------------------------------------------------------------------
# Pattern definitions
# ---------------------------------------------------------------------------

AI_VOCABULARY = [
    "additionally", "align with", "crucial", "delve", "emphasizing",
    "enduring", "enhance", "fostering", "garner", "interplay",
    "intricate", "intricacies", "landscape", "pivotal", "showcase",
    "showcasing", "showcased", "tapestry", "testament", "underscore",
    "underscoring", "underscored", "valuable", "vibrant",
    "furthermore", "moreover", "notable", "noteworthy", "multifaceted",
    "comprehensive", "realm", "spearhead", "spearheading",
    "navigate", "navigating", "leverage", "leveraging",
    "streamline", "streamlining", "facilitate", "facilitating",
    "paradigm", "synergy", "holistic", "robust", "transformative",
    "groundbreaking", "cutting-edge", "game-changer",
]

# Only match "highlight" and "key" as verbs/adjectives contextually
AI_VOCABULARY_CONTEXTUAL = {
    r"\bhighlights?\b": "highlight (verb)",
    r"\bkey\s+(?:aspect|factor|element|component|feature|role|driver|takeaway|insight|principle)s?\b": "key (adjective)",
}

COPULA_AVOIDANCE = [
    "serves as", "stands as", "marks a", "represents a",
    "boasts", "features a", "offers a",
    "functions as", "acts as", "operates as",
]

NEGATIVE_PARALLELISMS = [
    r"(?:it'?s|this is)\s+not\s+(?:just|only|merely)\s+(?:about\s+)?.*?[;,]\s*(?:it'?s|this is)",
    r"not\s+only\s+.*?\bbut\s+(?:also\b)?",
]

FILLER_PHRASES = [
    "in order to", "at this point in time", "it is important to note",
    "it is worth noting", "it should be noted", "at the end of the day",
    "in today's world", "in today's rapidly", "in the realm of",
    "when it comes to", "at its core", "in terms of",
    "it goes without saying", "needless to say",
    "as a matter of fact", "for all intents and purposes",
    "by and large", "in a nutshell",
]

HEDGING_PHRASES = [
    "could potentially", "might possibly", "may potentially",
    "it could be argued", "one could argue",
    "it is possible that", "there is a possibility",
    "to some extent", "in some ways", "arguably",
    "it remains to be seen",
]

GENERIC_CONCLUSIONS = [
    "the future looks bright", "exciting times",
    "continue this journey", "step in the right direction",
    "paving the way", "poised for", "remains to be seen",
    "only time will tell", "sky is the limit",
    "tip of the iceberg",
]

COLLABORATIVE_ARTIFACTS = [
    "i hope this helps", "let me know if",
    "feel free to", "don't hesitate to",
    "i'd be happy to", "happy to help",
    "great question", "excellent question",
    "that's a great", "absolutely!",
    "here's a", "here is a",
]

PROMOTIONAL_LANGUAGE = [
    "nestled", "breathtaking", "groundbreaking", "cutting-edge",
    "world-class", "state-of-the-art", "unparalleled",
    "second to none", "best-in-class", "top-notch",
    "game-changing", "revolutionary", "trailblazing",
    "seamless", "intuitive", "sleek",
]

VAGUE_ATTRIBUTIONS = [
    r"experts?\s+(?:believe|say|note|suggest|argue|agree|point out)",
    r"(?:many|some|most|several)\s+(?:experts?|observers?|analysts?|researchers?|scholars?|critics?)\s+(?:have\s+)?(?:noted|observed|suggested|argued|pointed out|believe|say|agree)",
    r"(?:observers?|commentators?|analysts?)\s+(?:have\s+)?(?:noted|observed|pointed out)",
    r"(?:it is|it's)\s+widely\s+(?:believed|known|accepted|recognized|acknowledged)",
    r"(?:industry|market)\s+(?:experts?|observers?|analysts?)",
]

HYPHENATED_WATCHLIST = [
    "third-party", "cross-functional", "client-facing", "data-driven",
    "decision-making", "well-known", "high-quality", "real-time",
    "long-term", "end-to-end", "detail-oriented", "forward-thinking",
    "thought-provoking", "like-minded", "above-mentioned",
    "well-established", "wide-ranging", "far-reaching",
]

SIGNIFICANCE_INFLATION = [
    "pivotal moment", "marking a", "marks a",
    "ushering in", "dawn of", "new era",
    "reshaping", "redefining", "reimagining",
    "at the forefront", "at the intersection",
    "evolving landscape", "rapidly evolving",
    "vital role", "instrumental in",
]

FORMULAIC_CHALLENGES = [
    r"despite\s+(?:these\s+)?challenges",
    r"continues?\s+to\s+thrive",
    r"challenges\s+and\s+(?:future\s+)?(?:prospects?|opportunities)",
    r"notwithstanding\s+(?:these\s+)?(?:challenges|obstacles|difficulties)",
    r"while\s+challenges\s+remain",
]

FALSE_RANGES = [
    r"from\s+\w[\w\s]*?\s+to\s+\w[\w\s]*?,\s*from\s+\w[\w\s]*?\s+to\s+",
]


# ---------------------------------------------------------------------------
# Detection engine
# ---------------------------------------------------------------------------

@dataclass
class Hit:
    pattern_id: int
    pattern_name: str
    category: str
    matched_text: str
    line_number: int


@dataclass
class PatternReport:
    pattern_id: int
    pattern_name: str
    category: str
    count: int = 0
    hits: list = field(default_factory=list)


def _find_phrase_hits(text: str, lines: list[str], phrases: list[str],
                      pattern_id: int, pattern_name: str, category: str) -> list[Hit]:
    """Find case-insensitive phrase matches across lines."""
    hits = []
    for i, line in enumerate(lines, 1):
        lower = line.lower()
        for phrase in phrases:
            idx = lower.find(phrase.lower())
            while idx != -1:
                # Extract context around the match
                start = max(0, idx - 20)
                end = min(len(line), idx + len(phrase) + 20)
                context = line[start:end].strip()
                if start > 0:
                    context = "..." + context
                if end < len(line):
                    context = context + "..."
                hits.append(Hit(pattern_id, pattern_name, category, context, i))
                idx = lower.find(phrase.lower(), idx + 1)
    return hits


def _find_regex_hits(text: str, lines: list[str], patterns: list[str],
                     pattern_id: int, pattern_name: str, category: str) -> list[Hit]:
    """Find regex matches across lines."""
    hits = []
    for i, line in enumerate(lines, 1):
        for pat in patterns:
            for m in re.finditer(pat, line, re.IGNORECASE):
                matched = m.group(0)
                start = max(0, m.start() - 20)
                end = min(len(line), m.end() + 20)
                context = line[start:end].strip()
                if start > 0:
                    context = "..." + context
                if end < len(line):
                    context = context + "..."
                hits.append(Hit(pattern_id, pattern_name, category, context, i))
    return hits


def _count_em_dashes(lines: list[str]) -> list[Hit]:
    """Count em dash usage (pattern 13)."""
    hits = []
    for i, line in enumerate(lines, 1):
        for m in re.finditer(r"—", line):
            start = max(0, m.start() - 25)
            end = min(len(line), m.end() + 25)
            context = line[start:end].strip()
            hits.append(Hit(13, "Em dash overuse", "Style", context, i))
    return hits


def _count_boldface(lines: list[str]) -> list[Hit]:
    """Count markdown bold usage (pattern 14)."""
    hits = []
    for i, line in enumerate(lines, 1):
        for m in re.finditer(r"\*\*[^*]+\*\*", line):
            hits.append(Hit(14, "Boldface overuse", "Style", m.group(0), i))
    return hits


def _count_emojis(lines: list[str]) -> list[Hit]:
    """Detect emoji usage (pattern 17)."""
    hits = []
    for i, line in enumerate(lines, 1):
        for ch in line:
            if unicodedata.category(ch).startswith(("So",)):
                # Check if it's actually an emoji (not a regular symbol)
                if ord(ch) > 0x2600:
                    hits.append(Hit(17, "Emoji usage", "Style", ch, i))
    return hits


def _check_rule_of_three(lines: list[str]) -> list[Hit]:
    """Detect rule-of-three patterns (pattern 10)."""
    hits = []
    # Match "X, Y, and Z" patterns
    pat = r"\b\w+(?:\s+\w+)?,\s+\w+(?:\s+\w+)?,\s+and\s+\w+(?:\s+\w+)?\b"
    for i, line in enumerate(lines, 1):
        matches = re.findall(pat, line, re.IGNORECASE)
        # Only flag if there are multiple rule-of-three in the same line
        # or if the triplet uses suspiciously parallel structure
        if len(matches) >= 2:
            for m_text in matches:
                hits.append(Hit(10, "Rule of three overuse", "Language", m_text, i))
        elif len(matches) == 1:
            # Check for parallel gerunds or parallel nouns
            m_text = matches[0]
            words = re.findall(r"\b\w+ing\b", m_text)
            if len(words) >= 2:
                hits.append(Hit(10, "Rule of three overuse", "Language", m_text, i))
    return hits


def _check_title_case_headings(lines: list[str]) -> list[Hit]:
    """Detect Title Case in markdown headings (pattern 16)."""
    hits = []
    minor_words = {"a", "an", "the", "and", "but", "or", "for", "nor",
                   "in", "on", "at", "to", "of", "by", "is", "it", "as"}
    for i, line in enumerate(lines, 1):
        m = re.match(r"^(#{1,6})\s+(.+)$", line.strip())
        if m:
            heading_text = m.group(2).strip()
            words = heading_text.split()
            if len(words) < 3:
                continue
            # Check if most non-minor words are capitalised
            caps = sum(1 for w in words if w[0].isupper() and w.lower() not in minor_words)
            eligible = sum(1 for w in words if w.lower() not in minor_words)
            if eligible > 2 and caps == eligible:
                hits.append(Hit(16, "Title Case headings", "Style", heading_text, i))
    return hits


def _check_synonym_cycling(lines: list[str]) -> list[Hit]:
    """Basic check for synonym cycling (pattern 11) — repeated subject substitution."""
    hits = []
    synonym_groups = [
        ["protagonist", "main character", "central figure", "hero", "heroine"],
        ["company", "firm", "organisation", "organization", "enterprise", "corporation"],
        ["city", "metropolis", "urban centre", "urban center", "municipality"],
        ["country", "nation", "state", "republic"],
    ]
    full_text = " ".join(lines).lower()
    for group in synonym_groups:
        found = [w for w in group if w in full_text]
        if len(found) >= 3:
            hits.append(Hit(11, "Synonym cycling", "Language",
                            f"Multiple synonyms used: {', '.join(found)}", 0))
    return hits


# ---------------------------------------------------------------------------
# Main scanner
# ---------------------------------------------------------------------------

# Weights per pattern — higher = stronger AI signal
PATTERN_WEIGHTS = {
    1: 3,   # Significance inflation
    4: 2,   # Promotional language
    5: 3,   # Vague attributions
    6: 3,   # Formulaic challenges
    7: 3,   # AI vocabulary
    8: 2,   # Copula avoidance
    9: 2,   # Negative parallelisms
    10: 1,  # Rule of three
    11: 2,  # Synonym cycling
    12: 2,  # False ranges
    13: 1,  # Em dashes (common in human writing too)
    14: 1,  # Boldface
    16: 1,  # Title case headings
    17: 2,  # Emojis in prose
    19: 4,  # Collaborative artifacts (dead giveaway)
    22: 2,  # Filler phrases
    23: 3,  # Hedging
    24: 3,  # Generic conclusions
    25: 1,  # Hyphenated pairs
}


def scan(text: str) -> dict:
    """Scan text and return a full report dict."""
    lines = text.splitlines()
    all_hits: list[Hit] = []

    # --- Content patterns ---
    all_hits += _find_phrase_hits(text, lines, SIGNIFICANCE_INFLATION,
                                 1, "Significance inflation", "Content")
    all_hits += _find_phrase_hits(text, lines, PROMOTIONAL_LANGUAGE,
                                 4, "Promotional language", "Content")
    all_hits += _find_regex_hits(text, lines, VAGUE_ATTRIBUTIONS,
                                5, "Vague attributions", "Content")
    all_hits += _find_regex_hits(text, lines, FORMULAIC_CHALLENGES,
                                6, "Formulaic challenges", "Content")

    # --- Language patterns ---
    all_hits += _find_phrase_hits(text, lines, AI_VOCABULARY,
                                 7, "AI vocabulary", "Language")
    # Contextual AI vocab
    for pat, label in AI_VOCABULARY_CONTEXTUAL.items():
        for i, line in enumerate(lines, 1):
            for m in re.finditer(pat, line, re.IGNORECASE):
                all_hits.append(Hit(7, "AI vocabulary", "Language", f"{label}: {m.group(0)}", i))
    all_hits += _find_phrase_hits(text, lines, COPULA_AVOIDANCE,
                                 8, "Copula avoidance", "Language")
    all_hits += _find_regex_hits(text, lines, NEGATIVE_PARALLELISMS,
                                9, "Negative parallelisms", "Language")
    all_hits += _check_rule_of_three(lines)
    all_hits += _check_synonym_cycling(lines)
    all_hits += _find_regex_hits(text, lines, FALSE_RANGES,
                                12, "False ranges", "Language")

    # --- Style patterns ---
    all_hits += _count_em_dashes(lines)
    all_hits += _count_boldface(lines)
    all_hits += _check_title_case_headings(lines)
    all_hits += _count_emojis(lines)

    # --- Communication patterns ---
    all_hits += _find_phrase_hits(text, lines, COLLABORATIVE_ARTIFACTS,
                                 19, "Collaborative artifacts", "Communication")

    # --- Filler / hedging ---
    all_hits += _find_phrase_hits(text, lines, FILLER_PHRASES,
                                 22, "Filler phrases", "Filler")
    all_hits += _find_phrase_hits(text, lines, HEDGING_PHRASES,
                                 23, "Excessive hedging", "Filler")
    all_hits += _find_phrase_hits(text, lines, GENERIC_CONCLUSIONS,
                                 24, "Generic positive conclusions", "Filler")

    # --- Hyphenation ---
    all_hits += _find_phrase_hits(text, lines, HYPHENATED_WATCHLIST,
                                 25, "Hyphenated pair overuse", "Hyphenation")

    # Build per-pattern report
    by_pattern: dict[int, PatternReport] = {}
    for h in all_hits:
        if h.pattern_id not in by_pattern:
            by_pattern[h.pattern_id] = PatternReport(
                h.pattern_id, h.pattern_name, h.category
            )
        rpt = by_pattern[h.pattern_id]
        rpt.count += 1
        rpt.hits.append({"text": h.matched_text, "line": h.line_number})

    # Calculate score
    total_score = sum(
        rpt.count * PATTERN_WEIGHTS.get(rpt.pattern_id, 1)
        for rpt in by_pattern.values()
    )

    # Word count for normalisation
    word_count = len(text.split())
    normalised_score = round(total_score / max(word_count / 100, 1), 1)

    return {
        "word_count": word_count,
        "total_hits": len(all_hits),
        "raw_score": total_score,
        "normalised_score": normalised_score,
        "patterns": sorted(
            [
                {
                    "id": rpt.pattern_id,
                    "name": rpt.pattern_name,
                    "category": rpt.category,
                    "count": rpt.count,
                    "weight": PATTERN_WEIGHTS.get(rpt.pattern_id, 1),
                    "weighted_score": rpt.count * PATTERN_WEIGHTS.get(rpt.pattern_id, 1),
                    "hits": rpt.hits[:10],  # Cap at 10 examples per pattern
                }
                for rpt in by_pattern.values()
            ],
            key=lambda p: p["weighted_score"],
            reverse=True,
        ),
    }


# ---------------------------------------------------------------------------
# Output formatting
# ---------------------------------------------------------------------------

def format_report(report: dict) -> str:
    """Format the report as a human-readable string."""
    out = []
    out.append("=" * 60)
    out.append("  AI WRITING PATTERN SCAN")
    out.append("=" * 60)
    out.append(f"  Words scanned:     {report['word_count']}")
    out.append(f"  Total hits:        {report['total_hits']}")
    out.append(f"  Raw score:         {report['raw_score']}")
    out.append(f"  Score per 100w:    {report['normalised_score']}")
    out.append("")

    if report["normalised_score"] == 0:
        out.append("  No AI patterns detected.")
    elif report["normalised_score"] < 5:
        out.append("  Assessment: LOW — minor traces, mostly human-sounding")
    elif report["normalised_score"] < 15:
        out.append("  Assessment: MODERATE — noticeable AI patterns")
    elif report["normalised_score"] < 30:
        out.append("  Assessment: HIGH — clearly AI-influenced")
    else:
        out.append("  Assessment: VERY HIGH — strongly AI-generated")

    out.append("=" * 60)

    if not report["patterns"]:
        out.append("\n  Clean! No patterns matched.")
        return "\n".join(out)

    for pat in report["patterns"]:
        out.append("")
        out.append(f"  #{pat['id']} {pat['name']} ({pat['category']})")
        out.append(f"  Hits: {pat['count']}  |  Weight: {pat['weight']}x  |  Score: {pat['weighted_score']}")
        out.append("  " + "-" * 56)
        for hit in pat["hits"][:5]:
            line_ref = f"L{hit['line']}" if hit["line"] > 0 else "—"
            out.append(f"    [{line_ref}] {hit['text']}")

    out.append("")
    return "\n".join(out)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    output_json = "--json" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--json"]

    if args:
        try:
            with open(args[0], "r", encoding="utf-8") as f:
                text = f.read()
        except FileNotFoundError:
            print(f"Error: file not found: {args[0]}", file=sys.stderr)
            sys.exit(1)
    else:
        if sys.stdin.isatty():
            print("Usage: echo 'text' | python3 detect_patterns.py", file=sys.stderr)
            print("       python3 detect_patterns.py [--json] <file>", file=sys.stderr)
            sys.exit(1)
        text = sys.stdin.read()

    if not text.strip():
        print("Error: empty input", file=sys.stderr)
        sys.exit(1)

    report = scan(text)

    if output_json:
        print(json.dumps(report, indent=2))
    else:
        print(format_report(report))


if __name__ == "__main__":
    main()
