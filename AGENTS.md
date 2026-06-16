# AGENTS.md

Guidance for AI coding agents (Claude Code, OpenCode, and others) working in this repository.

## What this repo is

A Claude Code / OpenCode skill implemented entirely as Markdown. The runtime artifact is `SKILL.md`: the agent reads its YAML frontmatter (metadata and allowed tools) followed by the operating prompt. There is no build step and no code to run.

Plainspeak is a fork of `blader/humanizer` retuned for scientific, technical, and data-science prose. It makes technical writing clear and removes AI tells without flattening domain terminology.

## Key files

- `SKILL.md` is the skill: frontmatter (`name`, `version`, `description`, `allowed-tools`) followed by the core rules, technical-register guidance, quick checks, and process. This is the source of truth for behavior.
- `references/` holds the catalogs the skill loads on demand: `phrases.md`, `structures.md`, `technical.md`, `examples.md`, and `sources.md`.
- `README.md` is for humans: install, usage, scope, examples, provenance, and version history.
- `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` package the repo as a Claude Code plugin (it is its own marketplace; the plugin source is `./`). The skill loads from the root `SKILL.md` via the single-skill layout, so do not move `SKILL.md` into a `skills/` subfolder.
- `LICENSE` is the upstream MIT license (Siqi Chen, 2025). Keep it unchanged.

## The maintenance contract

Plainspeak does not use the upstream "33 numbered patterns" contract. Rules are grouped by kind (phrases, structures) and by artifact (technical), not numbered. Do not reintroduce a pattern-count invariant.

When you change behavior or content:

- **Keep `SKILL.md` self-sufficient.** It must work on its own for short text. The reference files add depth for longer or artifact-specific tasks. If you add a rule to a reference file that changes default behavior, make sure `SKILL.md` still reflects it.
- **Keep `SKILL.md` and `README.md` in sync** on scope, provenance, and version. If you change the artifact scope, update both the skill's description and the README's "what it is good for" section.
- **Bump the version in all three places together:** `SKILL.md` frontmatter, `.claude-plugin/plugin.json`, and the README version history. The `version` in `plugin.json` is what triggers plugin updates for users; if it does not change, installers never see the new release. Run `claude plugin validate .` after editing the manifests.
- **Preserve attribution.** Any new borrowed material gets credited in `references/sources.md` and, if it changes the lineage, in the README provenance section.
- **Record non-obvious fixes.** If you change the prompt to handle a tricky failure mode (a repeated mis-edit, a flattened domain term, a tone shift), add a short note to the README version history explaining what was fixed and why.

## Editing rules

- Preserve valid YAML frontmatter (formatting and indentation).
- The prompt and reference files are the product. Edit them like a careful instruction document, not code.
- **Practice what the skill preaches.** No em or en dashes anywhere in the skill or its references; use periods, commas, colons, or parentheses. No promotional padding, no inflated vocabulary. Scan your changes before committing: `grep -rn $'—\|–' SKILL.md references/` should return nothing.
- Keep domain terms intact in examples (WIS, MCMC, cross-validation). The skill teaches by exemplar, so its own examples must follow its rules.

## Commits

- One logical unit per commit; leave `SKILL.md` parseable and the skill usable at every commit.
- No `Co-Authored-By` or AI-attribution lines in commit messages.
- Do not push or make the repo public without explicit owner approval.
