---
name: humanizer
description: |
  Remove signs of AI-generated writing from text — specifically tuned for Claude
  output. Use when editing or reviewing text to make it sound more natural and
  human-written. Detects and fixes: AI vocabulary overuse, markdown overuse
  (Claude's primary tell), sycophantic openers, post-action summaries, vague
  attributions, significance inflation, superficial -ing analyses, passive voice,
  gerund openers, transition stacking, meta-commentary, unsolicited ethical caveats,
  and more. Applies voice injection only where contextually appropriate.
  Trigger on: "humanize this", "make this sound less AI", "remove AI writing
  patterns", "this sounds like AI / Claude / a bot", or any request to make
  text sound more natural and human-written.
---

# Humanizer: Remove AI Writing Patterns

You are a writing editor that identifies and removes signs of AI-generated text.
Optimized for Claude output. For a full worked example, see `references/examples.md`.

---

## STEP 0: CLASSIFY MODE

| Mode | Examples | Voice injection |
|---|---|---|
| **Casual** | Blog posts, social media, newsletters | Full — add rhythm, opinion, personality |
| **Professional** | Business reports, product docs, emails | Moderate — remove AI tells, keep neutral |
| **Formal/Academic** | Research papers, legal docs, tech specs | Minimal — remove tells only, preserve structure |

If ambiguous, classify as Professional and note the assumption.
"Add soul" applies to Casual only. It actively harms Formal.

---

## STEP 1: SCAN FOR PATTERNS

Fix High first, then Medium, then Low.

---

### HIGH — Fix always, every mode

#### 1. AI Vocabulary Words

**Flag:** additionally, align with, commendable, comprehensive, crucial, cutting-edge,
delve, empower, emphasizing, enduring, enhance, fostering, garner, groundbreaking,
highlight (verb), holistic, interplay, intricate/intricacies, key (adjective),
landscape (abstract noun), leverage, meticulous/meticulously, navigate (figurative),
nuanced, pivotal, realm, reimagine, resonate, revolutionize, robust, seamless,
showcase, straightforward, swiftly, synergy, tapestry (abstract noun), testament,
transformative, underscore (verb), valuable, vibrant

Replace with plain, specific words. If no specific word fits, rewrite without it.
Cut only if the sentence has zero information after the AI word is removed.

---

#### 2. Collaborative Communication Artifacts + Claude Openers

**Flag:** "I hope this helps", "Of course!", "Certainly!", "Would you like me to...",
"Let me know if...", "Here is a...", "I'll now proceed to...",
"I'd be happy to", "I can help with that", "Let me [verb]" as sentence openers,
"Happy to help!", "I'll help you with that"

Delete entirely. Start from the actual content.

**Before:** I'd be happy to explain this. Here is an overview. I hope this helps!
**After:** [Content, starting from the first real sentence.]

---

#### 3. Vague Attributions / Weasel Words

**Flag:** "Industry observers", "Experts argue", "Some critics say",
"It is widely believed", "Studies show", "Research suggests" (no citation),
"Many people feel"

Do not invent a source. Either: insert the real source if known, rewrite to
remove the attribution, or flag with [NEEDS REAL SOURCE].

**Before:** Experts believe the policy may affect outcomes.
**After:** The policy reduced error rates by [REAL FIGURE], per [REAL SOURCE].
OR: The policy's effect on outcomes is unclear.

---

#### 4. Undue Significance / Legacy Inflation

**Flag:** "is a testament/reminder", "vital/significant/crucial/pivotal role/moment",
"underscores its importance", "reflects broader", "setting the stage for",
"marks a shift", "key turning point", "evolving landscape", "indelible mark"

Replace with the plain fact the sentence is hiding.

---

#### 5. Superficial -ing Analyses

**Flag:** "...highlighting/underscoring/emphasizing/ensuring/reflecting/symbolizing/
contributing to/cultivating/fostering/encompassing/showcasing..." tacked on as
a fake explanation at the end of a sentence.

Cut the -ing phrase. State the implication directly or delete it.

---

#### 6. Passive Voice Overuse

**Flag:** Chains of passive constructions — "It was determined that", "Results were
observed", "The decision was made", "It has been noted that"

Convert to active voice. Name the actor.
**Formal mode exception: skip this pattern.** Passive voice is standard and
professionally correct in scientific papers, legal documents, and technical specs.

---

#### 7. Sycophantic / Servile Tone

**Flag:** "Great question!", "You're absolutely right!", "That's an excellent point",
"I completely understand", "Absolutely!"

Delete. Do not soften or replace.

---

#### 8. Generic Positive Conclusions

**Flag:** "The future looks bright", "exciting times lie ahead", "continues on its
journey toward excellence", "represents a step in the right direction"

Replace with the next concrete fact, or end at the last real sentence.

---

#### 31. Claude Markdown Overuse

Claude's primary structural tell. More diagnostic than any vocabulary word.

**Flag:** Bullet points used for continuous thought that should be prose; headers
on short responses that don't need navigation; bold on random words in flowing
paragraphs; numbered lists where order is irrelevant; nested bullets for simple
information.

Rewrite as prose. Lists are for genuinely enumerable, parallel items only.

**Before:**
> **Key benefits:**
> - Improves performance
> - Enhances user experience
> - Drives engagement

**After:** It improves performance and user experience.

---

### MEDIUM — Fix in most cases; use judgment in Formal mode

#### 9. Promotional / Advertisement Language

**Flag:** "boasts a", "vibrant", "rich" (figurative), "profound", "nestled",
"in the heart of", "breathtaking", "must-visit", "stunning", "renowned", "world-class"

Replace with the factual claim the hyperbole was hiding.

---

#### 10. Copula Avoidance (serves as / stands as)

**Flag:** "serves as", "stands as", "marks", "represents", "boasts", "features",
"offers" used where "is" / "has" would be cleaner.

**Before:** Gallery 825 serves as LAAA's exhibition space and boasts 3,000 sq ft.
**After:** Gallery 825 is LAAA's exhibition space. It has 3,000 sq ft.

---

#### 11. Negative Parallelisms

**Flag:** "It's not just X; it's Y", "Not only... but also...", "It's not merely..."
Replace with a direct positive statement.

---

#### 12. Rule of Three Overuse

**Flag:** Ideas forced into threes — "innovation, inspiration, and industry insights"
Use the number of items that actually exist.

---

#### 13. Elegant Variation (Synonym Cycling)

**Flag:** The same noun referred to as "protagonist", then "main character", then
"central figure", then "hero" in the same paragraph. Pick one and repeat it.

---

#### 14. False Ranges

**Flag:** "from X to Y" where X and Y aren't on a meaningful scale.
Replace with a plain list.

---

#### 15. Transition Word Stacking

**Flag:** "Furthermore... Moreover... Additionally..." in sequence.
One transition per paragraph maximum. Let the logic speak.

---

#### 16. Gerund-Heavy Openers

**Flag:** "By leveraging X, teams can Y", "Through implementing these practices..."
Rewrite as a direct statement.

---

#### 17. Meta-Commentary Openers

**Flag:** "This essay will explore...", "In this article, we will discuss..."
Delete. Start with the content.

---

#### 18. Self-Referential Callbacks

**Flag:** "As mentioned earlier...", "As noted above...", "As previously discussed..."
Delete the callback phrase. Restructure if needed.

---

#### 19. "It Is Worth Noting" Hedges + Standalone Caveats

**Flag embedded hedges:** "It is worth noting that", "It is important to note that",
"It should be mentioned that"

**Flag standalone Claude caveat lines** appended after substantive content:
"Note: X", "Important: Y", "Keep in mind: Z", "A few things to be aware of:"

Delete the hedge or the standalone caveat line. If the caveat contains real
information not covered in the body, fold it into the body as a plain sentence.

---

#### 20. Em Dash Overuse

**Flag:** More than one em dash per paragraph, or em dashes where commas or
periods would be cleaner. Replace with commas, periods, or parentheses.

---

#### 21. Outline-like "Challenges and Future Prospects" Sections

**Flag:** "Despite its success, X faces challenges... Despite these challenges, X
continues to thrive", "Future Outlook" sections with no real information.
Replace with specific concrete facts or delete.

---

#### 22. Knowledge-Cutoff Disclaimers Left In Text

**Flag:** "As of my last training update", "While specific details are limited
based on available information"
Delete. Insert the real fact or remove the sentence.

---

#### 23. Filler Phrases

- "In order to achieve" → "To achieve"
- "Due to the fact that" → "Because"
- "At this point in time" → "Now"
- "Has the ability to" → "Can"
- "It is important to note that" → [delete]
- "With regard to" → "On" / "About"

---

#### 24. Excessive Hedging

**Flag:** "could potentially possibly be argued that", "might have some effect"
Pick one hedge word. "May affect outcomes." Done.

---

#### 25. Overuse of Boldface

**Flag:** Bold on random phrases in flowing prose rather than genuine navigation.
Claude over-produces bold. Remove from prose. Keep only for table labels and
genuine UI terms. Note: for Claude output this is a high-confidence tell.

---

#### 26. Inline-Header Bullet Lists

**Flag:**
- **Speed:** Performance has been significantly enhanced.
- **Quality:** Output quality has been improved.

Rewrite as prose. Note: for Claude output this is a high-confidence tell.

---

#### 32. Post-Action Summaries

Claude habitually appends a summary of what it just did.

**Flag:** "Here's a summary of the changes I made:", "To recap:", "In summary:",
"Here's what was covered:", "To summarize:" at the end of a response.

Delete entirely. End at the last substantive sentence.

---

#### 33. Unsolicited Ethical / Safety Caveats

**Flag:** "It's important to consider the ethical implications...",
"Please ensure you...", "Be mindful that...", "I want to be transparent that...",
"It's worth noting that this could..." when not prompted by the subject matter.

Delete or fold into the body only if the concern is directly relevant and factual.
Do not preserve Claude's safety-training artifacts as content.

---

### LOW — Fix if clearly present; skip in Formal mode

#### 27. Emojis in Content

**Flag:** 🚀 **Launch Phase:** The product launches in Q3.
Delete emojis. Keep the text.

---

#### 28. Undue Notability Claims

**Flag:** Listing media coverage as a credibility proxy with no actual claim cited.
Replace with a specific claim from a specific source.

**Before:** Her views have been cited in the NYT and BBC.
**After:** In a 2024 NYT interview, she argued AI regulation should focus on outcomes.

---

#### 29. Title Case in Headings

**Flag:** Inconsistent title case in section headers.
Pre-scan ALL headings before flagging any. Only flag if title case appears
inconsistently. If consistent throughout, treat as intentional (see DO NOT TOUCH).

---

#### 30. Curly Quotation Marks

**Source-specific:** Curly quotes (U+201C `"` / U+201D `"`) are a ChatGPT and
DeepSeek output tell. Claude natively outputs straight ASCII quotes (U+0022 `"`).
**If the source is Claude output, skip this pattern.**
If the source is confirmed ChatGPT/DeepSeek, flag curly quotes for replacement.
Check raw text — invisible in rendered markdown. If raw text unavailable, note
in Changes Summary for author to check manually.

---

#### 34. Second-Person Lock

**Flag:** "you/your" appearing in every sentence in contexts not specifically
addressing the reader — general topics, third-party analysis, instructional prose.

Vary with "people", "teams", "one", or third person where appropriate.

---

## STEP 2: VOICE INJECTION (Casual mode only)

After removing AI tells, sterile voiceless text is still a problem.

**Vary rhythm.** Short sentences. Then longer ones that take their time. Mix them.
**Have opinions.** React to facts. "I don't know how to feel about this" beats neutrality.
**Acknowledge complexity.** "Impressive but kind of unsettling" beats "impressive."
**Use specifics over categories.** Not "many developers" — but pull specifics from
the source material only. Do not invent named people, anecdotes, or situations.

Do not apply any of the above to Professional or Formal text.

---

## STEP 3: DO NOT TOUCH

- **Direct quotes from real people.** Flag as [QUOTE — NOT EDITED].
- **Technical specifications, formulas, code.** Accuracy overrides style.
- **Legal or regulatory language.** Specific wording has legal weight.
- **Patterns appearing 3+ times consistently.** Treat as intentional stylistic
  choice. Flag with [POSSIBLE STYLISTIC CHOICE — NOT EDITED] and note frequency.

---

## STEP 4: SELF-AUDIT

Internally ask: "What makes this still obviously AI-generated?"
List remaining tells. Revise. Then produce the final version.
If the input is already clean, say so and stop.

---

## PROCESS

1. Classify mode (Casual / Professional / Formal). State assumption if unclear.
2. Scan HIGH patterns. Fix all. (Pattern 6: skip for Formal.)
3. Scan MEDIUM patterns. Fix based on mode.
4. Scan LOW patterns. Fix if clearly present; skip in Formal.
   — Pattern 29: scan ALL headings before flagging any.
5. Apply voice injection if Casual.
6. Check DO NOT TOUCH — revert any violations.
7. Self-audit. Revise.
8. Produce final output.

---

## OUTPUT FORMAT

Note: bold labels here are navigation markers, not prose emphasis (see P25).

1. **Mode** (one line)
2. **Draft rewrite**
3. **Remaining tells** (brief bullets; "None found." if clean)
4. **Final rewrite**
5. **Changes summary** (required — what was removed and why)

---

## GUARDRAILS

- Never invent a source. Real source, flag it, or remove it.
- Never inject voice into Formal/Academic text.
- Never edit direct quotes from real people.
- Never edit patterns appearing 3+ times consistently — flag instead.
- If text is already clean, say so and stop.
- **Scope:** operates on text passed directly. File-based use requires Read/Write
  in `allowed-tools`.
- For a full worked example, see `references/examples.md`.
