# Contributing to Humanizer Classics

Thanks for helping make this a better tool for people who want their AI-assisted writing to sound human. This is meant to be an ongoing repository — new books, new rules, refinements to existing ones — and contributions from people who actually do this work for a living are the point.

## What you can contribute

| Contribution | Effort | PR shape |
|--------------|--------|----------|
| Add a new rule to an existing book | Small | One rule per PR, ~30 lines |
| Refine an existing rule (better example, sharper detection cue) | Small | One rule per PR |
| Add a new book reference file | Medium | One book per PR, 3-7 rules |
| Add a new corpus sample to `tests/corpus/` | Small | One sample pair per PR |
| Refine the Granola/Wispr workflow | Medium | Update `references/granola-meeting-transcripts.md` |
| Propose architectural changes | Large | Open an issue first, discuss before PR |

## One rule per PR

The repo follows a *one rule per PR* norm. This matches the cadence the upstream `humanizer` repo has used since v2.0 (e.g., commits "Add passive voice rule (#80)", "feat: add hyphenated word pair overuse pattern (#42)"). Small PRs are easier to review, easier to revert, and force each rule to stand on its own.

If your rule depends on another change (e.g., a new book file), bundle the dependency into the same PR — but keep the *first new rule* in the same PR as the book file, so reviewers can see the rule format in context.

## How to add a new rule

1. **Decide which book file it belongs to.** If the rule is sourced from one of the existing books, add it there. If it's from a new book, copy `references/_template-book-rules.md` to `references/<author>-<short-title>.md` and start with that template.

2. **Follow the rule format.** Every rule has these sections, in order:
   - `### <ID>. <One-line rule name in imperative or prescriptive form>`
   - `**Source:**` — book, edition, chapter, page (as specifically as you can)
   - **Pull-quote** — 10-25 words from the source, attributed
   - `**Cross-references:**` — which W-rules this helps fix; which other book rules it interlocks with
   - `**Context tags:**` — `all` or any combination of `memo`, `email`, `blog`, `book-draft`, `technical-doc`, `dictation`, `meeting-notes`
   - `**Detection cue:**` — what pattern in the text signals this rule should fire
   - `**Problem:**` — 2-4 sentences on the failure mode and why it sounds off
   - `**Before** / **After**` — a realistic, non-strawman example pair
   - `**How to apply:**` — the mechanical move; 1-3 sentences a writer can run on autopilot

3. **Update `references/_rule-index.md`** — add a row to the rule-ID table and (if applicable) a row to the cross-reference graph.

4. **Add a corpus sample if the rule introduces a new pattern.** Drop a `*.md` + `*.expected-fixes.md` pair into `tests/corpus/` showing the rule firing.

5. **Bump the version.** See *Versioning* below.

6. **Run the manual review** (see `tests/REVIEWING.md`) before opening the PR.

## How to add a new book

1. **Copy the template.** `cp references/_template-book-rules.md references/<author>-<short-title>.md`. Use kebab-case: `williams-style-lessons-in-clarity-and-grace.md`, `pinker-sense-of-style.md`.

2. **Pick a single-letter rule prefix not already used.** Currently used: W, Z, S, H. The prefix should be the first letter of the author's last name when possible.

3. **Write 3-7 rules following the format above.** 5 is the sweet spot — enough to be useful, few enough to review thoroughly.

4. **Update `SKILL.md`** — add the new book's rules to the *Craft rules* table and to the references list at the bottom.

5. **Update `references/_rule-index.md`** — add the new rule rows.

6. **Update `README.md`** — add the book to the "Books currently included" list.

7. **Add corpus samples** that exercise the new rules.

8. **Bump the version** (minor bump for a new book — see *Versioning*).

## Rule acceptance bar

A rule is ready to merge when:

- ✅ It traces to a specific page or chapter in a real, citable source
- ✅ It maps to a real AI-failure mode (not just generic "good writing" advice)
- ✅ It does something the existing rules don't already cover, or it covers them better with a positive prescription
- ✅ The before/after example is realistic AI-generated text, not a strawman
- ✅ The detection cue is specific enough that a reader (or a model) can find the pattern
- ✅ The "How to apply" gives a mechanical move, not a vague exhortation

A rule is **not** ready when:

- ❌ It restates a Wikipedia detection rule without adding a positive fix
- ❌ The example is contrived (no real AI writes that way)
- ❌ The pull-quote can't be traced to a specific edition + page
- ❌ The rule conflicts with another rule and there's no `context_tags` resolution
- ❌ It's about taste rather than craft (e.g., "use the Oxford comma" — that's style preference, not AI-failure)

## Pull-quote licensing

Pull-quotes from cited books are short excerpts (10-25 words) used for educational commentary, which is fair use under U.S. copyright law. Don't include longer excerpts. Don't reproduce entire chapters or large structural elements. When in doubt, paraphrase and cite.

If a quote is approximate or paraphrased rather than exact, mark it `(paraphrased)` after the citation.

## Conflict resolution

When two rules disagree (e.g., Zinsser's Z-5 "be present on the page" wants first person, but H-1 "lead with bottom line" governs a memo where first person is wrong), the **`context_tags:`** field on each rule resolves the conflict. The rule applies only when the input's context tag is in its tag list.

Current tags: `all`, `memo`, `email`, `blog`, `book-draft`, `technical-doc`, `dictation`, `meeting-notes`. Propose new tags via PR if the existing set doesn't fit.

## Versioning

This project follows [semver](https://semver.org/):

- **Major bump (e.g., 3.x.x → 4.0.0)** — breaking architecture change. Don't introduce these without an issue and discussion.
- **Minor bump (e.g., 3.0.x → 3.1.0)** — new book added, or a structurally significant new feature (e.g., a new context tag).
- **Patch bump (e.g., 3.0.0 → 3.0.1)** — new rule in an existing book, refinement of an existing rule, doc fixes.

Update both `SKILL.md` (frontmatter `version:` field) and `CHANGELOG.md` in the same PR.

## Issue templates

When opening an issue, use one of:

- **`new-rule`** — propose a new rule
- **`new-book`** — propose a new book

Templates live at `.github/ISSUE_TEMPLATE/`.

## Code of conduct

Be specific. Cite sources. Don't argue from taste — argue from text. The discussion should be about whether the rule actually catches a real AI-failure mode and whether the fix actually helps.

If you disagree with an existing rule, open an issue with the specific text it mishandles. Concrete disagreements move the project forward.
