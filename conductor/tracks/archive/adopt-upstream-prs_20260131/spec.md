# Specification: Adopt Upstream Pull Requests

## Overview

This track aims to synchronize the local repository with three specific upstream pull requests from `blader/humanizer`. The goal is to incorporate community fixes and improvements while ensuring all downstream adapters (Gemini, Antigravity, VS Code, etc.) are kept in sync after each change.

## Upstream Changes

1.  **PR #3: Fix YAML description**
    - Rename "excessive conjunctive phrases" to "filler phrases" in the YAML frontmatter of `SKILL.md`.
    - Bump version to `2.1.2`.
2.  **PR #4: Fix grammatical errors**
    - Fix comma splices and missing commas in `SKILL.md` and `README.md`.
    - Standardize quotes in `WARP.md`.
    - Formatting fixes (blank lines).
3.  **PR #5: Add "Primary Single Quotes" detection**
    - Add new detection Pattern #19 ("Primary Single Quotes") to `SKILL.md`.
    - Renumber subsequent patterns.
    - Bump version to `2.2.0`.
    - Update `README.md` and `WARP.md` tables.

## Requirements

### Functional

- **Sequential Adoption:** Changes must be applied one PR at a time in the order: #3 -> #4 -> #5.
- **Continuous Synchronization:** The `scripts/sync-adapters.ps1` script must be run successfully after adopting _each_ PR to propagate changes to all adapters.
- **Version Integrity:** Ensure `SKILL.md` version matches the upstream PR recommendations (2.1.2 -> 2.2.0).

### Non-Functional

- **Verification:** Verify that local changes match the intent of the upstream PRs.
- **Adapter Validation:** Ensure `scripts/validate-adapters.ps1` passes after each sync.
- **Linting:** Ensure changes pass `markdownlint` checks.

## Acceptance Criteria

- `SKILL.md` frontmatter uses "filler phrases".
- Grammar fixes from PR #4 are present.
- Pattern #19 is documented in `SKILL.md` and `README.md`, and version is `2.2.0`.
- All adapter files (e.g., `adapters/gemini-extension/GEMINI.md`, `adapters/antigravity-skill/SKILL.md`) reflect these changes.
- The repository is clean and ready to be pushed.
