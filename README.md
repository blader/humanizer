# Humanizer-next

Humanizer-next is a forward-maintained fork of [blader/humanizer](https://github.com/blader/humanizer). It removes signs of AI-generated writing from text while preserving meaning, tone, and technical literals.

## Installation

### Recommended

```bash
git clone https://github.com/edithatogo/humanizer-next.git
cd humanizer-next
npm install
```

For tool-specific installation, migration, and update instructions, use [docs/install-matrix.md](docs/install-matrix.md).

## Usage

### Sync and build (cross-platform)

The repository uses a modular fragment system to maintain consistency.

1. Requires **Node.js**.
2. Install dependencies: `npm install`
3. Compile and sync all versions: `npm run sync`
4. Validate adapters and docs: `npm run validate`

This will rebuild `SKILL.md` (Standard) and `SKILL_PROFESSIONAL.md` (Pro) from the `src/` directory and sync them to all adapter files.

### Variants

- **Standard version (Human):** `/humanizer` (via `SKILL.md`)
- **Professional version (Pro):** `/humanizer-pro` (via `SKILL_PROFESSIONAL.md`)

## Capability overview

Detects **30 patterns** including inflated symbolism, superficial analyses, vague attributions, AI-signature comments, persuasive tropes, signposting, and fragmented headers.

### Global agent context

AI agents (Claude Code, Cursor, Windsurf, etc.) should use [AGENTS.md](AGENTS.md) for repository orientation and core instructions.

---

## Adapters (multi-agent)

`SKILL.md` remains the canonical source of truth. These adapters provide thin wrappers for other environments:

- **Agents manifest:** `AGENTS.md`
- **Gemini CLI:** `adapters/gemini-extension/`
- **Google Antigravity (skill):** `adapters/antigravity-skill/`
- **Google Antigravity (rules/workflows):** `adapters/antigravity-rules-workflows/`
- **Qwen CLI:** `adapters/qwen-cli/`
- **GitHub Copilot:** `adapters/copilot/`
- **VS Code:** `adapters/vscode/`

Use [docs/install-matrix.md](docs/install-matrix.md) as the canonical installation source.

### Sync process

When `SKILL.md` is updated, run the sync script to propagate changes to all adapters:

```bash
npm run sync
```

This will automatically update version metadata and last synced timestamps across all adapter files.

## 30 patterns detected (with before/after examples)

### Content patterns

| #   | Pattern                       | Before                                            | After                                                    |
| --- | ----------------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| 1   | **Significance inflation**    | "marking a pivotal moment in the evolution of..." | "was established in 1989 to collect regional statistics" |
| 2   | **Notability name-dropping**  | "cited in NYT, BBC, FT, and The Hindu"            | "In a 2024 NYT interview, she argued..."                 |
| 3   | **Superficial -ing analyses** | "symbolizing... reflecting... showcasing..."      | Remove or expand with actual sources                     |
| 4   | **Promotional language**      | "nestled within the breathtaking region"          | "is a town in the Gonder region"                         |
| 5   | **Vague attributions**        | "Experts believe it plays a crucial role"         | "according to a 2019 survey by..."                       |
| 6   | **Formulaic challenges**      | "Despite challenges... continues to thrive"       | Specific facts about actual challenges                   |

### Language patterns

| #   | Pattern                   | Before                                                    | After                                |
| --- | ------------------------- | --------------------------------------------------------- | ------------------------------------ |
| 7   | **AI vocabulary**         | "Additionally... testament... landscape... showcasing"    | "also... remain common"              |
| 8   | **Copula avoidance**      | "serves as... features... boasts"                         | "is... has"                          |
| 9   | **Negative parallelisms** | "It's not just X, it's Y"                                 | State the point directly             |
| 10  | **Rule of three**         | "innovation, inspiration, and insights"                   | Use natural number of items          |
| 11  | **Elegant variation**     | "protagonist... main character... central figure... hero" | "protagonist" (repeat when clearest) |
| 12  | **False ranges**          | "from the Big Bang to dark matter"                        | List topics directly                 |

### Style patterns

| #   | Pattern                    | Before                                            | After                                     |
| --- | -------------------------- | ------------------------------------------------- | ----------------------------------------- |
| 13  | **Em dash overuse**        | "institutions—not the people—yet this continues—" | Use commas or periods                     |
| 14  | **Boldface overuse**       | "**OKRs**, **KPIs**, **BMC**"                     | "OKRs, KPIs, BMC"                         |
| 15  | **Inline-header lists**    | "**Performance:** Performance improved"           | Convert to prose                          |
| 16  | **Title case in headings** | "Strategic Negotiations And Partnerships"         | "Strategic negotiations and partnerships" |
| 17  | **Emojis**                 | "🚀 Launch Phase: 💡 Key Insight:"                | Remove emojis                             |
| 18  | **Curly quotation marks**  | `said “the project”`                              | `said "the project"`                      |
| 19  | **Primary single quotes**  | `stated, 'This is a pattern.'`                    | `stated, "This is a pattern."`            |

### Communication patterns

| #   | Pattern                          | Before                                              | After                  |
| --- | -------------------------------- | --------------------------------------------------- | ---------------------- |
| 20  | **Chatbot artifacts**            | "I hope this helps! Let me know if..."              | Remove entirely        |
| 21  | **Knowledge-cutoff disclaimers** | "While details are limited in available sources..." | Find sources or remove |
| 22  | **Sycophantic tone**             | "Great question! You're absolutely right!"          | Respond directly       |

### Filler and hedging

| #   | Pattern                          | Before                                | After                   |
| --- | -------------------------------- | ------------------------------------- | ----------------------- |
| 23  | **Filler phrases**               | "In order to", "Due to the fact that" | "To", "Because"         |
| 24  | **Excessive hedging**            | "could potentially possibly"          | "may"                   |
| 25  | **Generic positive conclusions** | "The future looks bright"             | Specific plans or facts |

## Full example

**Before (AI-sounding):**

> Great question! Here is an essay on this topic. I hope this helps!
>
> AI-assisted coding serves as an enduring testament to the transformative potential of large language models, marking a pivotal moment in the evolution of software development. In today's rapidly evolving technological landscape, these groundbreaking tools—nestled at the intersection of research and practice—are reshaping how engineers ideate, iterate, and deliver, underscoring their vital role in modern workflows.
>
> At its core, the value proposition is clear: streamlining processes, enhancing collaboration, and fostering alignment. It's not just about autocomplete; it's about unlocking creativity at scale, ensuring that organizations can remain agile while delivering seamless, intuitive, and powerful experiences to users. The tool serves as a catalyst. The assistant functions as a partner. The system stands as a foundation for innovation.
>
> Industry observers have noted that adoption has accelerated from hobbyist experiments to enterprise-wide rollouts, from solo developers to cross-functional teams. The technology has been featured in The New York Times, Wired, and The Verge. Additionally, the ability to generate documentation, tests, and refactors showcases how AI can contribute to better outcomes, highlighting the intricate interplay between automation and human judgment.
>
> - 💡 **Speed:** Code generation is significantly faster, reducing friction and empowering developers.
> - 🚀 **Quality:** Output quality has been enhanced through improved training, contributing to higher standards.
> - ✅ **Adoption:** Usage continues to grow, reflecting broader industry trends.
>
> While specific details are limited based on available information, it could potentially be argued that these tools might have some positive effect. Despite challenges typical of emerging technologies—including hallucinations, bias, and accountability—the ecosystem continues to thrive. In order to fully realize this potential, teams must align with best practices.
>
> In conclusion, the future looks bright. Exciting times lie ahead as we continue this journey toward excellence. Let me know if you’d like me to expand on any section!

**After (Humanized):**

> AI coding assistants speed up some tasks. In a 2024 study by Google, developers using Codex completed simple functions 55% faster than a control group, but showed no improvement on debugging or architectural decisions.
>
> The tools are good at boilerplate: config files, test scaffolding, repetitive refactors. They are bad at knowing when they are wrong. I have mass-accepted suggestions that compiled, passed lint, and still did the wrong thing because I stopped paying attention.
>
> Mira, an engineer at a fintech startup I interviewed, said she uses Copilot "like autocomplete for boring code" but reviews every line before committing. Jake, a senior dev at a larger company, disabled it after it kept suggesting patterns from a deprecated internal library.
>
> The productivity claims are hard to verify. GitHub says Copilot users "accept 30% of suggestions," but acceptance is not correctness, and correctness is not value. The 2024 Uplevel study found no statistically significant difference in pull-request throughput between teams with and without AI assistants.
>
> None of this means the tools are useless. It means they are tools. They do not replace judgment, and they do not eliminate the need for tests. If you do not have tests, you cannot tell whether the suggestion is right.

## References

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) - Primary source
- [WikiProject AI Cleanup](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup) - Maintaining organization

## Version history

- **3.1.0** - Adopted upstream PR #39: Patterns 28-30 (Persuasive tropes, Signposting, Fragmented headers)
- **3.0.0** - Modular architecture (ADR-001): 5 modules (CORE, TECHNICAL, ACADEMIC, GOVERNANCE, REASONING), compile script
- **2.3.0** - Reasoning module integration, severity classification, technical literal preservation
- **2.2.1** - Added Pattern #19 (Primary Single Quotes), unified Agents.md manifest, and addressed review feedback.
- **2.2.0** - Modular refactor and Humanizer Pro variant.
- **2.1.2** - Fixed YAML description (replaced "excessive conjunctive phrases" with "filler phrases").
- **2.1.1** - Fixed pattern #18 example (curly quotes vs straight quotes).
- **2.1.0** - Added Pattern #25 (AI Signatures) and Pattern #26 (Non-text slop).
- **2.0.0** - Complete rewrite based on raw Wikipedia article content.
- **1.0.0** - Initial release

## License

MIT
