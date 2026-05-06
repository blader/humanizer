# Harness Routing — Gemini CLI

`SKILL.md` routes here when running inside Gemini CLI. Gemini exposes a
structured-question tool (referenced as `ask_user` in the superpowers
tool mapping) that accepts a `questions` array with `header`, `question`,
`type`, and `options` fields — structurally similar to Claude Code's
`AskUserQuestion`.

## The interview — one tool call

Bundle all four questions in one call:

```json
{
  "questions": [
    {
      "header": "Dialect",
      "question": "Which English variant should the rewrite target?",
      "type": "choice",
      "options": [
        { "label": "American English", "description": "Default for US audiences." },
        { "label": "British English", "description": "Use UK spellings and idioms." },
        { "label": "Other", "description": "I'll specify a variant in my next message." }
      ]
    },
    {
      "header": "Reading level",
      "question": "What reading level should the output target?",
      "type": "choice",
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
      "type": "choice",
      "options": [
        { "label": "Casual" },
        { "label": "Professional" },
        { "label": "Academic" }
      ]
    },
    {
      "header": "Length",
      "question": "Length policy for the rewrite?",
      "type": "choice",
      "options": [
        { "label": "Keep within ±10% of original" },
        { "label": "Allow expansion" },
        { "label": "Allow trimming" }
      ]
    }
  ]
}
```

If the runtime exposes the tool under a different name (e.g.,
`ask_user_question`), swap the tool name. The schema is portable.

## After the interview

Map the labels to internal variables (same as Claude Code):

- Q1 → `dialect`
- Q2 → `target_grade` (4, 7, 10, 14, 17)
- Q3 → `tone`
- Q4 → `length_policy` (`±10`, `exp`, `trim`)

Return to `SKILL.md` § Loop algorithm with these answers.

## Fallback

If the structured-question tool is unavailable, fall through to
`harnesses/generic.md`'s plain-text protocol.
