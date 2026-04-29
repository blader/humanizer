# Expected fixes for 05-ai-linkedin-post.md

**Context tag:** blog (LinkedIn personal posts behave like short-form blog; first person allowed)

## Detection rules that should fire

- W-1 — significance inflation ("fundamentally changed my perspective", "shaped the leader I am today", "lasting impact")
- W-3 — superficial -ing analyses ("encouraging open dialogue", "creating an environment where innovation could thrive")
- W-4 — promotional language ("transformative", "high-stakes", "bold")
- W-5 — vague attributions ("Industry leaders consistently emphasize")
- W-7 — AI vocabulary ("foster", "thrive", "vibrant", "landscape", "pivotal", "ensuring")
- W-9 — negative parallelism ("It's not just about... it's about", "more than just hitting metrics")
- W-10 — rule of three ("tested my resilience, challenged my assumptions, and ultimately shaped"; "think bigger, act bolder, and deliver"; "the legacy you build, the people you uplift, and the lasting impact"; the entire 1-2-3 listicle structure with rule-of-three inside each item)
- W-14 — em dashes (mild)
- W-15 — boldface overuse (every list-item heading is bolded)
- W-16 — inline-header vertical lists (numbered list with bolded headers)
- W-18 — emoji decoration (🚀, 💡, 🎯, 🤝, 👇)
- W-22 — sycophantic / performative humility ("I had the privilege", "I am today")
- W-25 — generic positive conclusion ("The future is bright. Exciting times lie ahead.")
- W-26 — hyphenated word pair overuse ("high-stakes", "rapidly-evolving")
- W-27 — persuasive authority tropes ("At its core")
- W-28 — chatbot-style call-to-engagement ("Drop your thoughts in the comments below!")

## Craft rules that should be applied for the fix

- **Z-5 (be present on the page) — DOMINANT FIX.** This post is faux-personal. It performs vulnerability without committing to specifics. The fix is real specificity: which launch, what year, what was the failure, what specifically broke, who was involved. Without specifics, it's a TED-talk template.
- **Z-1 (cut clutter).** Most of the post can be cut.
- **Z-2 (plain words).** "Foster trust" → "build trust"; "recalibrate" → "rethink"; "fundamentally changed my perspective" → "changed how I think about" or "made me realize".
- **Z-6 (endings matter, quit when done).** Kill "The future is bright. Exciting times lie ahead." Kill the call-to-engagement at the end (or at least make it specific).
- **S-4 (specific concrete language) — major fix.** Name the launch, name the year, name the lesson with a specific example. "I led a launch in 2023 — a payments product that missed its ship date by four months because I didn't push back when sales committed to dates we couldn't hit" is the human version.
- **S-5 (do not overstate).** "Transformative", "fundamentally", "every challenge is an opportunity" — strip.

## Rules that should NOT fire

- **H-1 (lead with the bottom line) — should NOT dominate.** This is a personal-essay-shaped post, not a memo. The bottom line *can* lead (and arguably should — it would be sharper if "I shipped four months late and learned three things" was the opener), but the structure of "lessons → reflection → ending" is fine for the form. The fix is to make each lesson concrete, not to invert the structure.
- **H-3 (one idea per paragraph) — fires only weakly.** The structure is fine; the content is empty.
- **H-2 (write for the skim-reader) — should fire only to STRIP overuse.** The post over-formats with bolds and emojis. The skim-friendly version uses paragraph breaks and maybe italics for emphasis, not bolded headers and rocket emojis.

## Notes for reviewers

- This is the canonical Z-5 + S-4 sample. The failure mode of this post is *fake specificity* — it talks about "a high-stakes product launch" without saying which one. The successful rewrite makes that concrete.
- Voice calibration is especially important here. If the user provided a sample of their own LinkedIn voice, the rewrite should match it rather than defaulting to a generic-confident-professional register.
- A successful rewrite drops the emoji, drops the call-to-engagement, makes the failure specific, and is roughly half the length. It can still be three numbered lessons — but the lessons should be specific enough that a reader who's never met the writer learns something a generic post couldn't teach them.
