# Guide for agents

This file explains how to change Humanizer without breaking its package or prompt.

## What this repo contains

Humanizer is an agent skill written in Markdown. `SKILL.md` is the prompt that agents read. The repo has no build step.

Keep the skill portable. Do not write instructions that limit it to one or two agent tools.

## Key files

- `SKILL.md` is the source of truth and the repo's only skill file. It contains portable YAML metadata, an account of why AI text sounds the way it does, and numbered patterns grouped in six sections and ordered by strength and frequency.
- `README.md` explains installation, use, and patterns.
- `CHANGELOG.md` holds the release notes, newest first. Old notes keep the pattern numbers their release used.
- `.claude-plugin/plugin.json` describes the Claude plugin and points its skill loader at the root `SKILL.md`.
- `.claude-plugin/marketplace.json` lets users add this repo as a Claude marketplace.
- `.cursor-plugin/plugin.json` describes the Cursor plugin. Omit a `skills` path so Cursor loads the root `SKILL.md`.
- `package.json` makes the repo a pi package. Its `pi.skills` entry points at the repo root so pi loads the root `SKILL.md`. Do not add a `version` field; pi installs from git.
- `agents/openai.yaml` holds the display name, short description, and default prompt for OpenAI-compatible agents.
- `hooks/hooks.json` holds the Claude plugin hooks. Claude Code loads it from the plugin root, so do not also list it in `plugin.json`. It runs `scripts/humanizer-hook.py` on `SessionStart`, `UserPromptSubmit`, `PreToolUse` (`Write|Edit|MultiEdit`), and `Stop`.
- `scripts/humanizer-hook.py` routes each hook event. It adds the rules to context, blocks prose writes and final replies that the scorer flags (exit code 2), and carries thinking findings to the next prompt.
- `scripts/humanizer-lint.py` scores text with a weighted linear model over the `SKILL.md` patterns, in the style of `ste-lint`. Use only the Python standard library. Mark a feature `hard` only for a tell that justifies an edit on one sighting. If you renumber a pattern, update the `§` labels; the validator checks them.
- `tests/test_hooks.py` and `tests/fixtures.json` test the scorer and every hook event. A new feature must keep the human fixtures unflagged.
- `.claude/settings.json` turns the hooks off in this repo, because `SKILL.md` lists every tell.
- `scripts/validate-package.py` checks package files and shared values.

## Rules for changes

Keep `SKILL.md` and `README.md` in sync.

- **Patterns:** Patterns are numbered from 1 without gaps, strongest and most frequent first. A new tell earns a pattern only when no existing pattern already implies it; prefer folding it into an existing pattern. If you add, remove, or renumber a pattern, update the README tables, the README section title, and every §reference. The validator derives the count from the headings and checks that README pattern names match them.
- **Version:** Keep the same version in `SKILL.md` under `metadata.version`, the first `CHANGELOG.md` heading, `.claude-plugin/plugin.json`, and `.cursor-plugin/plugin.json`. Do not add a top-level `version` field to the skill.
- **Compatibility:** Keep install and use instructions neutral across agents. Names such as Claude Code, Cursor, OpenCode, and Codex are examples, not limits.
- **Description:** The plugin manifests use the first sentence of the `SKILL.md` description.
- **Length:** Every word of `SKILL.md` is read on each use. The validator caps it at 5,500 words; a change that adds words should earn them.
- **History:** Add a short `CHANGELOG.md` note for any behavior change or non-obvious fix.
- **Checks:** Before publishing, run `python3 scripts/validate-package.py`, `python3 -m unittest discover -s tests`, `npx skills add . --list`, and `claude plugin validate .`.

## Writing style

Use Plain Language in code comments, prompts, documentation, descriptions, validation messages, and progress reports.

- Lead with the main point.
- Use common words and active voice.
- Keep sentences and paragraphs short.
- Use one term for the same item.
- Use `must` for requirements.
- Use headings, lists, and tables when they help the reader.
- Remove repeated or unnecessary words.
- Limit acronyms and explain technical terms.
- Avoid double negatives.
- Keep exact identifiers, commands, paths, schema fields, quotations, watched phrases, and behavior-bearing examples.
- Keep the full technical meaning.

## Editing the skill

- Keep the YAML metadata valid.
- Treat the prompt below the metadata as the product.
- Prefer a short, clear instruction over another exception or repeated explanation.
