# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## What this repo is
This repository is a **Claude Code skill** implemented entirely as Markdown. It supports multiple languages (currently English and German) with automatic language detection.

The "runtime" artifacts are the `SKILL*.md` files: Claude Code reads the YAML frontmatter (metadata + allowed tools) and the prompt/instructions that follow.

`README.md` is for humans: installation, usage, and a compact overview of the patterns.

## Key files (and how they relate)

### Skill Files

| File | Skill Name | Purpose |
|------|------------|---------|
| `SKILL.md` | `humanizer` | **Universal entry point** - auto-detects language (EN/DE) and contains both pattern sets |
| `SKILL-EN.md` | `humanizer-en` | English-only patterns for explicit use |
| `SKILL-DE.md` | `humanizer-de` | German-only patterns for explicit use |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Installation, usage, pattern summaries for both languages |
| `WARP.md` | Development guidance (this file) |

### Relationships

- `SKILL.md` is the **primary skill** most users will invoke via `/humanizer`
- `SKILL-EN.md` and `SKILL-DE.md` are for users who want explicit language control
- When updating patterns, consider whether the change applies to one or both languages
- `README.md` should reflect pattern tables for both languages

## File structure

```
humanizer/
├── SKILL.md      # Universal (auto-detects EN/DE)
├── SKILL-EN.md   # English-only patterns
├── SKILL-DE.md   # German-only patterns (Deutsche Muster)
├── README.md     # Human documentation
└── WARP.md       # Development guide (this file)
```

## Common commands

### Install the skill into Claude Code
Recommended (clone directly into Claude Code skills directory):
```bash
mkdir -p ~/.claude/skills
git clone https://github.com/blader/humanizer.git ~/.claude/skills/humanizer
```

Manual install/update (only the skill file):
```bash
mkdir -p ~/.claude/skills/humanizer
cp SKILL.md SKILL-EN.md SKILL-DE.md ~/.claude/skills/humanizer/
```

## How to "run" it (Claude Code)

Invoke the skills:
- `/humanizer` - Universal with auto language detection (most common)
- `/humanizer-en` - English patterns only
- `/humanizer-de` - German patterns only

## Making changes safely

### Versioning (keep in sync)
- `SKILL.md` has a `version:` field in its YAML frontmatter (main version)
- `SKILL-EN.md` and `SKILL-DE.md` have their own version fields
- `README.md` has a "Version History" section

When making changes:
- **Universal changes** (affecting both languages): Bump `SKILL.md` version
- **Language-specific changes**: Bump the specific `SKILL-*.md` version
- **Always update** `README.md` version history

### Editing skill files

**For `SKILL.md` (universal):**
- Contains BOTH English and German patterns
- Has language detection instructions at the top
- Patterns are prefixed: `EN-1`, `EN-2`... and `DE-1`, `DE-2`...
- Changes here should usually be mirrored to the language-specific files

**For `SKILL-EN.md` and `SKILL-DE.md`:**
- Single-language patterns only
- Numbered 1-24 without prefix
- Preserve valid YAML frontmatter formatting

### Pattern numbering
- Keep numbering stable across files
- English patterns 1-24 map roughly to German patterns 1-24
- Some patterns don't translate (e.g., EN-8 "Copula avoidance" is English-specific)
- Some patterns are unique to German (e.g., DE-19 "Prompt rejection")

### Adding a new language

To add support for another language (e.g., French):

1. Create `SKILL-FR.md` with language-specific patterns
2. Add French patterns section to `SKILL.md` with `FR-*` prefixes
3. Update language detection in `SKILL.md`
4. Update `README.md` with French pattern table
5. Update this file (`WARP.md`) with new file

### Documenting non-obvious fixes
If you change the prompt to handle a tricky failure mode (e.g., a repeated mis-edit or an unexpected tone shift), add a short note to `README.md`'s version history describing what was fixed and why.

## Pattern sources

- **English**: [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- **German**: [Wikipedia:Anzeichen für KI-generierte Inhalte](https://de.wikipedia.org/wiki/Wikipedia:Anzeichen_f%C3%BCr_KI-generierte_Inhalte)

Both are maintained by WikiProject AI Cleanup.

## Language-specific considerations

### German patterns that differ from English
- No "Copula avoidance" (German uses "sein" differently)
- No "Title Case" pattern (German capitalizes all nouns)
- No "Curly quotes" pattern (German uses „..." quotes)
- Added "Prompt rejection" pattern (KI-Selbstreferenzen)
- Added "Abrupt cutoffs" pattern
- Added "Editorial comments" pattern
- "Fazit sections" are culturally specific to German

### Patterns that translate directly
Most content, language, style, and communication patterns translate between English and German with appropriate keyword/example localization.
