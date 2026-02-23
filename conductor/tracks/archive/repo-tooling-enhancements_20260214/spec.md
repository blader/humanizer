# Spec: Repository quality tooling and multi-agent distribution hardening

## Overview

This feature track implements repository management recommendations by standardizing prose linting entry points, enabling automated dependency management, and expanding distribution guidance to include a broader cross-agent skill installer workflow.

## Goals

- Make Vale usage explicit at npm script level and in CI quality gates.
- Add Renovate configuration for automated dependency update PRs.
- Extend distribution documentation with `npx skills` as an additional cross-agent distribution path.
- Keep `SKILL.md` canonical and avoid changing Humanizer behavior.

## Functional requirements

1. Add npm scripts for Vale linting and include them in aggregate linting.
2. Update CI skill-distribution workflow so checks use the updated aggregate lint command.
3. Add `renovate.json` with baseline safe defaults for this repository.
4. Update canonical install docs to include:
   - `npx skills` install/update guidance
   - support-status labeling aligned with existing matrix model
5. Update distribution docs to reference the expanded toolchain (`Skillshare`, `AIX`, `npx skills`).
6. Create a new conductor track artifact set and register it in `conductor/tracks.md`.

## Non-functional requirements

- No breaking changes to adapter generation.
- CI additions must remain non-interactive and cross-platform compatible.
- Documentation changes must pass markdown and docs validation checks.

## Acceptance criteria

- `npm run vale` and `npm run lint:all` both succeed locally.
- `.github/workflows/skill-distribution.yml` uses the updated lint command path that includes Vale checks.
- `renovate.json` exists and validates JSON syntax.
- `docs/install-matrix.md` includes a `npx skills` section with Install/Verify/Update/Uninstall blocks.
- `docs/skill-distribution.md` references all three distribution tools.
- New track appears in `conductor/tracks.md` active tracks list.

## Out of scope

- Migrating away from Changesets.
- Adding release-please automation in this track.
- Adding new runtime adapters.
