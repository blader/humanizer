# Expected fixes for 01-marketing-slop.md

**Context tag:** blog (default for unspecified marketing copy)

## Detection rules that should fire

- W-1 — significance/legacy inflation ("stands as a testament", "pivotal moment in the evolution", "represents")
- W-3 — superficial -ing analyses ("ensuring that every feature", "supporting your goals while contributing to")
- W-4 — promotional language ("groundbreaking", "nestled", "stunning", "transformative", "unparalleled", "best-in-class", "seamlessly")
- W-5 — vague attributions ("Industry observers have noted")
- W-6 — outline-like challenges section ("face challenges typical of digital transformation... Despite these challenges")
- W-7 — AI vocabulary ("crucial", "fostering", "showcasing", "emphasizing", "vibrant", "landscape")
- W-8 — copula avoidance ("Atlas's intelligent engine handles" is okay, but "more than just a tool—it's a transformative platform" is the dressed-up "is")
- W-9 — negative parallelism ("not just keep up, but lead", "more than just a tool")
- W-10 — rule of three ("collaborate, communicate, and create"; "siloed information... inefficient processes... misaligned priorities"; "seamless, intuitive, and powerful")
- W-12 — false ranges ("from siloed information to inefficient processes to misaligned priorities")
- W-14 — em dashes ("more than just a tool—it's a transformative platform", "do exactly that—not just keep up, but lead", "exciting times lie ahead—we can't wait")
- W-15 — boldface overuse (every bullet has bolded inline header)
- W-16 — inline-header vertical lists (`**Smart Automation:** ...`)
- W-17 — title case in headings ("What Makes Atlas Special", "Built for the Modern Workplace")
- W-18 — emoji decoration on every heading and bullet
- W-20 — chatbot artifacts ("Let us know if you'd like to learn more!", "We're thrilled to announce")
- W-25 — generic positive conclusion ("future of work is bright", "exciting times lie ahead", "we can't wait to see what you build")
- W-26 — hyphenated word pair overuse ("cross-functional", "data-driven", "best-in-class", "real-time")
- W-27 — persuasive authority tropes ("At its core", "what matters most")

## Craft rules that should be applied for the fix

- Z-1 (cut clutter) — most of this can simply be cut
- Z-2 (plain words) — replace "leverage", "unlock potential", "empower" with plain verbs
- Z-6 (endings matter — quit when done) — kill the closing uplift; end on a fact
- S-4 (specific concrete language) — name an actual feature, an actual customer, an actual number
- S-5 (do not overstate) — the entire piece overstates; this rule is the dominant fix

## Notes for reviewers

- Z-5 (be present on the page) is debatable here — marketing copy from a company often deliberately omits "I". The skill should treat this as `blog` context but recognize it's company-voice, not personal-voice. The fix should make it specific and direct, not necessarily first person.
- The rewrite should preserve that this is a launch announcement — don't strip out the fact that the product is being introduced. The job is to make it sound like a person announcing a thing they made, not a press release.
