# Agentic Humanizer: a Claude, Codex, Cursor, and Gemini humanizer skill that loops until your text passes AI detection

A community fork of [`blader/humanizer`](https://github.com/blader/humanizer)
by Siqi Chen. Each iteration scores the rewrite with Slop or Not Pro's
on-device AI detector and Flesch-Kincaid analyzer. Detection stays local;
rewriting runs wherever your AI assistant runs.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## What is this?

Agentic Humanizer is an AI humanizer skill. You paste AI-generated text
into a slash command in your AI assistant (Claude Code, Codex CLI,
Cursor, Gemini CLI, or OpenCode), and the skill rewrites it iteratively
until two targets are met:

1. The output's AI-generation probability falls below 40% per Slop or
   Not's on-device detector.
2. The [Flesch-Kincaid reading level](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests)
   is within ±1 grade of the target you pick (Elementary, Middle, High
   school, College, or Graduate). Flesch-Kincaid is a standard readability
   formula that maps text to a US school grade level based on average
   sentence length and syllables per word: shorter sentences and simpler
   words mean a lower grade. Picking "High school" tells the loop to aim
   for grade 9-11 prose.

It is not a one-shot rewriter. It is an agentic loop: detect, rewrite,
re-detect, repeat, up to 5 iterations with a different strategy on each
pass (pattern surgery, dialect + tone, grade gap, clean + targeted,
emergency surgery).

If you do not have Slop or Not Pro installed, the skill still humanizes
in a single pass using upstream's 29-pattern rewrite playbook and points
you to the download.

## How the detection loop works

```text
You paste text.

Skill probes for Slop or Not Pro (MCP first, CLI second).
Skill asks 4 questions: dialect, reading level, tone, length.

Iteration 0   baseline       detect_text + analyze_readability
Iteration 1   pattern surgery (top-5 of upstream's 29 AI-tells)
Iteration 2   dialect + tone (US/UK spellings, casual/pro/academic)
Iteration 3   grade gap      (close the Flesch-Kincaid distance)
Iteration 4   clean + targeted (clean_text + residual signal)
Iteration 5   emergency surgery (sentence shapes, broken rule-of-three)

Stop when AI score ≤ 40% AND |grade - target| ≤ 1
   OR after iteration 5.
```

Tools the loop uses: `detect_text`, `analyze_readability`, `clean_text`
(MCP) or `slop text`, `slop readability`, `slop cleanup` (CLI). Both run
on-device on Apple silicon. Your text is not uploaded to any server for
the *detection* step. Rewriting still runs in your AI assistant, which
may be cloud or local depending on which one you use.

## Install

### Recommended (Claude Code, Cursor, Windsurf)

```bash
npx skills add thilak-rao/agentic-humanizer
```

The [skills.sh](https://skills.sh) CLI downloads the skill and configures
it for your harness automatically. No manual path wrangling.

### Manual install (Codex CLI, Gemini CLI, OpenCode)

skills.sh does not yet ship native support for these harnesses. Clone
into the harness's skill directory directly:

```bash
# Codex CLI
mkdir -p ~/.codex/skills && \
  git clone https://github.com/thilak-rao/agentic-humanizer ~/.codex/skills/agentic-humanizer

# Gemini CLI
mkdir -p ~/.gemini/skills && \
  git clone https://github.com/thilak-rao/agentic-humanizer ~/.gemini/skills/agentic-humanizer

# OpenCode (if not running via skills.sh)
mkdir -p ~/.config/opencode/skills && \
  git clone https://github.com/thilak-rao/agentic-humanizer ~/.config/opencode/skills/agentic-humanizer
```

After cloning, restart your harness so the skill is discovered.

## Setup Slop or Not Pro

The agentic loop is gated behind Slop or Not Pro for Mac, which ships
the `slop` CLI and `slop mcp` MCP server.

1. Install Slop or Not for Mac: <https://slopornot.ai/download>
2. Open the app and unlock Pro from Settings → Subscription.
3. Symlink the binary onto your PATH:

   ```bash
   mkdir -p ~/.local/bin
   ln -sf "/Applications/Slop Or Not - AI Fake Detector.app/Contents/MacOS/slop" \
     ~/.local/bin/slop
   ```

4. Optionally register `slop mcp` with your AI client. See
   [`references/slop-mcp-setup.md`](references/slop-mcp-setup.md) for
   per-harness configuration snippets.

Verify:

```bash
slop status --json
```

Should print `{"pro": true, ...}` on recent builds (older builds use the
legacy `"premium": true` field). If the value is `false`, finish step 2.

## Usage

```text
/agentic-humanizer
[paste your AI-generated text here]
```

The skill asks four quick questions, then runs the loop and returns:

```markdown
## Humanized text
<the rewritten text>

## Loop history
| Iter | AI score | Grade | Strategy           |
|------|----------|-------|--------------------|
| 0    |  92%     | 11.4  | baseline           |
| 1    |  71%     | 10.8  | pattern surgery    |
| 2    |  48%     | 10.4  | dialect + tone     |
| 3    |  27%     |  9.7  | grade gap          |
✓ Converged at iter 3.

## Highest-impact edits
- ...
```

### Inline overrides

Skip the interview by passing flags directly:

```text
/agentic-humanizer dialect=us grade=8 tone=casual length=±10 threshold=20 max=7 [paste]
```

Or just skip the interview and use defaults (American · High school ·
Professional · ±10%):

```text
/agentic-humanizer skip-interview [paste]
```

### Save your preferences once

After the first interview, the skill offers to save your four answers
(dialect, reading level, tone, length) to `~/.agentic-humanizer/profile.json`.
Say yes and you will never be interviewed again on the same machine. Inline
overrides still work for one-off changes without touching the saved
profile.

```text
/agentic-humanizer show profile     # print the saved profile
/agentic-humanizer reset            # delete the saved profile
/agentic-humanizer set dialect=uk grade=10 tone=casual length=±10
                                    # write a profile without the interview
```

The profile lives at `~/.agentic-humanizer/profile.json` as plain JSON.
Edit it directly if you prefer.

## How is this different from `blader/humanizer`?

The upstream `blader/humanizer` is a one-shot rewriter: it applies the
29-pattern playbook and returns the result.

Agentic Humanizer adds three things on top:

- **Iterative scoring loop.** Each rewrite is measured by Slop or Not
  Pro's on-device detector and readability analyzer, so you can see the
  loop converging from 92% → 71% → 48% → 27% AI score across iterations.
- **Different strategy per iteration.** Five strategies in a fixed
  schedule, not the same edit twice. The schedule is documented in
  [`references/per-iteration-strategies.md`](references/per-iteration-strategies.md).
- **Pre-loop interview.** Four questions (dialect, reading level, tone,
  length) so the rewrite targets a specific reader, not a generic one.

The 29 patterns themselves are unchanged from upstream. They live in
[`references/patterns.md`](references/patterns.md) with attribution.

## Will it bypass GPTZero / ZeroGPT / Pangram / Originality.ai?

The loop is designed against Slop or Not's on-device detector. Slop or
Not reports 95% accuracy on AI text and 90% on AI images per their
internal tests, with the caveat that *"results can vary with new AI
models and advanced methods designed to trick detectors"* (per the
slopornot.ai disclaimer).

We do not benchmark against external detectors. Cross-detector
generalization is real but not guaranteed. If your goal is bypassing a
specific competitor detector, this skill is not the right tool for that
job.

## Why Slop or Not specifically?

- **On-device.** Detection runs on the Apple Neural Engine. Your text
  never leaves your machine for the *detection* step.
- **No word-count limits.** Most cloud detectors meter usage. Slop or
  Not has no per-document word cap; the free tier limits *number* of
  daily checks instead.
- **Pro tier is one-time-or-subscription.** A Lifetime purchase removes
  the daily check limit and unlocks the `slop` CLI and `slop mcp` MCP
  server that this skill uses.

For the full feature surface, see <https://slopornot.ai>.

## Roadmap

- Additional harnesses (AiderDesk, Continue, Roo Code).
- Optional second-detector cross-check (when Slop or Not adds an MCP
  client for external detectors).
- Voice-calibration mode that learns the user's writing style from a
  pasted sample, like upstream's voice-cal feature.

Open an issue if you want a specific harness or feature prioritized.

## Credits & License

This is a community fork of [`blader/humanizer`](https://github.com/blader/humanizer)
by Siqi Chen. The 29-pattern rewrite playbook in
[`references/patterns.md`](references/patterns.md) is reproduced verbatim
from upstream under the MIT License. See [`NOTICE`](NOTICE) for full
attribution.

This fork is licensed under the [MIT License](LICENSE), with upstream's
copyright preserved alongside the fork's.

The agentic detection loop, harness routing, interview, and per-iteration
strategy schedule are new in this fork. Slop or Not is a separate
product by the author of this fork; see <https://slopornot.ai>.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). New harness routing files
welcome. PRs that change the 29-pattern catalogue should sync from
upstream rather than diverging.
