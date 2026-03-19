# humanizer-cli

A CLI wrapper for the [blader/humanizer](https://github.com/blader/humanizer) skill. Bundles the humanizer prompt with your text and outputs to stdout — pipe it to any LLM.

No API calls. No dependencies. Just prompt + input → stdout.

## Install

```bash
npm install -g humanizer-cli
```

Requires Node.js 18.3+.

## Usage

```bash
# Pipe a file to Claude
humanizer essay.txt | claude --print

# Pipe stdin, then to llm
cat essay.txt | humanizer | llm

# Read from macOS clipboard
humanizer --clipboard | claude --print

# Just see the bundled prompt (no LLM needed)
humanizer essay.txt

# Output only the system instructions
humanizer --prompt-only
```

## Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--help` | `-h` | Show usage |
| `--version` | `-v` | Show version |
| `--clipboard` | `-c` | Read input from macOS clipboard (pbpaste) |
| `--prompt-only` | `-p` | Output only the system prompt |

Input priority: file argument > `--clipboard` > stdin > show help.

## What it detects

The bundled prompt covers 24 AI writing patterns across four categories:

- **Content** — significance inflation, notability name-dropping, superficial -ing analyses, promotional language, vague attributions, formulaic challenges sections
- **Language** — overused AI vocabulary, copula avoidance, negative parallelisms, rule of three, synonym cycling, false ranges
- **Style** — em dash overuse, boldface overuse, inline-header lists, title case headings, emojis, curly quotes
- **Communication** — chatbot artifacts, knowledge-cutoff disclaimers, sycophantic tone, filler phrases, excessive hedging, generic conclusions

## How it works

The CLI reads your text, prepends the humanizer system prompt, and writes everything to stdout. The output looks like:

```
[humanizer instructions — 24 pattern definitions, rewrite process, output format]

Humanize the following text:

[your input text]
```

## CLI vs skill — when to use which

| | CLI (`humanizer-cli`) | Skill (`blader/humanizer`) |
|---|---|---|
| **Best for** | Automated pipelines, CI/CD, scripts | Interactive editing in Claude Code |
| **Runs on** | Any machine with Node.js | Only where Claude Code skills are installed |
| **How it works** | Bundles prompt + text → stdout, pipe to any LLM | Claude Code loads the skill and rewrites in-place |

Use the **CLI** when you're running in production, on a server, or in any environment that doesn't have access to local Claude Code skills. Use the **skill** when you're working interactively in Claude Code on your own machine.

## References

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- [WikiProject AI Cleanup](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup)

## License

MIT
