# Humanizer Classics

A Claude Code / OpenCode skill that refines AI-generated text using rules drawn from the foundational books that taught humans to write well.

> **For people who hate how AI writes.** We learned from books — Zinsser's *On Writing Well*, Strunk & White's *Elements of Style*, the *HBR Guide to Better Business Writing*. This skill turns those books' principles into rules a model can apply, so the writing that comes back from your AI tools sounds more like the writing that taught you in the first place.

## What this is

`humanizer-classics` is the v3 fork of [`humanizer`](../). Where v2 catalogs **what AI writing looks like** (29 patterns from Wikipedia's "Signs of AI writing"), v3 adds **what good human writing does** — craft prescriptions sourced from books, with citations.

- **53 rules** at launch: 29 detection rules (Wikipedia) + 24 craft rules (Zinsser × 10, Strunk & White × 9, HBR Guide × 5)
- **Two-pass process**: draft → audit ("what makes this still obviously AI?") → final
- **Voice calibration**: paste 2-3 paragraphs of your own writing and the skill matches your rhythm and word choice instead of generic "clean" prose
- **Granola integration**: pull meeting transcripts directly via MCP and humanize them
- **Wispr Flow ready**: dictation comes through as pasted text; the skill cleans it up while preserving your voice
- **Pure Markdown**: no code, no dependencies, portable across Claude Code and OpenCode

## Why a fork instead of an update

The v2 skill works and is in active use at version 2.5.1. v3 changes the architecture (single SKILL.md → SKILL.md + `references/`) and adds book-grounded rules with citations. To keep v2 users stable, v3 ships as a separate skill (`humanizer-classics`) until it has proven out, after which it can be split to its own repo via `git subtree split`.

## Installation

### Claude Code

```bash
git clone https://github.com/<your-account>/humanizer-classics ~/.claude/skills/humanizer-classics
```

Then invoke with `/humanizer-classics` in any Claude Code session.

### OpenCode

```bash
git clone https://github.com/<your-account>/humanizer-classics ~/.config/opencode/skills/humanizer-classics
```

## Usage

### Pasted slop

```
/humanizer-classics

[paste your AI-sounding text]
```

The skill identifies the AI patterns, applies the relevant book rules, runs the two-pass audit, and returns the cleaned text.

### Voice calibration

Paste a sample of your own writing to anchor the rewrite to your voice:

```
/humanizer-classics

Humanize this. Match my voice — here's a sample:

[2-3 paragraphs of your own writing]

[the AI text to humanize]
```

### Granola meeting transcripts

```
/humanizer-classics

Pull the transcript from my standup this morning and turn it into a memo.
```

The skill calls the Granola MCP tools (`mcp__granola__list_meetings`, `mcp__granola__get_meeting_transcript`), strips speaker labels and timestamps, and humanizes the result with the memo context tag (lead with bottom line, one idea per paragraph, cut throat-clearing).

### Wispr Flow dictation

Dictate into the prompt with Wispr Flow. The skill recognizes dictation patterns (run-ons, filler words, restarts) and cleans them up while preserving your spoken voice — it edits, it doesn't rewrite into a different register.

### Specific rules

You can also ask for a specific rule:

```
/humanizer-classics

Apply Z-1 (cut clutter) to this paragraph: [text]
```

## Philosophy

The two camps of writing rules are complementary halves:

| Detection (W-rules) | Craft (Z, S, H rules) |
|---------------------|------------------------|
| What AI writing **looks like** | What good writing **does** |
| Source: Wikipedia | Source: foundational books |
| Spotting failure | Producing replacement |

When a detection rule fires, the matching craft rule(s) usually offer the better fix — see `references/_rule-index.md` for the cross-reference graph.

## Books currently included

- **Zinsser**, *On Writing Well* (25th Anniversary Edition, 6th ed., 2001) — 10 rules
- **Strunk & White**, *The Elements of Style* (4th ed., 1999) — 9 rules
- **Garner / HBR**, *HBR Guide to Better Business Writing* (1st ed., 2012) — 5 rules

## Roadmap (community contributions welcome)

- *Style: Lessons in Clarity and Grace* — Joseph M. Williams
- *The Sense of Style* — Steven Pinker
- *Draft No. 4* — John McPhee
- *Bird by Bird* — Anne Lamott
- *Several Short Sentences About Writing* — Verlyn Klinkenborg

To propose a new book, see `CONTRIBUTING.md`.

## Contributing

This is meant to be an ongoing repository. To propose a new rule, refine an existing one, or add a new book, see `CONTRIBUTING.md`. The acceptance bar:

1. Traceable to a specific page or chapter
2. Maps to a real AI-failure mode
3. Adds something the existing rule set doesn't already cover
4. Comes with a non-trivial before/after example

## Acknowledgments

Stands on the shoulders of:

- **William Zinsser**, whose *On Writing Well* is the central text on writing nonfiction in clear English
- **William Strunk Jr. and E. B. White**, whose *Elements of Style* is the shortest sharpest writing guide in the language
- **Bryan A. Garner**, whose *HBR Guide* applies the same principles to business writing
- **WikiProject AI Cleanup**, whose [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) catalog forms the detection layer
- **The original [`humanizer`](../) skill** by Siqi Chen, on which v3 is based

Pull-quotes from the cited books are short excerpts (10-25 words) under fair use for educational commentary.

## License

MIT — see `LICENSE`. Wikipedia content (the W-rules) is incorporated under CC BY-SA 4.0 with attribution.

## Version

3.0.0 — initial v3 release. Changelog: `CHANGELOG.md`.
