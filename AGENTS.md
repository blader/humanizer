# Guide for agents

This file explains how to change Humanizer without breaking its package or prompt.

## What this repo contains

Humanizer is an agent skill written in Markdown. `SKILL.md` is the prompt that agents read. The repo has no build step. It ships as the Wallet Pickle Humanizer: the general Humanizer engine, plus an additive Wallet Pickle editorial layer in `references/`.

Keep the skill portable. Do not write instructions that limit it to one or two agent tools.

## Key files

- `SKILL.md` is the source of truth and the repo's only skill file. It contains portable YAML metadata, an account of why AI text sounds the way it does, and numbered patterns grouped in five sections and ordered by strength and frequency.
- `README.md` explains installation, use, patterns, and version history.
- `references/wallet-pickle-voice.md` holds the Wallet Pickle editorial voice: tone, the anti-AI watch list for finance content, the accuracy rules, and the publish-readiness gate. It extends the engine in `SKILL.md` and must never relax the no-invented-facts rule.
- `references/wallet-pickle-formats.md` holds format-specific guidance (articles, newsletters, quizzes, and so on).
- `references/wallet-pickle-protected-terms.md` holds the house style and protected-terms list. Keep it small; add rows only when they are genuinely needed.
- `.claude-plugin/plugin.json` describes the Claude plugin and points its skill loader at the root `SKILL.md`.
- `.claude-plugin/marketplace.json` lets users add this repo as a Claude marketplace.
- `agents/openai.yaml` holds the display name, short description, and default prompt for OpenAI-compatible agents.
- `scripts/validate-package.py` checks package files and shared values.

## Rules for changes

Keep `SKILL.md` and `README.md` in sync.

- **Patterns:** Patterns are numbered from 1 without gaps, strongest and most frequent first. A new tell earns a pattern only when no existing pattern already implies it; prefer folding it into an existing pattern. If you add, remove, or renumber a pattern, update the README tables, the README section title, and every §reference. The validator derives the count from the headings.
- **Version:** Keep the same version in `SKILL.md` under `metadata.version`, the first README version entry, and `.claude-plugin/plugin.json`. Do not add a top-level `version` field to the skill.
- **Compatibility:** Keep install and use instructions neutral across agents. Names such as Claude Code, OpenCode, and Codex are examples, not limits.
- **History:** Add a short README version note for any behavior change or non-obvious fix.
- **Wallet Pickle layer:** Keep `references/wallet-pickle-voice.md`, `references/wallet-pickle-formats.md`, and `references/wallet-pickle-protected-terms.md` additive to the engine in `SKILL.md`. A new anti-AI watch item for finance content belongs in the table in `wallet-pickle-voice.md`, mapped to the existing §pattern it extends, not as a new numbered pattern. The validator checks that every `references/*.md` file `SKILL.md` points to actually exists, and that `plugin.json`'s name matches `SKILL.md`'s name.
- **Checks:** Before publishing, run `python3 scripts/validate-package.py`, `npx skills add . --list`, and `claude plugin validate .`.

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
