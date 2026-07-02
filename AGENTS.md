# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Warp, etc.) working in this repository.

## What this repo is

A portable agent skill implemented entirely as Markdown. The runtime artifact is `SKILL.md`: the agent reads its YAML frontmatter (metadata + allowed tools) followed by the editor prompt. There is no build step and no code to run, and the repo should avoid wording that limits support to one or two harnesses.

## Key files

- `SKILL.md` — the skill itself. YAML frontmatter (`name`, `version`, `description`, `compatibility`, `allowed-tools`) followed by the canonical, numbered pattern list with before/after examples. **This is the source of truth.**
- `README.md` — for humans: installation, usage, a summary table of the patterns, and a version history.
- `.claude-plugin/plugin.json` — optional Claude Code plugin manifest.
- `.claude-plugin/marketplace.json` — optional single-repo marketplace entry so `/plugin marketplace add blader/humanizer` works.

## The maintenance contract

`SKILL.md` and `README.md` must stay in sync. When you change behavior or content:

- **Patterns:** the skill currently defines **34 numbered patterns**. If you add, remove, or renumber any, update the README pattern table, its "N Patterns Detected" heading, and every cross-reference in the same change. Keep numbering stable unless you are deliberately renumbering.
- **Version:** `SKILL.md` frontmatter has a `version:` field, `README.md` has a "Version History" section, and `.claude-plugin/plugin.json` has a `version` field. Bump them together so package metadata matches the skill. (`marketplace.json` intentionally omits a version so `plugin.json` stays the package source of truth.)
- **Compatibility:** keep install and usage language harness-neutral. The skill should work in any agent harness that can load Markdown skill instructions; Claude Code, OpenCode, Codex, and other harnesses are examples, not limits.
- **Non-obvious fixes:** if you change the prompt to handle a tricky failure mode (a repeated mis-edit, an unexpected tone shift), add a short note to the README version history explaining what was fixed and why.

## Editing SKILL.md

- Preserve valid YAML frontmatter (formatting and indentation).
- The prompt below the frontmatter is the product. Edit it like a careful instruction document, not code.
