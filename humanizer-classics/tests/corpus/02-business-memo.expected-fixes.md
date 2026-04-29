# Expected fixes for 02-business-memo.md

**Context tag:** memo (the form is a company-wide email memo)

## Detection rules that should fire

- W-13 — passive voice / subjectless ("efforts have not gone unnoticed", "additional A/B tests will be running")
- W-20 — chatbot/email artifacts ("I hope this email finds you well", "Please let me know if you have any questions")
- W-22 — sycophantic tone ("hard work and dedication", "your efforts have not gone unnoticed", "Thanks again for everything you do")
- W-23 — filler ("a number of factors", "I wanted to take a moment to share some thoughts")
- W-25 — generic conclusion ("Thanks again for everything you do")
- W-28 — signposting ("Looking back at Q3", "Looking forward")

## Craft rules that should be applied for the fix

- **H-1 (lead with the bottom line) — DOMINANT FIX.** The actual news ("revenue came in 8% under plan") is in paragraph 4. Move it to the top, ideally as the opening sentence or even the subject line.
- **H-2 (write for the skim-reader).** No subheads, no bullets, no bolding for the key numbers. The memo is a wall of prose. The fix: subheads ("What missed", "What beat", "What's next"), bold the numbers (8%, 14%), bullets where the items are parallel (the four bullets of news in paragraph 4 are all parallel — they should be a list).
- **H-3 (one idea per paragraph).** Paragraph 2 covers "mixed results", "team working diligently", "factors", and "execution" — four ideas in one paragraph. Split.
- **H-5 (cut throat-clearing openers).** The first 1.5 paragraphs are throat-clearing. Cut to the news.
- Z-1 (cut clutter) — secondary; H-5 cuts most of the clutter by removing the throat-clearing
- S-2 (active voice) — clean up the passive constructions
- Z-5 (be present on the page) — **does NOT fire on memo context.** Sarah signing off as "Sarah" is enough; the memo doesn't need first-person "I think" framing on every claim.

## Notes for reviewers

- This is the canonical H-1 sample. If H-1 doesn't fire as the dominant fix here, the rule is wrong.
- The rewrite should be much shorter. A good rewrite: subject line "Q3 8% under plan; Q4 will recover if Acme/Globex close" + 4-6 short paragraphs/bullets covering the news, the misses, the beats, and what's next.
- Don't strip the human warmth entirely — a brief acknowledgment of the team is fine. Strip the *generic* warmth (the throat-clearing version) and keep specific thanks if any.
