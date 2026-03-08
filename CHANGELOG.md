# Humanizer Skill — Changelog

## v4.0.0
- F1: Moved Appendix and Reference to references/examples.md (spec compliance, under 500 lines)
- F2: Moved version/changelog out of SKILL.md frontmatter to this file
- F3: Fixed description trigger — "ChatGPT" → "AI / Claude"
- F4: Pattern 30 (Curly Quotes) now marked ChatGPT/DeepSeek-specific; explicitly skip for Claude output
- F5: Pattern 31 added (HIGH): Claude Markdown Overuse — Claude's primary structural tell
- F6: Pattern 2 extended with Claude-specific openers: "I'd be happy to", "Let me [verb]", "I can help with that", "Happy to help!"
- F7: Pattern 32 added (MEDIUM): Post-action summaries ("To recap:", "In summary:", "Here's what was covered:")
- F8: Pattern 19 extended with standalone Claude caveat lines: "Note:", "Important:", "Keep in mind:"
- F9: "straightforward" added to Pattern 1 word list
- F10: Pattern 33 added (MEDIUM): Unsolicited ethical/safety caveats
- F11: Pattern 34 added (LOW): Second-person lock / "you" saturation
- F12: Pattern 1 extended with Claude-specific vocabulary: commendable, comprehensive, empower, holistic, leverage, meticulous/meticulously, navigate (figurative), nuanced, realm, resonate, swiftly
- F13: Pattern 6 (Passive Voice): explicit Formal mode exception added
- F14: Patterns 25+26 reclassified LOW → MEDIUM with Claude-specific high-confidence note
- F15: Pattern 3 example: invented "12%" stat replaced with [REAL FIGURE] placeholder
- F16: Appendix worked example: em dash removed from draft rewrite

## v3.2.0
- Pattern 29 pre-scan added to PROCESS
- Pattern 30 raw-text fallback added
- Compact worked example appendix added
- Inline-text scope assumption documented in GUARDRAILS

## v3.1.0
- Restored curly quotes pattern with Unicode codepoints
- Softened Pattern 1 cut rule (rewrite first, cut last)
- Added frequency heuristic for stylistic choices (3+ occurrences)
- Deduplicated sycophantic flags across patterns
- Added invented-person guardrail to STEP 2
- Added bold-label clarification in OUTPUT FORMAT
- Restored Title Case as Pattern 29 with style-guide nuance

## v3.0.0
- Added context modes (Casual / Professional / Formal)
- Added severity ranking (HIGH / MEDIUM / LOW)
- Added DO NOT TOUCH rules
- Added GUARDRAILS section
- Added 4 new patterns: passive voice, gerund openers, transition stacking, meta-commentary
- Fabrication guardrail: never invent sources
- Self-audit clarified as internal reasoning step

## v2.2.0
- Original stable version
- 24 patterns based on Wikipedia "Signs of AI writing" (WikiProject AI Cleanup)
