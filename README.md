# Humanizer-next

Humanizer-next is the source repository for an agent skill that removes common signs of AI-generated writing while preserving meaning, tone, and technical literals.

This repo is not a standalone runtime library. It exists to maintain canonical skill content, compile generated artifacts, validate adapters, and distribute synced outputs to multiple agent environments.

## Repo role

- Canonical skill sources live under `src/`.
- Experimental prototypes and extraction candidates live under `experiments/`.
- Generated root artifacts are `SKILL.md` and `SKILL_PROFESSIONAL.md`.
- Adapter outputs live under `adapters/`.
- Repository guidance for agent environments lives in `AGENTS.md`.
- Installation and platform support guidance lives in `docs/install-matrix.md`.

## Maintainer setup

```bash
git clone https://github.com/edithatogo/humanizer-next.git
cd humanizer-next
npm install
```

This setup is for maintainers working on the skill source. End-user install paths for Gemini, Antigravity, Copilot, VS Code, and other adapters are documented in `docs/install-matrix.md`.

## Maintainer workflow

1. Update source fragments in `src/`.
2. Rebuild and sync generated outputs with `npm run sync`.
3. Validate adapters and docs with `npm run validate`.
4. Run the full maintainer gate with `npm run lint:all`, `npm test`, `pytest`, and `npm run check:sync`.

`npm run check:sync` is important for this repo shape. It verifies that generated adapter outputs are already in sync with source content and prevents drift from being merged.

## Supported outputs

- Standard skill: `SKILL.md`
- Professional skill: `SKILL_PROFESSIONAL.md`
- Agents manifest: `AGENTS.md`
- Adapter bundles under `adapters/`

Current adapters include Gemini CLI, Google Antigravity, Qwen CLI, GitHub Copilot, VS Code, and related wrapper formats used by downstream tools.

## What this repo is not

- Not published as an npm package.
- Not intended to be consumed as an application dependency.
- Not a general-purpose writing toolkit monorepo.

## Release model

Releases package skill artifacts and adapter bundles as GitHub release assets. The release workflow does not publish to npm.

## Quality gates

The repo is validated as a skill-source repository:

- Markdown, Vale, ESLint, TypeScript, and Prettier checks
- Node regression tests
- Python adapter tests
- Sync-drift verification
- Cross-platform skill distribution validation

The maintainer gates are intentionally centered on the maintained skill surface: `src/`, generated artifacts, adapters, docs, and validation scripts. Content under `experiments/` is kept in-tree for evaluation and extraction decisions, but it is not treated as part of the primary supported skill contract.

## Self-improvement track

The active conductor self-improvement track lives under `conductor/tracks/repo-self-improvement_20260303/`. It refreshes upstream repo data, reviews open PRs and issues, and records Adopt, Reject, or Defer decisions for candidate improvements.
