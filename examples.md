# Humanizer — Reference and Worked Example

## Source

Based on [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing),
maintained by WikiProject AI Cleanup, extended with Claude-specific patterns from
Anthropic's own system prompt documentation and ACL 2025 research on model-specific
AI writing fingerprints.

Core insight: LLMs produce the most statistically likely next token across the
widest variety of cases. The result is technically correct, statistically average,
and unmistakably non-human.

---

## Full Worked Example

**Input (Claude output, Casual mode):**
> I'd be happy to explain this topic. AI-assisted coding serves as an enduring
> testament to the transformative potential of large language models, marking a
> pivotal moment in software development. By leveraging these groundbreaking tools,
> engineers can streamline processes, enhance collaboration, and foster alignment.
> Industry observers have noted adoption has accelerated significantly. Additionally,
> the ability to generate documentation showcases how AI contributes to better
> outcomes, highlighting the intricate interplay between automation and judgment.
> The future looks bright.
>
> **Key takeaways:**
> - Improves developer speed
> - Enhances code quality
> - Drives team alignment

**Patterns flagged:**
- P2/P6 (Claude opener): "I'd be happy to explain this topic" → delete
- P4 (significance inflation): "serves as an enduring testament", "marking a pivotal moment" → plain fact
- P1 (AI vocabulary): "transformative", "groundbreaking", "foster", "enhance" → plain words
- P16 (gerund opener): "By leveraging these tools, engineers can..." → direct statement
- P3 (vague attribution): "Industry observers have noted" → [NEEDS REAL SOURCE]
- P5 (-ing tack-on): "highlighting the intricate interplay..." → cut
- P8 (generic conclusion): "The future looks bright" → cut or replace
- P31 (Claude markdown): bolded header + bullet list for continuous thought → prose

**Draft rewrite:**
> AI coding assistants speed up certain tasks. They're useful for boilerplate,
> test scaffolding, and repetitive refactors. Adoption is growing, though
> productivity gains are harder to measure than the headlines suggest.
> [NEEDS REAL SOURCE] The tools don't replace judgment. They move where it
> has to be applied.

**Self-audit — remaining tells:**
- Rhythm is slightly tidy but no structural AI tells remain.
- No markdown, no vocabulary flags, no fake attributions.

**Final rewrite:** No changes. Draft stands.

**Changes summary:**
- Deleted Claude opener "I'd be happy to explain this topic" (P2)
- Removed "testament", "pivotal", "transformative", "groundbreaking", "foster", "enhance" (P1, P4)
- Rewrote gerund opener as direct statement (P16)
- Flagged vague attribution with [NEEDS REAL SOURCE] (P3)
- Cut -ing analysis phrase (P5)
- Replaced generic conclusion with a concrete statement (P8)
- Rewrote bullet list as prose (P31)
