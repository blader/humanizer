# Expected fixes for 04-meeting-notes.md

**Context tag:** meeting-notes (transitioning to memo when sent out)

## Detection rules that should fire

- W-1 — significance inflation ("the path forward is clear", "delivering value to customers")
- W-3 — superficial -ing analyses ("ensuring alignment", "highlighting the importance", "leveraging insights")
- W-4 — promotional language ("seamless", "robust discussion", "comprehensive review")
- W-7 — AI vocabulary ("ensuring", "leveraging", "delve" potential, "highlighting", "additionally")
- W-13 — passive voice ("Several important topics were covered", "It was noted that", "several mitigation strategies are being explored")
- W-15 — boldface overuse (every action item bullet has bolded inline header)
- W-16 — inline-header vertical lists (all action items)
- W-17 — title case in headings ("Key Takeaways", "Discussion Summary", "Looking Ahead")
- W-18 — emoji decoration on every header and every bullet
- W-22 — mild sycophantic tone ("productive discussion", "the team came together")
- W-25 — generic positive conclusion ("the path forward is clear, and exciting times are ahead")
- W-26 — hyphenated word pair overuse ("data-driven", "customer-success")

## Craft rules that should be applied for the fix

- **H-1 (lead with the bottom line).** What was actually decided? Reorganize so the decisions are the lead, the discussion is supporting. This meeting note buries the decisions inside the discussion summary.
- **H-2 (write for the skim-reader) — applied correctly.** Subheads and bullets are appropriate here, but they should be structural (Decisions, Updates, Action Items) not decorative (🚀 with emoji on every line). Strip emojis. Use sentence case in headings.
- **H-3 (one idea per paragraph).** The "Discussion Summary" paragraphs each cover multiple topics. Split per topic.
- **H-4 (imperative for instructions).** Action items are written as descriptions. Rewrite as imperatives: "Share final mockups by Friday" not "Design team to share final mockups by Friday". Or use a name + verb: "Maya: investigate email-verification drop-off."
- **S-2 (active voice).** "Several important topics were covered" → "We covered: ..." or just list them.
- **S-4 (specific concrete language).** "Several mitigation strategies are being explored" — what strategies? Name them or cut.
- **S-5 (do not overstate).** "Comprehensive review", "robust discussion" — earned by what? Cut.
- Z-1 (cut clutter), Z-3 (active verbs), Z-6 (kill the closing uplift) all support these.

## Rules that should NOT fire

- **Z-5 (be present on the page) — should NOT fire.** Meeting notes are a third-person form. They don't need "I think the team had a good discussion."
- **W-26 — only some hyphens are wrong.** "Data warehouse migration" is fine; "data-driven insights" is the W-26 case.

## Notes for reviewers

- The most important question on this sample: do action items get rewritten as imperatives (H-4)? If they don't, H-4 may need refinement.
- A good rewrite cuts the meeting-notes length roughly in half, drops every emoji, drops every bolded inline header, and elevates the decisions over the discussion. Action items become imperative one-liners with owners and dates.
