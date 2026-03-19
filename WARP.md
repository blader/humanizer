# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## What this repo is
This repository is a **Node.js CLI tool** that bundles humanizer prompts with user input text and outputs to stdout. It does not call any API — pipe the output to any LLM.

## Key files
- `package.json` — ESM package, `humanizer` bin entry, zero runtime dependencies
- `bin/humanizer.js` — Shebang entry point
- `src/cli.js` — Arg parsing (node:util parseArgs), input resolution, output formatting
- `src/prompt.js` — System prompt extracted from SKILL.md
- `SKILL.md` — Source material: the original humanizer skill definition (24 AI writing patterns)
- `README.md` — Installation, usage, and pipe examples

## Common commands
### Install globally
```bash
npm install -g humanizer-cli
```

### Run locally during development
```bash
node bin/humanizer.js --help
node bin/humanizer.js essay.txt
echo "test" | node bin/humanizer.js
node bin/humanizer.js --prompt-only
```

### Test all flags
```bash
node bin/humanizer.js --help      # shows usage
node bin/humanizer.js --version   # shows version from package.json
node bin/humanizer.js --prompt-only  # outputs system prompt only
echo "test input" | node bin/humanizer.js  # outputs bundled prompt
```

## Making changes safely
### Versioning
Version is in `package.json` only. Bump it there.

### Editing the prompt
The system prompt lives in `src/prompt.js`. If you update it, keep `SKILL.md` as the reference for pattern definitions, but note that `src/prompt.js` is the runtime source of truth for the CLI.
