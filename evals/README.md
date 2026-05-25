# Humanizer evals

This directory contains Caliper coverage for the `humanizer` skill.

The first eval focuses on Voice Calibration: when a user provides a writing
sample, the sample should become the style target. The skill should still remove
AI-writing tells, but it should not replace the user's voice with a generic
"human" voice.

## Run locally

```bash
caliper validate evals/humanizer-voice-calibration.eval.yaml
caliper run evals/humanizer-voice-calibration.eval.yaml \
  --k 1 \
  --baseline \
  --judge script \
  --output results.json
python evals/assert_voice.py results.json
```

Use a larger `--k` when comparing skill changes. The CI workflow keeps the
default run small so it can act as a regression check.
