---
name: New book proposal
about: Propose adding a new foundational writing book to the canon
title: "[New book] "
labels: book-proposal
---

## Book

**Title:** *...*
**Author:** ...
**Edition + year:** ...
**Publisher:** ...
**ISBN (optional):** ...

## Why this book belongs in humanizer-classics

3-5 sentences on what this book teaches that the existing rules don't already cover. What's the unique angle? Who is this book for? When does its advice matter most?

## Proposed rule prefix

E.g., `W` is taken (Wikipedia), `Z` is taken (Zinsser), `S` is taken (Strunk & White), `H` is taken (HBR Guide). Pick a single letter not already used — usually the first letter of the author's last name. Confirm by checking `references/_rule-index.md`.

## Proposed rule list

Sketch 3-7 rules you'd add from this book. Each should have:

- **Rule name** (one line, imperative)
- **Source** (chapter, page)
- **What it adds** (why this rule isn't already covered by Z/S/H/W)

Format:

| ID | Rule name | Source | What it adds |
|----|-----------|--------|--------------|
| X-1 | ... | ch. N | ... |
| X-2 | ... | ch. N | ... |
| X-3 | ... | ch. N | ... |

## Voice and pull-quote sample

Paste 1-2 short pull-quotes (10-25 words each) you'd plan to cite. This helps reviewers gauge whether the book's voice fits the project.

## License / fair use

Confirm:

- [ ] You can cite the book under fair use for short pull-quotes (10-25 words for educational commentary)
- [ ] You're not proposing to reproduce extended excerpts, chapter summaries, or proprietary material

## Plan

- [ ] I plan to submit the PR myself
- [ ] I'm flagging this for a maintainer to pick up

If submitting yourself, see `CONTRIBUTING.md` for the file format and the acceptance bar. The PR should include:

- A new file at `references/<author>-<short-title>.md`
- Updates to `references/_rule-index.md` (add the new rule rows + cross-references)
- Updates to `SKILL.md` (add the new book's rules to the catalog and the references list)
- Updates to `README.md` ("Books currently included")
- At least one new corpus sample at `tests/corpus/` exercising rules from this book
- A version bump (minor — e.g., 3.0.x → 3.1.0)

## Acknowledgments

Anyone you'd like credited (yourself, the book's author, anyone whose review helped shape the proposal).
