# Citation Manager Boundary Decision

## Status

Accepted on 2026-03-14.

## Decision

The citation reference manager is no longer treated as part of the maintained Humanizer skill surface. It now lives under `experiments/citation_ref_manager/`.

## Rationale

- Humanizer-next is a skill-source repository whose supported output is the Humanizer writing skill and its synced adapters.
- The citation manager does not feed the generated skill artifacts, adapter bundles, or install matrix.
- Keeping the subsystem under `src/` implied that it was part of the canonical source tree for the supported skill, which was misleading.
- Moving it to `experiments/` preserves the work, keeps it available for future extraction, and narrows the quality and maintenance contract of the repository.

## Consequences

- Maintainer workflow, sync checks, and adapter validation remain focused on the supported skill content under `src/`.
- Experimental citation-manager work can continue in-tree without defining the public scope of the repo.
- If the citation manager becomes strategic, the next step should be either:
  - extract it into a dedicated repository or skill, or
  - formally productize it and promote only the supported portions back into `src/`.
