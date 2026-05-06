# Changelog

All notable changes to Agentic Humanizer are documented here. The format
is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.1.0] (2026-05-07)

Initial release. Forked from
[`blader/humanizer`](https://github.com/blader/humanizer) by Siqi Chen.

### Added

- `SKILL.md` orchestrating harness detection, Slop or Not Pro probe,
  4-question interview, and 5-iteration rewrite loop.
- Harness routing files for Claude Code, Codex CLI, Cursor, Gemini CLI,
  OpenCode, and a generic plain-text fallback.
- `references/patterns.md` (29 AI-tells from upstream, attributed).
- `references/per-iteration-strategies.md` (per-iteration cookbook).
- `references/slop-cli-setup.md` and `references/slop-mcp-setup.md`
  (install guides).
- `examples/sample-ai-text.md` smoke-test fixture.
- GitHub Actions CI for markdownlint, frontmatter validation, and
  relative-link checking.
