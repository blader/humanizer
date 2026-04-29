# Changelog

All notable changes to humanizer-classics. Format roughly follows [Keep a Changelog](https://keepachangelog.com/).

## [3.0.0] — 2026-04-29

### Added

- Initial v3 release as a fork of `humanizer` v2.5.1.
- New architecture: slim `SKILL.md` dispatcher (~250 lines) + per-source `references/` files lazy-loaded as rules fire.
- 24 new craft rules sourced from foundational writing books, each with a citation and pull-quote verified against the source PDFs:
  - **Zinsser, *On Writing Well*** (25th Anniversary Edition, 6th ed., HarperResource, 2001) — Z-1 through Z-10:
    - Z-1: Cut clutter — every word that does no work (Ch. 3)
    - Z-2: Use short, plain, Anglo-Saxon words (Ch. 3, Ch. 6)
    - Z-3: Active verbs do the work; kill nominalizations (Ch. 10)
    - Z-4: Strip qualifiers (Ch. 10 — Little Qualifiers)
    - Z-5: Be present on the page; have a self (Ch. 4)
    - Z-6: Endings matter — quit when the work is done (Ch. 9)
    - Z-7: A lead must capture the reader immediately (Ch. 9)
    - Z-8: Maintain unity of pronoun, tense, and mood (Ch. 8)
    - Z-9: Most adjectives and adverbs are unnecessary (Ch. 10)
    - Z-10: Write for yourself, not for an imagined mass audience (Ch. 5)
  - **Strunk & White, *The Elements of Style*** (4th ed., 1999) — S-1 through S-9:
    - S-1: Omit needless words (II.17)
    - S-2: Use the active voice (II.14)
    - S-3: Put statements in positive form (II.15)
    - S-4: Use definite, specific, concrete language (II.16)
    - S-5: Do not overstate (V.7)
    - S-6: Express coordinate ideas in similar form — parallel construction (II.19)
    - S-7: Place the emphatic words of a sentence at the end (II.22)
    - S-8: Avoid a succession of loose sentences — mechanical singsong (II.18)
    - S-9: Do not affect a breezy manner — calibrating partner to Z-5 (V.9)
  - **Garner / HBR, *HBR Guide to Better Business Writing*** (1st ed., 2012) — H-1 through H-5:
    - H-1: Lead with the bottom line (pyramid principle)
    - H-2: Write for the skim-reader
    - H-3: One idea per paragraph
    - H-4: Imperative for instructions
    - H-5: Cut throat-clearing openers
- `context_tags:` field on every rule for conflict resolution across forms (memo, email, blog, book-draft, technical-doc, dictation, meeting-notes).
- Cross-reference graph in `references/_rule-index.md` mapping detection rules (W) to fix rules (Z/S/H).
- Granola live integration via `mcp__granola__list_meetings`, `mcp__granola__get_meeting_transcript`, etc. Workflow documented in `references/granola-meeting-transcripts.md`.
- Wispr Flow dictation guidance (no MCP integration; comes through as pasted text).
- `tests/corpus/` with golden samples + `tests/REVIEWING.md` for manual reviewer checklist.
- `CONTRIBUTING.md` with one-rule-per-PR norm, rule acceptance bar, pull-quote licensing.
- GitHub issue templates: `new-rule.md`, `new-book.md`.

### Changed

- 29 Wikipedia "Signs of AI writing" rules renamed from numeric IDs (1-29) to prefixed IDs (W-1 through W-29) and lifted verbatim into `references/wikipedia-signs-of-ai-writing.md`. Content unchanged.
- Two-pass humanization process now context-aware: the chosen context tag governs which book rules fire. (E.g., Z-5 "be present on the page" doesn't fire on memo or technical-doc contexts; H-1 "lead with bottom line" doesn't fire on book-draft contexts.)
- Voice calibration section retained from v2.x verbatim.
- Personality and soul section retained from v2.x verbatim.

### Migrated from v2.x

- All 29 rules (Wikipedia "Signs of AI writing")
- Voice calibration feature
- Two-pass audit process
- Personality and soul guidance
- Full example with before/draft/audit/after

### Note on coexistence with v2.x

`humanizer-classics` is a fork, not a replacement. `humanizer` v2.5.1 remains stable for current users at `~/.claude/skills/humanizer/`. v3 installs alongside as `~/.claude/skills/humanizer-classics/`. Future work may merge them once v3 has proven out.
