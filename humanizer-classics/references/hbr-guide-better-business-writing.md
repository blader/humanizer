# HBR Guide to Better Business Writing — Bryan A. Garner

**Source:** Bryan A. Garner, *HBR Guide to Better Business Writing* (Harvard Business Review Press, 2012)
**Type:** Craft prescription (positive guidance — what good business writing *does*)
**License of pull-quotes:** Fair use — short excerpts for educational commentary
**Rule prefix:** `H`

## Why this book belongs in humanizer-classics

Zinsser writes for journalists and essayists; Strunk writes for everyone; Garner writes for the person trying to get something done in an email, memo, or report. His guide is built around the reader who's busy and skimming. The rules below catch the failure modes that LLMs reproduce in business contexts: burying the point, padding with throat-clearing, writing as if the reader will start at the top and read straight through. These rules apply to memos, status updates, briefs, executive summaries, and most internal email — contexts where Zinsser's "have a self" can be the wrong move.

## Rules in this file

| ID | Rule (one line) | Reference |
|----|-----------------|-----------|
| H-1 | Lead with the bottom line (pyramid principle) | Pt. 2 — Step 2 (purpose first) |
| H-2 | Write for the skim-reader | Pt. 4 — formatting for busy readers |
| H-3 | One idea per paragraph | Pt. 3 — paragraph discipline |
| H-4 | Use the imperative for instructions | Pt. 4 — directness |
| H-5 | Cut throat-clearing openers | Pt. 4 — efficiency |

---

### H-1. Lead with the bottom line (pyramid principle)

**Source:** Garner, *HBR Guide to Better Business Writing*, Pt. 2 — purpose-first writing

> "State your purpose up front. Don't make readers hunt for what you want."
> — Garner, paraphrased from Pt. 2

**Cross-references:** W-25 (generic positive conclusions), Z-6 (endings matter), W-6 (challenges/future-prospects)
**Context tags:** memo, email, technical-doc (status updates, briefs), meeting-notes (when summarizing)
**Detection cue:** First paragraph is context-setting ("As you know, the team has been working on..."). The actual recommendation, decision, or ask appears in paragraph 3 or later. Subject lines or first sentences that describe a topic ("Update on the Q3 roadmap") rather than the news ("Q3 launch slips two weeks; here's the new plan").

**Problem:** LLMs are trained on prose where build-up precedes payoff — narrative writing, articles, school essays. In business writing the reader is scanning to extract a decision or action. If the bottom line is buried, the reader misses it or reads tired and mis-prioritizes. Garner's rule, sometimes called the pyramid principle (Barbara Minto) or BLUF ("bottom line up front"), is to invert the order: conclusion first, then the supporting evidence in descending importance.

**Before**
> As you know, the team has been working hard over the past quarter to evaluate our customer-onboarding flow. We conducted user interviews, analyzed support tickets, and ran several A/B tests. The data has been thoroughly reviewed by the design and engineering teams. Based on this work, we believe there are several improvements we should make. Specifically, we recommend redesigning the signup form, simplifying the email verification step, and adding a guided tour for first-time users. We expect this work to take approximately six weeks and require two engineers and one designer.

**After**
> **We're recommending three onboarding changes that need 6 weeks, two engineers, and one designer.**
>
> The changes: redesign the signup form, simplify email verification, add a first-time-user tour.
>
> The evidence: 12 user interviews, 6 weeks of support-ticket analysis, two A/B tests on the signup form. Details below.

**How to apply:** Read your draft and find the sentence that contains the news (the recommendation, decision, request, or ask). Move that sentence to be the first sentence (or even the subject line). Then arrange the supporting evidence in descending importance. If the reader stops after one paragraph, they should already have the point.


### H-2. Write for the skim-reader

**Source:** Garner, *HBR Guide to Better Business Writing*, Pt. 4 — formatting for busy readers

> "Most business readers don't read — they scan."
> — Garner, paraphrased from Pt. 4

**Cross-references:** W-15 (boldface overuse), W-16 (inline-header lists), W-17 (title case), W-18 (emojis)
**Context tags:** memo, email, technical-doc, meeting-notes
**Detection cue:** Long paragraphs (8+ sentences) with no subheads, no bullets, no bolding. OR the opposite: a wall of bullets where every line is a full sentence and bolding is on every third word for no reason.

**Problem:** This rule sounds like it conflicts with W-15 / W-16 / W-18 (the rules against boldface, inline-header lists, and emoji decoration), and the conflict is the point. LLM business writing fails in two opposite directions: the wall of unbroken prose (no anchors for the eye) *and* the carpet of bolded bullets and emoji headings (every line shouting "look at me"). H-2 says: real skim-formatting uses subheads as the spine, bullets only for true parallel lists, and bolding only for the one phrase per section that the skimmer absolutely must catch.

**Before (wall of prose)**
> The Q3 results came in below target. Revenue was 8% under plan because the enterprise team missed its forecast for two large deals that slipped to Q4. The good news is that the SMB team beat their plan by 14%, driven mostly by the new onboarding flow that launched in July. Operating costs were on plan but we ran hot on cloud spend after the data-warehouse migration. Hiring stayed under target since we paused recruiting for the platform team. We expect Q4 to recover assuming the slipped enterprise deals close.

**Before (carpet of bolded bullets)**
> 🚀 **Q3 Results Overview:**
> - **Revenue:** 8% under plan ❌
> - **Enterprise Sales:** Missed forecast 📉
> - **SMB Sales:** Beat plan by 14% ✅
> - **Operating Costs:** On plan ✓
> - **Cloud Spend:** Ran hot 🔥
> - **Hiring:** Under target

