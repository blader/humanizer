# AGENTS.md

Guidance for AI coding agents (Codex, Claude Code, OpenCode, Warp, etc.) working in this repository.

## What this repo is

A **Codex / Claude Code / OpenCode skill** implemented entirely as Markdown. The main runtime artifact is `SKILL.md`: the agent reads its YAML frontmatter followed by the editor prompt. Codex also uses `agents/openai.yaml` for UI-facing metadata. There is no build step and no code to run.

## Key files

- `SKILL.md` — the skill itself. YAML frontmatter (`name`, `description`, `metadata.version`, `metadata.compatibility`, `allowed-tools`) followed by the canonical, numbered pattern list with before/after examples. **This is the source of truth.**
- `agents/openai.yaml` — Codex UI metadata for the skill list and default prompt.
- `README.md` — for humans: installation, usage, a summary table of the patterns, and a version history.

## The maintenance contract

`SKILL.md` and `README.md` must stay in sync. When you change behavior or content:

- **Patterns:** the skill currently defines **30 numbered patterns**. If you add, remove, or renumber any, update the README pattern table, its "N Patterns Detected" heading, and every cross-reference in the same change. Keep numbering stable unless you are deliberately renumbering.
- **Version:** `SKILL.md` frontmatter metadata has a `version:` field and `README.md` has a "Version History" section. Bump both together.
- **Codex metadata:** if you change the skill name, purpose, or default invocation, keep `agents/openai.yaml` aligned.
- **Non-obvious fixes:** if you change the prompt to handle a tricky failure mode (a repeated mis-edit, an unexpected tone shift), add a short note to the README version history explaining what was fixed and why.

## Editing SKILL.md

- Preserve valid YAML frontmatter (formatting and indentation).
- The prompt below the frontmatter is the product. Edit it like a careful instruction document, not code.
