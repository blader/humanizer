---
name: New rule proposal
about: Propose a new rule for an existing book file (or for the Wikipedia detection layer)
title: "[New rule] "
labels: rule-proposal
---

## Source

Which book is this rule from?

- [ ] Zinsser, *On Writing Well*
- [ ] Strunk & White, *The Elements of Style*
- [ ] Garner, *HBR Guide to Better Business Writing*
- [ ] Wikipedia, *Signs of AI writing* (detection layer)
- [ ] Other (please specify and consider opening a `new-book` issue instead)

**Specific reference:** chapter, section, or page number — be precise so the rule can be traced back to the source.

## Proposed rule ID

E.g., `Z-7`, `S-6`, `H-6`. Check `references/_rule-index.md` to confirm the next available number.

## One-line rule name

Imperative or prescriptive form. E.g., "Cut throat-clearing openers" or "Use the active voice."

## Pull-quote (10-25 words from the source)

> "..."
> — Author, ch. N

## Detection cue

What pattern in the input text signals this rule should fire? Be specific — keywords, sentence shapes, or structural tells.

## Problem

2-4 sentences. What does the LLM do wrong? Why does it sound off to a human reader?

## Before / After

**Before**
> [Realistic AI-generated text — not a strawman]

**After**
> [The same passage rewritten following the rule]

## Cross-references

Which existing W-rules does this rule help fix? Which other book rules does it interlock with?

## Context tags

Which contexts should this rule fire in? Pick from: `all`, `memo`, `email`, `blog`, `book-draft`, `technical-doc`, `dictation`, `meeting-notes`. Justify if you're picking a non-obvious set.

## Why this rule isn't a duplicate

How does this rule add something the existing rules don't already cover? If it's a sharper version of an existing rule, why does the project benefit from both?

## Acceptance bar self-check

- [ ] Traceable to a specific page or chapter
- [ ] Maps to a real AI-failure mode
- [ ] Adds something the existing rule set doesn't cover
- [ ] Before/after example is realistic, not a strawman
- [ ] Detection cue is specific enough to actually find the pattern
- [ ] "How to apply" gives a mechanical move

## I plan to submit a PR

- [ ] Yes, I'll open the PR (one rule per PR per `CONTRIBUTING.md`)
- [ ] No, I'm flagging this for a maintainer to pick up
