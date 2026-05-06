# Harness Routing — Cursor

`SKILL.md` routes here when running inside Cursor 2.4 or later. Cursor
exposes `AskQuestion` for multiple-choice prompts in agent sessions.

## The interview — four sequential AskQuestion calls

Cursor's AskQuestion (as of 2.4) takes one question per call. Issue the
four below in sequence; do not bundle.

```text
AskQuestion({
  title: "Dialect",
  message: "Which English variant should the rewrite target?",
  options: ["American English", "British English", "Other"]
})

AskQuestion({
  title: "Reading level",
  message: "What reading level should the output target?",
  options: [
    "Elementary (Grade 3–5)",
    "Middle school (Grade 6–8)",
    "High school (Grade 9–12)",
    "College (Grade 13–15)",
    "Graduate or professional (Grade 16+)"
  ]
})

AskQuestion({
  title: "Tone",
  message: "What tone should the output use?",
  options: ["Casual", "Professional", "Academic"]
})

AskQuestion({
  title: "Length",
  message: "Length policy for the rewrite?",
  options: [
    "Keep within ±10% of original",
    "Allow expansion",
    "Allow trimming"
  ]
})
```

## After the interview

Map the chosen labels to internal variables (same as Claude Code):

- Q1 → `dialect`: `American English` → `us`, `British English` → `uk`,
  `Other` → prompt for the dialect string in the next user turn.
- Q2 → `target_grade`: 4, 7, 10, 14, 17 in order.
- Q3 → `tone`: lowercase the label.
- Q4 → `length_policy`: `Keep within ±10% of original` → `±10`,
  `Allow expansion` → `exp`, `Allow trimming` → `trim`.

Return to `SKILL.md` § Loop algorithm with these answers.

## Fallback

If `AskQuestion` is blocked (e.g., the usage-limit overlay covers the
prompt) or returns an error, fall through to `harnesses/generic.md`'s
plain-text protocol.
