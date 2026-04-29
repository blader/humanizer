# Rule Index

Flat lookup table of every rule in this skill. Use this when a rule ID is mentioned in code-review notes, corpus expectations, or contributor PRs.

**Naming:** `<book-prefix>-<number>`. Wikipedia rules use `W`. Each new book gets a unique single-letter prefix.

| ID | Rule (one line) | Source file |
|----|-----------------|-------------|
| W-1 | Undue emphasis on significance, legacy, broader trends | `wikipedia-signs-of-ai-writing.md` |
| W-2 | Undue emphasis on notability and media coverage | `wikipedia-signs-of-ai-writing.md` |
| W-3 | Superficial analyses with -ing endings | `wikipedia-signs-of-ai-writing.md` |
| W-4 | Promotional and advertisement-like language | `wikipedia-signs-of-ai-writing.md` |
| W-5 | Vague attributions and weasel words | `wikipedia-signs-of-ai-writing.md` |
| W-6 | Outline-like "challenges and future prospects" sections | `wikipedia-signs-of-ai-writing.md` |
| W-7 | Overused "AI vocabulary" words | `wikipedia-signs-of-ai-writing.md` |
| W-8 | Avoidance of is/are (copula avoidance) | `wikipedia-signs-of-ai-writing.md` |
| W-9 | Negative parallelisms and tailing negations | `wikipedia-signs-of-ai-writing.md` |
| W-10 | Rule of three overuse | `wikipedia-signs-of-ai-writing.md` |
| W-11 | Elegant variation (synonym cycling) | `wikipedia-signs-of-ai-writing.md` |
| W-12 | False ranges | `wikipedia-signs-of-ai-writing.md` |
| W-13 | Passive voice and subjectless fragments | `wikipedia-signs-of-ai-writing.md` |
| W-14 | Em dash overuse | `wikipedia-signs-of-ai-writing.md` |
| W-15 | Overuse of boldface | `wikipedia-signs-of-ai-writing.md` |
| W-16 | Inline-header vertical lists | `wikipedia-signs-of-ai-writing.md` |
| W-17 | Title case in headings | `wikipedia-signs-of-ai-writing.md` |
| W-18 | Emojis | `wikipedia-signs-of-ai-writing.md` |
| W-19 | Curly quotation marks | `wikipedia-signs-of-ai-writing.md` |
| W-20 | Collaborative communication artifacts | `wikipedia-signs-of-ai-writing.md` |
| W-21 | Knowledge-cutoff disclaimers | `wikipedia-signs-of-ai-writing.md` |
| W-22 | Sycophantic / servile tone | `wikipedia-signs-of-ai-writing.md` |
| W-23 | Filler phrases | `wikipedia-signs-of-ai-writing.md` |
| W-24 | Excessive hedging | `wikipedia-signs-of-ai-writing.md` |
| W-25 | Generic positive conclusions | `wikipedia-signs-of-ai-writing.md` |
| W-26 | Hyphenated word pair overuse | `wikipedia-signs-of-ai-writing.md` |
| W-27 | Persuasive authority tropes | `wikipedia-signs-of-ai-writing.md` |
| W-28 | Signposting and announcements | `wikipedia-signs-of-ai-writing.md` |
| W-29 | Fragmented headers | `wikipedia-signs-of-ai-writing.md` |
| Z-1 | Cut clutter — every word that does no work | `zinsser-on-writing-well.md` |
| Z-2 | Use short, plain, Anglo-Saxon words | `zinsser-on-writing-well.md` |
| Z-3 | Active verbs do the work; kill nominalizations | `zinsser-on-writing-well.md` |
| Z-4 | Strip qualifiers — "a bit", "rather", "sort of" | `zinsser-on-writing-well.md` |
| Z-5 | Be present on the page; have a self | `zinsser-on-writing-well.md` |
| Z-6 | Endings matter — quit when the work is done | `zinsser-on-writing-well.md` |
| Z-7 | A lead must capture the reader immediately | `zinsser-on-writing-well.md` |
| Z-8 | Maintain unity of pronoun, tense, and mood | `zinsser-on-writing-well.md` |
| Z-9 | Most adjectives and adverbs are unnecessary | `zinsser-on-writing-well.md` |
| S-1 | Omit needless words | `strunk-and-white-elements-of-style.md` |
| S-2 | Use the active voice | `strunk-and-white-elements-of-style.md` |
| S-3 | Put statements in positive form | `strunk-and-white-elements-of-style.md` |
| S-4 | Use definite, specific, concrete language | `strunk-and-white-elements-of-style.md` |
| S-5 | Do not overstate | `strunk-and-white-elements-of-style.md` |
| S-6 | Express coordinate ideas in similar form | `strunk-and-white-elements-of-style.md` |
| S-7 | Place the emphatic words of a sentence at the end | `strunk-and-white-elements-of-style.md` |
| S-8 | Avoid a succession of loose sentences | `strunk-and-white-elements-of-style.md` |
| S-9 | Do not affect a breezy manner | `strunk-and-white-elements-of-style.md` |
| H-1 | Lead with the bottom line (pyramid principle) | `hbr-guide-better-business-writing.md` |
| H-2 | Write for the skim-reader | `hbr-guide-better-business-writing.md` |
| H-3 | One idea per paragraph | `hbr-guide-better-business-writing.md` |
| H-4 | Imperative for instructions | `hbr-guide-better-business-writing.md` |
| H-5 | Cut throat-clearing openers | `hbr-guide-better-business-writing.md` |

**Total:** 52 rules across 4 sources (29 Wikipedia + 9 Zinsser + 9 Strunk & White + 5 HBR).

## Cross-reference graph

When a Wikipedia detection rule fires, the matching book rule(s) usually offer the better fix:

| Wikipedia (detect) | Book (fix) |
|--------------------|------------|
| W-7 (AI vocabulary), W-23 (filler), W-27 (persuasive tropes) | Z-1, S-1 (cut clutter) |
| W-13 (passive) | S-2, Z-3 (active voice + active verbs) |
| W-4 (promotional), W-1 (significance inflation) | S-5, Z-2 (don't overstate; plain words) |
| W-24 (hedging) | Z-4, S-3 (strip qualifiers; positive form) |
| W-25 (generic conclusion) | Z-6 (quit when done) |
| W-22 (sycophantic), W-20 (chatbot artifacts) | Z-5, H-5 (be present; cut throat-clearing) |
| W-16 (inline-header lists), W-18 (emojis) | H-2 (skim-reader formatting done right) |
| W-3 (-ing analyses), W-12 (false ranges) | S-4 (concrete and specific) |
| W-10 (rule of three), W-11 (synonym cycling) | S-6 (parallel construction), S-8 (avoid loose-sentence monotony) |
| W-25 (generic conclusions), H-1 (lead with bottom line) | S-7 (emphatic words at the end) |
| Z-5 (be present on the page) — when over-applied | S-9 (do not affect a breezy manner — calibrating partner) |
| W-28 (signposting), W-29 (fragmented headers) | Z-7 (lead must capture immediately) |
| W-11 (synonym cycling), W-22 (tone shifts) | Z-8 (unity of pronoun/tense/mood) |
| W-4 (promotional language), W-7 (AI vocabulary) | Z-9 (most adjectives/adverbs are unnecessary) |

## Adding a new rule

1. Pick a single-letter prefix not already used (current: W, Z, S, H).
2. Add the rule to the appropriate `references/<book>.md` file (or create a new one from `_template-book-rules.md`).
3. Append a row to the table above.
4. Add a line to the cross-reference graph if it's a fix-match for an existing detection rule.
5. Bump version per `CONTRIBUTING.md`.
