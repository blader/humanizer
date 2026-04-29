# [Book Title] — [Author Last Name]

> **Template for contributors.** Copy this file to `references/<author>-<short-title>.md`, fill in every section, and submit a PR. See `CONTRIBUTING.md` for the acceptance bar.

**Source:** [Author], *[Title]*, [edition + year], [publisher]
**Type:** Craft prescription (positive guidance — what good writing *does*)
**License of pull-quotes:** Fair use — short excerpts (10-25 words) for educational commentary
**Rule prefix for this book:** `[X]` (single letter, not yet used; check `_rule-index.md`)

## Why this book belongs in humanizer-classics

One paragraph (3-5 sentences) on what this book teaches that the existing rules don't already cover. What's the unique angle? Who is this book for? When does its advice matter most?

## Rules in this file

| ID | Rule (one line) | Chapter / page reference |
|----|-----------------|--------------------------|
| X-1 | ... | ... |
| X-2 | ... | ... |

(3+ rules required for a new book; 5-7 is the sweet spot.)

---

### X-1. [Rule name in imperative or prescriptive form]

**Source:** [Author], *[Title]*, ch. N "[Chapter title]", p. NN

> "[Pull-quote, 10-25 words, illustrating the rule in the author's own voice]"
> — [Author], p. NN

**Cross-references:** [W-N detection rule(s) this rule helps fix; other book rules it interlocks with]
**Context tags:** [all | memo | blog | technical-doc | dictation | meeting-notes | book-draft | email]
**Detection cue:** [What pattern in the input text signals that this rule should fire? Be specific — keywords, sentence shapes, or structural tells.]

**Problem:** [Two to four sentences. Describe the failure mode in AI-generated text — what does the LLM do wrong, and why does it sound off to a human reader?]

**Before**
> [A 1-3 sentence example of AI-generated text that violates the rule. Realistic, not strawman.]

**After**
> [The same passage rewritten following the rule. Should preserve meaning while sounding human.]

**How to apply:** [The mechanical move. What does a writer or editor do, sentence by sentence, to surface and fix the violation? Aim for 1-3 sentences a reader can run on autopilot.]

---

### X-2. [...]

(Repeat the block above for each rule. Keep rules tightly scoped — one mental move per rule. If a rule is doing two things, split it.)

---

## Notes for reviewers

- **Don't restate Wikipedia rules.** If the rule is just "spot AI vocabulary words," that's already W-7. Book rules should add a *positive* move the writer can execute.
- **Be specific to the source.** Generic writing advice is easy to find; the value of pinning a rule to a book is the citation chain. If the advice doesn't trace cleanly to a chapter, the rule probably isn't ready.
- **Worked examples beat exhortation.** A weak rule says "write clearly." A strong rule shows the move and the before/after.
- **Resolve conflicts via context tags.** When two rules disagree (e.g., Zinsser "use first person" vs. an HBR memo context), tag rules so Claude can pick the right one for the input.
