---
adapter_metadata:
  skill_name: humanizer
  skill_version: 2.3.0
  last_synced: 2026-03-14
  source_path: SKILL.md
  adapter_id: codex-cli
  adapter_format: AGENTS.md
---

# Humanizer (agents manifest)

This repository defines the **Humanizer** coding skill, designed to remove AI-generated patterns and improve prose quality.

This is a **skill source repository**. Treat the Node/Python configuration here as maintenance tooling for compiling, validating, and distributing skill artifacts rather than as a standalone software product.

## Capability

The Humanizer skill provides a set of 25 patterns for identifying and rewriting "AI-slop" or sterile writing. It preserves technical literals (code blocks, URLs, identifiers) while injecting personality and human-like voice.

### Variants

- **Standard** ([SKILL.md](SKILL.md)): Focuses on "Personality and Soul". Best for blogs, creative writing, and emails.
- **Pro** ([SKILL_PROFESSIONAL.md](SKILL_PROFESSIONAL.md)): Focuses on "Voice and Craft". Best for technical specs, reports, and professional newsletters.

Primary prompt: [SKILL.md](SKILL.md). Supported adapters live in the `adapters/` directory.

## Context

This file serves as the **Agents.md** standard manifest for this repository. It provides guidance for AI agents (like yourself) to understand how to interact with this codebase.

### Repository structure

- `src/`
  - Modular fragments used to compile the skill files.
- `experiments/`
  - Experimental subsystems and extraction candidates that are intentionally outside the primary skill contract.
- `SKILL.md` / `SKILL_PROFESSIONAL.md`
  - Compiled skill files (Standard and Pro).
- `adapters/`
  - Tool-specific implementations (VS Code, Qwen, Copilot, Antigravity, etc.).
- `scripts/`
  - Automation for syncing fragments to these files.
  - Maintenance/build scripts for artifact generation, not user-facing runtime code.

### Core instructions

You are the Humanizer editor. Follow the canonical rules in `SKILL.md` or `SKILL_PROFESSIONAL.md`.

When given text to humanize:

- Identify AI-writing patterns described in the skill files.
- Rewrite only problematic sections while preserving meaning and tone.
- Preserve technical literals: inline code, fenced code blocks, URLs, file paths, identifiers.
- Output the rewritten text, then a short bullet summary of changes.

## Maintenance

To sync changes from `src/` to these adapters, run:

```bash
npm run sync
```

### Making changes safely

- `SKILL.md` has a `version:` field in its YAML frontmatter.
- **Rule:** If you bump the version, you must update the source in `src/` and run `npm run sync`.
- `package.json` is only for repo tooling. Do not treat this repository as an npm package to publish or consume.
- Changes under `experiments/` should not be allowed to silently expand the maintained skill surface. Promote them into `src/` only if they become a supported part of Humanizer.

## Interoperability

Check for specialized adapters in the `adapters/` directory for specific tool support (Antigravity, VS Code, Gemini, Qwen, Copilot, Cline, Kilo, Amp, OpenCode).
