# Plan: Adopt Upstream Pull Requests

## Phase 1: Adopt PR #3 (Fix YAML)

- [x] Task: Update `SKILL.md` frontmatter (rename "excessive conjunctive phrases" to "filler phrases")
- [x] Task: Bump `SKILL.md` version to `2.1.2`
- [x] Task: Update `README.md` (if applicable per PR)
- [x] Task: Run `scripts/sync-adapters.ps1` to propagate changes
- [x] Task: Run `scripts/validate-adapters.ps1` to ensure integrity
- [x] Task: Conductor - Automated Verification 'Phase 1: Adopt PR #3' [5a6a791]

## Phase 2: Adopt PR #4 (Fix Grammar)

- [x] Task: Apply comma splice fixes and other grammar corrections to:
  - [x] `SKILL.md`
  - [x] `README.md`
  - [x] `WARP.md`
- [x] Task: Run `markdownlint` (via `pre-commit` or manual check) to verify prose quality
- [x] Task: Run `scripts/sync-adapters.ps1`
- [x] Task: Conductor - Automated Verification 'Phase 2: Adopt PR #4' [5a6a791]

## Phase 3: Adopt PR #5 (Add "Primary Single Quotes" Pattern)

- [x] Task: Add Pattern #19 ("Primary Single Quotes") to `SKILL.md` and renumber subsequent patterns
- [x] Task: Bump `SKILL.md` version to `2.2.0`
- [x] Task: Update `README.md` detection table and version history
- [x] Task: Update `WARP.md` summary
- [x] Task: Run `scripts/sync-adapters.ps1`
- [x] Task: Run `scripts/validate-adapters.ps1`
- [x] Task: Conductor - Automated Verification 'Phase 3: Adopt PR #5' [5a6a791]

## Phase 4: Final Verification

- [x] Task: Run full test suite (if available) or manual spot check of an adapter
  - All 14 tests pass
  - Adapter validation complete
- [x] Task: Conductor - Automated Verification 'Phase 4: Final Verification' [5a6a791]