**After**
> **Q3 was 8% under plan. We expect Q4 to recover.**
>
> What missed: two large enterprise deals slipped to Q4.
>
> What beat: SMB revenue up 14%, driven by the July onboarding launch.
>
> What to watch: cloud spend ran hot after the data-warehouse migration. We're reviewing the architecture in October.

**How to apply:** For documents over a page, add subheads at every section break. Bold the one phrase per section that captures the news. Use bullets only when you have a true parallel list (3+ items of the same type). Never use emoji as section markers in business writing — they signal informality the form usually can't carry. The test: if a reader reads only the bolded text and the subheads, do they get the gist?


### H-3. One idea per paragraph

**Source:** Garner, *HBR Guide to Better Business Writing*, Pt. 3 — paragraph discipline

> "A paragraph should advance a single idea. When the idea changes, start a new paragraph."
> — Garner, paraphrased from Pt. 3

**Cross-references:** Z-1 (cut clutter), W-29 (fragmented headers — but H-3 is the inverse problem)
**Context tags:** memo, email, technical-doc, blog, meeting-notes
**Detection cue:** Paragraphs that start on one topic and drift through three more by the end. Paragraphs over ~5 sentences in business writing. Paragraphs where the topic sentence and the closing sentence are about different things.

**Problem:** LLMs string related sentences together without paragraph discipline. The result reads like one long flow where the reader has to do the work of separating the points. Garner's rule: each paragraph carries one idea. When the idea moves, the paragraph ends.

**Before**
> The launch went well overall. We hit our user-signup target by Day 3 and the support team only saw a small uptick in tickets, mostly about the email verification flow which we expected based on the staging tests. Marketing was happy with the conversion numbers from the launch campaign and the social media engagement was higher than the previous launch. There were a few bugs reported by power users related to the new dashboard widget but we patched the most serious one within 24 hours. Looking ahead, we should consider running another A/B test on the signup form because the current one converts at 12% which is below the 15% we set as target.

**After**
> The launch hit its Day 3 signup target. Support tickets ticked up only slightly — mostly the email verification step we'd expected to be a friction point.
>
> Marketing was happy: conversion from the launch campaign and social engagement both beat our previous launch.
>
> Power users reported bugs in the new dashboard widget. We patched the most serious within 24 hours.
>
> Next: A/B test the signup form again. Current conversion is 12%; our target was 15%.

**How to apply:** Read each paragraph and write a one-line summary of what it's about. If you can't, the paragraph holds two or more ideas. Split. The visual breaks help the skim-reader (see H-2) as well.


### H-4. Use the imperative for instructions

**Source:** Garner, *HBR Guide to Better Business Writing*, Pt. 4 — directness in operational writing

> "The imperative mood is the natural tongue of instructions. Use it."
> — Garner, paraphrased from Pt. 4

**Cross-references:** S-2 (active voice), Z-3 (active verbs), W-13 (passive voice)
**Context tags:** technical-doc (especially how-to / runbook content), memo (action items), meeting-notes (action items)
**Detection cue:** Instruction-shaped sentences in third person or passive voice: "The user should click Save", "The form is to be submitted", "It is recommended that the operator restart the service". "One should consider" / "Users may want to".

**Problem:** Instructions in third person or passive voice add a layer of indirection between the reader and the action. The reader has to translate "the user should click Save" into "click Save". LLMs default to the indirect form because it sounds professional. Garner's rule: instructions are commands. Write them as commands.

**Before**
> When the deployment fails, it is recommended that the operator first review the build logs. The next step would be for the operator to restart the affected service. If the issue persists, the on-call engineer should be paged by the operator.

**After**
> If the deployment fails:
> 1. Review the build logs.
> 2. Restart the affected service.
> 3. If the issue persists, page the on-call engineer.

**How to apply:** Find every "the user should", "it is recommended", "one might consider", "the operator must" construction. Rewrite each as a direct command starting with the verb. The reader's eye moves from instruction to action without the intermediate step.


### H-5. Cut throat-clearing openers

**Source:** Garner, *HBR Guide to Better Business Writing*, Pt. 4 — efficiency

> "Don't begin by clearing your throat. Begin with what you have to say."
> — Garner, paraphrased from Pt. 4

**Cross-references:** W-20 (collaborative communication artifacts), W-22 (sycophantic tone), W-28 (signposting), Z-1 (cut clutter)
**Context tags:** email, memo, meeting-notes
**Detection cue:** Opening phrases: "I hope this email finds you well", "I hope you're having a great week", "I just wanted to reach out", "Just following up on my last email", "As you know", "Per our discussion", "I wanted to take a moment to", "Thank you in advance for your time and consideration".

**Problem:** Throat-clearing is the verbal equivalent of small talk before getting to the point. In speech it's polite. In writing — especially email — it costs the reader time and pushes the actual message below the fold. LLMs generate it because they're trained on emails that contain it, and they default to the polite-professional register where it's expected. Garner's rule for business writing: skip it. Open with the news.

**Before**
> Hi Sarah,
>
> I hope this email finds you well and that you're having a great week. I just wanted to reach out and follow up on our conversation from last Thursday's meeting. As you know, we've been thinking about the Q4 marketing budget and I wanted to take a moment to share some thoughts on how we might approach the planning process.
>
> Specifically, I think we should consider...

**After**
> Hi Sarah,
>
> Following up on Thursday: I think we should cut the Q4 paid-search budget by 30% and put it into the partner program. Three reasons:
>
> 1. ...

**How to apply:** Delete the first paragraph if it doesn't say anything specific about the actual subject. Read the second paragraph — if that's where the message starts, you're done. The exception: a brief signal of warmth ("Thanks for jumping on the call yesterday") is fine when there's a real reason to thank — what's not fine is generic throat-clearing.
