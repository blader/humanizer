# Expected fixes for 03-dictation-transcript.md

**Context tag:** dictation (one big run-on; no caps; needs paragraph breaks; the speaker is the implicit voice sample)

## Detection rules that should fire

- W-23 — filler phrases ("you know", "like", "kind of", "really", "um", "I would say", "basically", "I think")
- W-9 — negative parallelism (mild — "they're useful but they're not transformative" is borderline; this is a stylistic choice the speaker makes, may keep)
- W-13 — passive voice (hardly fires; speech tends to be active)
- W-24 — excessive hedging ("I would say that maybe", "kind of like", "a small percentage")

## Craft rules that should be applied for the fix

- **H-3 (one idea per paragraph) — DOMINANT FIX.** The dictation is one long run-on with no breaks. The editor's job is to find the natural paragraph breaks and add them. New paragraphs at: shift from "what they're good at" to "what they're not good at"; shift to the productivity-claims discussion; shift to the conclusion.
- **Z-1 (cut clutter).** Cut "you know", "kind of", "I would say", "really" where they're pure verbal tics. Keep them where they're load-bearing (genuine hedge or genuine emphasis).
- **Z-3 (active verbs).** Replace "make business decisions based on the assumption that" with simpler verb constructions.
- **Z-4 (strip qualifiers).** "I would say that maybe", "kind of like" — many of these are tic-hedges, not real probability hedges. Cut.
- **Z-5 (be present on the page) — fires.** This is dictation aimed at a blog post; first person is exactly right. The editor should preserve the "I" — don't strip the personal voice trying to make it neutral.
- Punctuation cleanup — capitalize "I", add commas, periods, question marks where the cadence demands.

## Rules that should NOT fire

- **H-1 (lead with the bottom line) — should NOT dominate.** This is becoming a blog post, not a memo. The bottom line ("AI coding tools are useful but not transformative") shows up at the end, which is fine for an essayistic piece. Forcing it to the top would destroy the form.
- **H-2 (write for the skim-reader) — should NOT fire.** Don't add subheads and bullets to a personal essay.
- **H-5 (throat-clearing) — should NOT fire on "so I've been thinking about this".** That's how a person actually starts a thought. It's not corporate throat-clearing; it's a natural conversational opener and it sets the personal voice. The editor *might* trim "so" if it really needs to, but should not strip the entire opening as throat-clearing.
- **S-5 (do not overstate) — barely fires.** The speaker doesn't overstate; they actually understate ("the productivity gains are real but small").

## Notes for reviewers

- **Critical:** the rewrite must preserve the speaker's voice. This is the test of whether the dictation guidance in `granola-meeting-transcripts.md` works. A "humanized" version that sounds like generic blog prose has *failed* — the goal is dictation-to-readable, not dictation-to-blog-template.
- A successful rewrite is recognizably the same person, just with paragraph breaks, fewer filler words, and proper punctuation. Sentences may be lightly tightened; they should not be replaced.
- One reasonable target rewrite: 4 paragraphs, ~200 words, preserving "I think", "I use", "the part that's interesting to me", "I just don't really see it" — these are the speaker's voice.
