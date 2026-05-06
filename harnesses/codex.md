# Harness Routing — Codex CLI

`SKILL.md` routes here when running inside the OpenAI Codex CLI. Codex
exposes `tool/requestUserInput` (experimental) for structured questions.

**Critical constraint:** the tool accepts only 1–3 questions per call. Our
4-question interview splits into two calls (3 + 1). Other harnesses can
ask all four in one call.

## Call 1 — three questions

```json
{
  "method": "tool/requestUserInput",
  "params": {
    "questions": [
      {
        "question": "Which English variant should the rewrite target? (American English / British English / Other)",
        "type": "text"
      },
      {
        "question": "What reading level should the output target? (Elementary / Middle school / High school / College / Graduate or professional)",
        "type": "text"
      },
      {
        "question": "What tone should the output use? (Casual / Professional / Academic)",
        "type": "text"
      }
    ]
  }
}
```

## Call 2 — one question

```json
{
  "method": "tool/requestUserInput",
  "params": {
    "questions": [
      {
        "question": "Length policy for the rewrite? (Keep within ±10% / Allow expansion / Allow trimming)",
        "type": "text"
      }
    ]
  }
}
```

## After the interview

Parse each text answer to map onto the internal variables:

- Q1 → `dialect`: match `american` → `us`, `british` → `uk`, otherwise
  `other:<verbatim user string>`.
- Q2 → `target_grade`: match `elementary|3|4|5` → 4; `middle|6|7|8` → 7;
  `high|9|10|11|12` → 10; `college|13|14|15` → 14; `graduate|16` → 17.
- Q3 → `tone`: lowercase, match against `casual` / `professional` /
  `academic`.
- Q4 → `length_policy`: match `±10|10%|keep` → `±10`; `expand|exp` →
  `exp`; `trim` → `trim`.

If parsing is ambiguous, ask one follow-up clarification (still via
`tool/requestUserInput`) before defaulting.

Return to `SKILL.md` § Loop algorithm with these answers.

## Fallback

If `tool/requestUserInput` is unavailable in the running Codex version
(pre-rollout), fall through to `harnesses/generic.md`'s plain-text
protocol. If a future Codex version replaces `tool/requestUserInput` with
a stable `ask_user_question`, swap the method name here while keeping the
3-question split intact.
