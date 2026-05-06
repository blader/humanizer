# Harness Routing — Generic (plain-text questions)

`SKILL.md` routes here when the host harness is unrecognized OR when a
recognized harness's question tool is unavailable. Use plain-text
questions and parse the user's reply manually.

## When this file applies

- Any harness not listed in `harnesses/` (AiderDesk, future wrappers, etc.)
- A recognized harness where the question tool fails or returns an error
- A user override: invoking `/agentic-humanizer plain-text [paste]`

## The interview

Send the user this exact message:

```text
Before I run the agentic humanization loop, I need 4 quick answers.
Reply with the four tokens in order, on one line, e.g. "1 3 b ±10".

1) Which English variant?
   1. American English
   2. British English
   3. Other (specify after your answer)

2) What reading level should the output target?
   1. Elementary (Grade 3–5)
   2. Middle school (Grade 6–8)
   3. High school (Grade 9–12)
   4. College (Grade 13–15)
   5. Graduate or professional (Grade 16+)

3) What tone?
   a. Casual
   b. Professional
   c. Academic

4) Length policy?
   ±10  — Keep within ±10% of original
   exp  — Allow expansion
   trim — Allow trimming
```

Wait for the user's reply. Parse strictly:

- Q1: integer 1–3. If `3`, prompt once more for the dialect string.
- Q2: integer 1–5. Map to grade midpoint (4, 7, 10, 14, 17).
- Q3: letter a/b/c.
- Q4: token `±10` / `exp` / `trim`.

If the reply does not parse, send: *"I couldn't parse that. Please reply
with four tokens, e.g. `1 3 b ±10`."* and wait again. Maximum 2 reparse
attempts; on the third bad reply, fall back to defaults
(American · High school · Professional · ±10%) and proceed.

## After the interview

Capture the four answers as variables:

- `dialect` ∈ {`us`, `uk`, `other:<string>`}
- `target_grade` ∈ {4, 7, 10, 14, 17}
- `tone` ∈ {`casual`, `professional`, `academic`}
- `length_policy` ∈ {`±10`, `exp`, `trim`}

Return to `SKILL.md` § Loop algorithm with these answers.
