# Harness Routing — Claude Code

`SKILL.md` routes here when running inside Claude Code (v2.0.21 or later).
Claude Code exposes the `AskUserQuestion` tool for structured multiple-choice
prompts.

## The interview — one tool call

Issue exactly one `AskUserQuestion` call with all four questions in the
same `questions` array. This is faster for the user (one panel, four
answers) and cleaner for the model context (one tool result instead of four).

```json
{
  "questions": [
    {
      "header": "Dialect",
      "question": "Which English variant should the rewrite target?",
      "multiSelect": false,
      "options": [
        { "label": "American English", "description": "Default for US audiences." },
        { "label": "British English", "description": "Use UK spellings and idioms." },
        { "label": "Other", "description": "I'll specify a variant in my next message." }
      ]
    },
    {
      "header": "Reading level",
      "question": "What reading level should the output target?",
      "multiSelect": false,
      "options": [
        { "label": "Elementary (Grade 3–5)" },
        { "label": "Middle school (Grade 6–8)" },
        { "label": "High school (Grade 9–12)" },
        { "label": "College (Grade 13–15)" },
        { "label": "Graduate or professional (Grade 16+)" }
      ]
    },
    {
      "header": "Tone",
      "question": "What tone should the output use?",
      "multiSelect": false,
      "options": [
        { "label": "Casual" },
        { "label": "Professional" },
        { "label": "Academic" }
      ]
    },
    {
      "header": "Length",
      "question": "Length policy for the rewrite?",
      "multiSelect": false,
      "options": [
        { "label": "Keep within ±10% of original" },
        { "label": "Allow expansion" },
        { "label": "Allow trimming" }
      ]
    }
  ]
}
```

## After the interview

Map the labels to internal variables:

- Q1 → `dialect`: `American English` → `us`, `British English` → `uk`,
  `Other` → prompt for the string in the next user turn.
- Q2 → `target_grade`: 4, 7, 10, 14, 17 in order.
- Q3 → `tone`: lowercase the label.
- Q4 → `length_policy`: `Keep within ±10% of original` → `±10`,
  `Allow expansion` → `exp`, `Allow trimming` → `trim`.

Return to `SKILL.md` § Loop algorithm with these answers.

## Fallback

If `AskUserQuestion` returns an error or is unavailable, fall through to
`harnesses/generic.md`'s plain-text protocol.
