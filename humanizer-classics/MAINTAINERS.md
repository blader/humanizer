# Maintainers

This document lists the people who review PRs, accept new rules and books, and steer the direction of `humanizer-classics`.

## Current maintainers

| Name | Role | Contact |
|------|------|---------|
| Jason Mermilian | Lead curator (founding maintainer) | jason@jasonemermd.com |

## What maintainers do

- Review PRs against the rule acceptance bar (see `CONTRIBUTING.md`)
- Curate which books are admitted into the canon
- Resolve conflicts between rules using the `context_tags:` system
- Cut releases (semver bumps in `SKILL.md` frontmatter and `CHANGELOG.md`)
- Keep the rule index (`references/_rule-index.md`) accurate as rules are added or refined

## How to become a maintainer

This is meant to be an ongoing repository, not a one-person inbox. Maintainership is open to people who:

1. Have contributed at least one accepted rule or book
2. Have reviewed PRs constructively (concrete, source-cited disagreements move the project forward)
3. Care about the craft — this isn't a place for taste disputes; it's a place for rules grounded in real writing books and real AI-failure modes

If you'd like to help curate, open an issue or email the lead maintainer.

## Conflicts of interest

Maintainers may have authored books they want to add. That's fine — but if a maintainer wants to add their *own* book as a reference, the PR must be reviewed and approved by another maintainer, not self-merged.

## Release cadence

No fixed cadence. Releases happen as:

- Patch releases (3.0.x): when a new rule is merged, ship the next day
- Minor releases (3.x.0): when a new book is merged, ship within a week (alongside corpus samples)
- Major releases (x.0.0): only for architectural changes; require an issue, discussion, and a written upgrade path

## Acknowledgments

The original `humanizer` skill (v2.x) was created by Siqi Chen and is the basis for v3. The core voice-calibration feature, two-pass audit process, and personality-and-soul guidance are inherited verbatim.
