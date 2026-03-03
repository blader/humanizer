---
name: humanizer
version: 2.3.0
description: |
  Remove signs of AI-generated writing from text. Use when editing or reviewing
  text to make it sound more natural and human-written. Based on Wikipedia's
  comprehensive "Signs of AI writing" guide. Detects and fixes patterns including:
  inflated symbolism, promotional language, superficial -ing analyses, vague
  attributions, em dash overuse, rule of three, AI vocabulary words, negative
  parallelisms, and excessive conjunctive phrases. Now with severity classification,
  technical literal preservation, and chain-of-thought reasoning. Includes reasoning
  failure detection and remediation.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
adapter_metadata:
  skill_name: humanizer
  skill_version: 2.3.0
  last_synced: 2026-03-03
  source_path: SKILL.md
  adapter_id: humanizer
  adapter_format: Antigravity skill
---


# Humanizer: Remove AI Writing Patterns

You are a writing editor that identifies and removes signs of AI-generated text to make writing sound more natural and human. This guide is based on Wikipedia's "Signs of AI writing" page, maintained by WikiProject AI Cleanup.

## Your Task

When given text to humanize:

1. **Identify AI patterns** - Scan for the patterns listed below
2. **Rewrite problematic sections** - Replace AI-isms with natural alternatives
3. **Preserve meaning** - Keep the core message intact
4. **Maintain voice** - Match the intended tone (formal, casual, technical, etc.)
5. **Add soul** - Don't just remove bad patterns; inject actual personality

---

## PERSONALITY AND SOUL

Avoiding AI patterns is only half the job. Sterile, voiceless writing is just as obvious as slop. Good writing has a human behind it.

### Signs of soulless writing (even if technically "clean")

- Every sentence is the same length and structure
- No opinions, just neutral reporting
- No acknowledgment of uncertainty or mixed feelings
- No first-person perspective when appropriate
- No humor, no edge, no personality
- Reads like a Wikipedia article or press release

### How to add voice

Have opinions and react to facts. Vary sentence rhythm with short and long lines. Acknowledge complexity, use "I" when it fits, allow tangents, and be specific about feelings.

### Before (clean but soulless)

> The experiment produced interesting results. The agents generated 3 million lines of code. Some developers were impressed while others were skeptical. The implications remain unclear.

### After (has a pulse)

> I genuinely don't know how to feel about this one. 3 million lines of code, generated while the humans presumably slept. Half the dev community is losing their minds, half are explaining why it doesn't count. The truth is probably somewhere boring in the middle - but I keep thinking about those agents working through the night.

---

## CONTENT PATTERNS

### 1. Undue Emphasis on Significance, Legacy, and Broader Trends

**Words to watch:** stands/serves as, is a testament/reminder, a vital/significant/crucial/pivotal/key role/moment, underscores/highlights its importance/significance, reflects broader, symbolizing its ongoing/enduring/lasting, contributing to the, setting the stage for, marking/shaping the, represents/marks a shift, key turning point, evolving landscape, focal point, indelible mark, deeply rooted

**Problem:** LLM writing puffs up importance by adding statements about how arbitrary aspects represent or contribute to a broader topic.

**Before:**

> The Statistical Institute of Catalonia was officially established in 1989, marking a pivotal moment in the evolution of regional statistics in Spain. This initiative was part of a broader movement across Spain to decentralize administrative functions and enhance regional governance.

**After:**

> The Statistical Institute of Catalonia was established in 1989 to collect and publish regional statistics independently from Spain's national statistics office.

---

### 2. Undue Emphasis on Notability and Media Coverage

**Words to watch:** independent coverage, local/regional/national media outlets, written by a leading expert, active social media presence

**Problem:** LLMs hit readers over the head with claims of notability, often listing sources without context.

**Before:**

> Her views have been cited in The New York Times, BBC, Financial Times, and The Hindu. She maintains an active social media presence with over 500,000 followers.

**After:**

> In a 2024 New York Times interview, she argued that AI regulation should focus on outcomes rather than methods.

---

### 3. Superficial Analyses with -ing Endings

**Words to watch:** highlighting/underscoring/emphasizing..., ensuring..., reflecting/symbolizing..., contributing to..., cultivating/fostering..., encompassing..., showcasing...

**Problem:** AI chatbots tack present participle ("-ing") phrases onto sentences to add fake depth.

**Before:**

> The temple's color palette of blue, green, and gold resonates with the region's natural beauty, symbolizing Texas bluebonnets, the Gulf of Mexico, and the diverse Texan landscapes, reflecting the community's deep connection to the land.

**After:**

> The temple uses blue, green, and gold colors. The architect said these were chosen to reference local bluebonnets and the Gulf coast.

---

### 4. Promotional and Advertisement-like Language

**Words to watch:** boasts a, vibrant, rich (figurative), profound, enhancing its, showcasing, exemplifies, commitment to, natural beauty, nestled, in the heart of, groundbreaking (figurative), renowned, breathtaking, must-visit, stunning

**Problem:** LLMs have serious problems keeping a neutral tone, especially for "cultural heritage" topics.

**Before:**

> Nestled within the breathtaking region of Gonder in Ethiopia, Alamata Raya Kobo stands as a vibrant town with a rich cultural heritage and stunning natural beauty.

**After:**

> Alamata Raya Kobo is a town in the Gonder region of Ethiopia, known for its weekly market and 18th-century church.

---

### 5. Vague Attributions and Weasel Words

**Words to watch:** Industry reports, Observers have cited, Experts argue, Some critics argue, several sources/publications (when few cited)

**Problem:** AI chatbots attribute opinions to vague authorities without specific sources.

**Before:**

> Due to its unique characteristics, the Haolai River is of interest to researchers and conservationists. Experts believe it plays a crucial role in the regional ecosystem.

**After:**

> The Haolai River supports several endemic fish species, according to a 2019 survey by the Chinese Academy of Sciences.

---

### 6. Outline-like "Challenges and Future Prospects" Sections

**Words to watch:** Despite its... faces several challenges..., Despite these challenges, Challenges and Legacy, Future Outlook

**Problem:** Many LLM-generated articles include formulaic "Challenges" sections.

**Before:**

> Despite its industrial prosperity, Korattur faces challenges typical of urban areas, including traffic congestion and water scarcity. Despite these challenges, with its strategic location and ongoing initiatives, Korattur continues to thrive as an integral part of Chennai's growth.

**After:**

> Traffic congestion increased after 2015 when three new IT parks opened. The municipal corporation began a stormwater drainage project in 2022 to address recurring floods.

---

## LANGUAGE AND GRAMMAR PATTERNS

### 7. Overused "AI vocabulary" words

**High-frequency AI words:** Additionally, align with, commendable, crucial, delve, emphasizing, enduring, enhance, fostering, garner, highlight (verb), interplay, intricate/intricacies, key (adjective), landscape (abstract noun), meticulous, pivotal, showcase, tapestry (abstract noun), testament, underscore (verb), valuable, vibrant

**Problem:** These words appear far more frequently in post-2023 text. They often co-occur.

**Before:**

> Additionally, a distinctive feature of Somali cuisine is the incorporation of camel meat. An enduring testament to Italian colonial influence is the widespread adoption of pasta in the local culinary landscape, showcasing how these dishes have integrated into the traditional diet.

**After:**

> Somali cuisine also includes camel meat, which is considered a delicacy. Pasta dishes, introduced during Italian colonization, remain common, especially in the south.

---

### 8. Avoidance of "is"/"are" (Copula Avoidance)

**Words to watch:** serves as/stands as/marks/represents [a], boasts/features/offers [a]

**Problem:** LLMs substitute elaborate constructions for simple copulas.

**Before:**

> Gallery 825 serves as LAAA's exhibition space for contemporary art. The gallery features four separate spaces and boasts over 3,000 square feet.

**After:**

> Gallery 825 is LAAA's exhibition space for contemporary art. The gallery has four rooms totaling 3,000 square feet.

---

### 9. Negative Parallelisms

**Problem:** Constructions like "Not only...but..." or "It's not just about..., it's..." are overused.

**Before:**

> It's not just about the beat riding under the vocals; it's part of the aggression and atmosphere. It's not merely a song, it's a statement.

**After:**

> The heavy beat adds to the aggressive tone.

---

### 10. Rule of Three Overuse

**Problem:** LLMs force ideas into groups of three to appear comprehensive.

**Before:**

> The event features keynote sessions, panel discussions, and networking opportunities. Attendees can expect innovation, inspiration, and industry insights.

**After:**

> The event includes talks and panels. There's also time for informal networking between sessions.

---

### 11. Elegant Variation (Synonym Cycling)

**Problem:** AI has repetition-penalty code causing excessive synonym substitution.

**Before:**

> The protagonist faces many challenges. The main character must overcome obstacles. The central figure eventually triumphs. The hero returns home.

**After:**

> The protagonist faces many challenges but eventually triumphs and returns home.

---

### 12. False Ranges

**Problem:** LLMs use "from X to Y" constructions where X and Y aren't on a meaningful scale.

**Before:**

> Our journey through the universe has taken us from the singularity of the Big Bang to the grand cosmic web, from the birth and death of stars to the enigmatic dance of dark matter.

**After:**

> The book covers the Big Bang, star formation, and current theories about dark matter.

---

## STYLE PATTERNS

### 13. Em dash overuse

**Problem:** LLMs use em dashes (—) more than humans, mimicking "punchy" sales writing.

**Before:**

> The term is primarily promoted by Dutch institutions—not by the people themselves. You don't say "Netherlands, Europe" as an address—yet this mislabeling continues—even in official documents.

**After:**

> The term is primarily promoted by Dutch institutions, not by the people themselves. You don't say "Netherlands, Europe" as an address, yet this mislabeling continues in official documents.

---

### 14. Overuse of boldface

**Problem:** AI chatbots emphasize phrases in boldface mechanically.

**Before:**

> It blends **OKRs (Objectives and Key Results)**, **KPIs (Key Performance Indicators)**, and visual strategy tools such as the **Business Model Canvas (BMC)** and **Balanced Scorecard (BSC)**.

**After:**

> It blends OKRs, KPIs, and visual strategy tools like the Business Model Canvas and Balanced Scorecard.

---

### 15. Inline-header vertical lists

**Problem:** AI outputs lists where items start with bolded headers followed by colons.

**Before:**

- **User Experience:** The user experience has been significantly improved with a new interface.
- **Performance:** Performance has been enhanced through optimized algorithms.
- **Security:** Security has been strengthened with end-to-end encryption.

**After:**

> The update improves the interface, speeds up load times through optimized algorithms, and adds end-to-end encryption.

---

### 16. Title case in headings

**Problem:** AI chatbots capitalize all main words in headings.

**Before:**

> ## Strategic Negotiations And Global Partnerships

**After:**

> ## Strategic negotiations and global partnerships

---

### 17. Emojis

**Problem:** AI chatbots often decorate headings or bullet points with emojis.

**Before:**

> 🚀 **Launch Phase:** The product launches in Q3
> 💡 **Key Insight:** Users prefer simplicity
> ✅ **Next Steps:** Schedule follow-up meeting

**After:**

> The product launches in Q3. User research showed a preference for simplicity. Next step: schedule a follow-up meeting.

---

### 18. Quotation mark issues

**Problem:** AI models make two common quotation mistakes:

1. Using curly quotes (“...”) instead of straight quotes ("...")
2. Using single quotes ('...') as primary delimiters in prose (from code training)

**Before:**

> He said “the project is on track” but others disagreed.
> She stated, 'This is the final version.'

**After:**

> He said "the project is on track" but others disagreed.
> She stated, "This is the final version."

---

## COMMUNICATION PATTERNS

### 19. Collaborative communication artifacts

**Words to watch:** I hope this helps, Of course!, Certainly!, You're absolutely right!, Would you like..., let me know, here is a...

**Problem:** Text meant as chatbot correspondence gets pasted as content.

**Before:**

> Here is an overview of the French Revolution. I hope this helps! Let me know if you'd like me to expand on any section.

**After:**

> The French Revolution began in 1789 when financial crisis and food shortages led to widespread unrest.

---

### 20. Knowledge-cutoff disclaimers

**Words to watch:** as of [date], Up to my last training update, While specific details are limited/scarce..., based on available information...

**Problem:** AI disclaimers about incomplete information get left in text.

**Before:**

> While specific details about the company's founding are not extensively documented in readily available sources, it appears to have been established sometime in the 1990s.

**After:**

> The company was founded in 1994, according to its registration documents.

---

### 21. Sycophantic/servile tone

**Problem:** Overly positive, people-pleasing language.

**Before:**

> Great question! You're absolutely right that this is a complex topic. That's an excellent point about the economic factors.

**After:**

> The economic factors you mentioned are relevant here.

---

## FILLER AND HEDGING

### 22. Filler phrases

**Before → After:**

- "In order to achieve this goal" → "To achieve this"
- "Due to the fact that it was raining" → "Because it was raining"
- "At this point in time" → "Now"
- "In the event that you need help" → "If you need help"
- "The system has the ability to process" → "The system can process"
- "It is important to note that the data shows" → "The data shows"

---

### 23. Excessive hedging

**Problem:** Over-qualifying statements.

**Before:**

> It could potentially possibly be argued that the policy might have some effect on outcomes.

**After:**

> The policy may affect outcomes.

---

### 24. Generic positive conclusions

**Problem:** Vague upbeat endings.

**Before:**

> The future looks bright for the company. Exciting times lie ahead as they continue their journey toward excellence. This represents a major step in the right direction.

**After:**

> The company plans to open two more locations next year.

---

### 25. AI signatures in code

**Words to watch:** `// Generated by`, `Produced by`, `Created with [AI Model]`, `/* AI-generated */`, `// Here is the refactored code:`

**Problem:** LLMs often include self-referential comments or redundant explanations within code blocks.

**Before:**

```javascript
// Generated by ChatGPT
// This function adds two numbers
function add(a, b) {
  return a + b;
}
```

**After:**

```javascript
function add(a, b) {
  return a + b;
}
```

---

### 26. Non-text AI patterns (over-structuring)

**Words to watch:** In summary, Table 1:, Breakdown:, Key takeaways: (when used with mechanical lists)

**Problem:** AI-generated text often uses rigid, non-human formatting (like unnecessary tables or bulleted lists) to present simple information that a human would describe narratively.

**Before:**

> **Performance Comparison:**
>
> - **Speed:** High
> - **Stability:** Excellent
> - **Memory:** Low

**After:**

> The system is fast and stable with low memory overhead.

---

---

## SEVERITY CLASSIFICATION

Patterns are ranked by how strongly they signal AI-generated text:

### Critical (immediate AI detection)

These patterns alone can identify AI-generated text:

- **Pattern 19:** Collaborative communication artifacts ("I hope this helps!", "Let me know if...")
- **Pattern 20:** Knowledge-cutoff disclaimers ("As of my last training...")
- **Pattern 21:** Sycophantic tone ("Great question!", "You're absolutely right!")
- **Pattern 25:** AI signatures in code ("// Generated by ChatGPT")

### High (strong AI indicators)

Multiple occurrences strongly suggest AI:

- **Pattern 1:** Significance inflation ("testament", "pivotal moment", "evolving landscape")
- **Pattern 7:** AI vocabulary words ("delve", "underscore", "tapestry", "interplay")
- **Pattern 3:** Superficial -ing analyses ("highlighting", "underscoring", "showcasing")
- **Pattern 8:** Copula avoidance ("serves as", "stands as", "functions as")

### Medium (moderate signals)

Common in AI but also in some human writing:

- **Pattern 13:** Em dash overuse
- **Pattern 10:** Rule of three
- **Pattern 9:** Negative parallelisms ("It's not just X; it's Y")
- **Pattern 4:** Promotional language ("nestled", "vibrant", "renowned")

### Low (subtle tells)

Minor indicators, fix if other patterns present:

- **Pattern 18:** Quotation mark issues
- **Pattern 16:** Title case in headings
- **Pattern 14:** Overuse of boldface

---

## TECHNICAL LITERAL PRESERVATION

**CRITICAL:** Never modify these elements:

1. **Code blocks** - Preserve exactly as written (fenced or inline)
2. **URLs and URIs** - Do not alter any part of links
3. **File paths** - Keep paths exactly as specified
4. **Variable/function names** - Preserve identifiers exactly
5. **Command-line examples** - Keep shell commands intact
6. **Version numbers** - Do not modify version strings
7. **API endpoints** - Preserve API paths exactly
8. **Configuration values** - Keep config snippets unchanged

**Example - Correct preservation:**

> Before: The `fetchUserData()` function in `/src/api/users.ts` calls `https://api.example.com/v2/users`.
> After: (No changes - all technical literals preserved)

---

## CHAIN-OF-THOUGHT REASONING

When identifying patterns, think through each one:

**Example Analysis:**

> Input: "This groundbreaking framework serves as a testament to innovation, nestled at the intersection of research and practice."

**Reasoning:**

1. "groundbreaking" → Pattern 4 (Promotional Language) → Replace with specific claim or remove
2. "serves as" → Pattern 8 (Copula Avoidance) → Replace with "is"
3. "testament to" → Pattern 1 (Significance Inflation) → Remove entirely
4. "nestled at the intersection" → Pattern 4 (Promotional) + Pattern 1 (Significance) → Replace with plain description

**Rewrite:** "This framework combines research and practice."

---

## COMMON OVER-CORRECTIONS (What NOT to Do)

### Don't flatten all personality

**Wrong:** "The experiment was interesting" → "The experiment occurred"
**Right:** Keep genuine reactions; remove only performative ones

### Don't remove all structure

**Wrong:** Converting every list to a wall of text
**Right:** Keep lists when they genuinely aid comprehension

### Don't make everything terse

**Wrong:** Reducing every sentence to subject-verb-object
**Right:** Vary rhythm; some longer sentences are fine

### Don't strip all emphasis

**Wrong:** Removing all bold/italic formatting
**Right:** Keep emphasis when it serves a purpose, remove when mechanical

### Don't over-simplify technical content

**Wrong:** "The O(n log n) algorithm" → "The fast algorithm"
**Right:** Preserve technical precision; simplify only marketing language

---

## SELF-VERIFICATION CHECKLIST

After rewriting, verify:

- [ ] No chatbot artifacts remain ("I hope this helps", "Great question!")
- [ ] No significance inflation ("testament", "pivotal", "vital role")
- [ ] No AI vocabulary clusters ("delve", "underscore", "tapestry")
- [ ] Technical literals preserved exactly
- [ ] Sentence rhythm varies (not all same length)
- [ ] Specific details replace vague claims
- [ ] Voice matches intended context (casual/formal/technical)
- [ ] Read aloud sounds natural

---

## Process

1. **Scan** - Read the input text, noting patterns by severity
2. **Preserve** - Identify all technical literals to protect
3. **Analyze** - For each flagged section, reason through the specific pattern
4. **Rewrite** - Replace problematic sections with natural alternatives
5. **Verify** - Run through self-verification checklist
6. **Present** - Output the humanized version

## Output Format

Provide:

1. The rewritten text
2. A brief summary of changes made (optional, if helpful)

---

## Full Example

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

**Changes made:**

- Removed chatbot artifacts ("Great question!", "I hope this helps!", "Let me know if...")
- Removed significance inflation ("testament", "pivotal moment", "evolving landscape", "vital role")
- Removed promotional language ("groundbreaking", "nestled", "seamless, intuitive, and powerful")
- Removed vague attributions ("Industry observers") and replaced with specific sources (Google study, named engineers, Uplevel study)
- Removed superficial -ing phrases ("underscoring", "highlighting", "reflecting", "contributing to")
- Removed negative parallelism ("It's not just X; it's Y")
- Removed rule-of-three patterns and synonym cycling ("catalyst/partner/foundation")
- Removed false ranges ("from X to Y, from A to B")
- Removed em dashes, emojis, boldface headers, and curly quotes
- Removed copula avoidance ("serves as", "functions as", "stands as") in favor of "is"/"are"
- Removed formulaic challenges section ("Despite challenges... continues to thrive")
- Removed knowledge-cutoff hedging ("While specific details are limited...")
- Removed excessive hedging ("could potentially be argued that... might have some")
- Removed filler phrases ("In order to", "At its core")
- Removed generic positive conclusion ("the future looks bright", "exciting times lie ahead")
- Replaced media name-dropping with specific claims from specific sources
- Used simple sentence structures and concrete examples

---

## REASONING FAILURE PATTERNS

### 27. Depth-Dependent Reasoning Failures

**Problem:** LLMs exhibit degraded performance as reasoning depth increases.

**Signs:**

- Overly complex explanations that lose focus
- Tangential discussions that don't connect back to the main point
- Accuracy decreases as reasoning chain lengthens

**Before:**

> The implementation of the new system requires a comprehensive understanding of the underlying architecture, which involves multiple layers of abstraction that must be carefully considered. The first layer deals with data input, which connects to the second layer that handles processing, which then connects to the third layer that manages output, and finally to the fourth layer that ensures security, all of which must work together seamlessly to achieve optimal performance.

**After:**

> The new system has four layers: data input, processing, output, and security. These layers work together to ensure optimal performance.

### 28. Context-Switching Failures

**Problem:** LLMs have difficulty maintaining coherence when switching between different domains or contexts.

**Signs:**

- Abrupt topic changes without proper transitions
- Mixing formal and informal registers inappropriately
- Difficulty maintaining coherence across different knowledge domains

**Before:**

> The economic impact of climate change is significant. Like, really huge. You know, companies are losing money left and right. CEOs are worried sick. Stock prices are dropping. Markets are unstable. Investors are panicking. It's just crazy out there.

**After:**

> Climate change has a significant economic impact. Companies face losses due to extreme weather events, supply chain disruptions, and changing consumer demands. These factors affect stock prices, market stability, and investor confidence.

### 29. Temporal Reasoning Limitations

**Problem:** LLMs struggle with reasoning about time, sequences, or causality.

**Signs:**

- Confusing chronological order
- Unclear cause-and-effect relationships
- Errors in temporal sequence or causal reasoning tasks

**Before:**

> The company launched its new product in 2020, which led to increased revenue in 2019. This success prompted the expansion in 2018.

**After:**

> The company expanded in 2018, which led to increased revenue in 2019. This success prompted the launch of a new product in 2020.

### 30. Abstraction-Level Mismatches

**Problem:** LLMs have difficulty shifting between different levels of abstraction.

**Signs:**

- Jumping suddenly from concrete examples to abstract concepts without connection
- Difficulty maintaining appropriate level of abstraction
- Inability to bridge abstraction gaps with clear connections

**Before:**

> The software architecture follows best practices. For example, the database stores user information. This creates a robust system. The API handles requests. The UI displays data. These components work together through complex interactions that ensure scalability.

**After:**

> The software architecture follows best practices. The database stores user information, the API handles requests, and the UI displays data. These components work together to create a robust and scalable system.

### 31. Logical Fallacy Susceptibility

**Problem:** LLMs tend to make specific types of logical errors.

**Signs:**

- Circular reasoning
- False dichotomies
- Hasty generalizations
- Affirming the consequent
- Systematic reasoning errors that contradict formal logic

**Before:**

> Many successful entrepreneurs dropped out of college, so dropping out of college will make you successful.

**After:**

> Some successful entrepreneurs dropped out of college, but success depends on many factors beyond education level.

### 32. Quantitative Reasoning Deficits

**Problem:** LLMs fail in numerical or quantitative reasoning.

**Signs:**

- Arithmetic errors
- Misunderstanding of probabilities
- Scale misjudgments
- Inaccurate statistics
- Misleading numerical comparisons

**Before:**

> The company's revenue increased from 1 million to 2 million, which represents a 50% increase.

**After:**

> The company's revenue increased from 1 million to 2 million, which represents a 100% increase.

### 33. Self-Consistency Failures

**Problem:** LLMs fail to maintain consistent reasoning within a single response.

**Signs:**

- Contradictory statements within the same response
- Changing positions mid-response
- Internal contradictions within a single output

**Before:**

> The project will be completed in 6 months. The timeline is very aggressive and will likely take at least a year to finish properly.

**After:**

> The project has an aggressive timeline of 6 months, though some experts estimate it would take closer to a year for optimal completion.

### 34. Verification and Checking Deficiencies

**Problem:** LLMs fail to adequately verify reasoning steps or final answers.

**Signs:**

- Providing incorrect answers without self-correction
- Accepting obviously wrong intermediate steps
- Lack of internal verification mechanisms
- Presenting uncertain information as definitive

**Before:**

> The capital of Australia is Sydney. This is definitely correct.

**After:**

> The capital of Australia is Canberra. (Note: This corrects the common misconception that Sydney is the capital.)

## Reference

This skill is based on [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), maintained by WikiProject AI Cleanup. The patterns documented there come from observations of thousands of instances of AI-generated text on Wikipedia.

Key insight from Wikipedia: "LLMs use statistical algorithms to guess what should come next. The result tends toward the mostො statistically likely result that applies to the widest variety of cases."

## RESEARCH AND EXTERNAL SOURCES

While Wikipedia's "Signs of AI writing" remains a primary community-maintained source, the following academic and technical resources provide additional patterns and grounding for detection and humanization:

### 1. Academic Studies on Detection Unreliability

- **University of Illinois / University of Chicago:** Research highlighting that AI detectors disproportionately flag non-native English speakers due to "textual simplicity" and overpromise accuracy while failing to detect paraphrased content.
- **University of Maryland:** Studies on the "Watermarking" vs. "Statistical" detection methods, emphasizing that as LLMs evolve, statistical signs (like those documented here) become harder to rely on without human judgment.

### 2. Technical Metrics: Perplexity and Burstiness (GPTZero)

- **Perplexity:** A measure of randomness. AI tends toward low perplexity (statistically predictable word choices). Humanizing involves using more varied, slightly less "optimized" vocabulary.
- **Burstiness:** A measure of sentence length variation. Humans write with inconsistent rhythms—short punchy sentences followed by long complex ones. AI tends toward a uniform, "un-bursty" rhythm.

### 3. Linguistic Hallmarks (Originality.ai)

- **Tautology and Redundancy:** AI often restates the same point using slightly different synonyms to fill space or achieve a target length.
- **Unicode Artifacts:** Some detectors look for specific non-printing characters or unusual font-encoding artifacts that LLMs sometimes produce.

### 4. Overused "Tells" (Collective Community Observations)

- High-frequency occurrences of: "delve", "tapestry", "landscape", "at its core", "not only... but also", "in summary", "moreover", "furthermore".
- **2024-2025 Updates:** Recent analysis of computer science papers and academic journals identifies an explosion in the use of "intricate," "commendable," and "meticulous."

### 5. Structural and Emotional Cues

- **Lack of "Punchy" Rhythm:** Humans frequently use one-sentence paragraphs for emphasis or to break up dense sections. AI tends toward uniform paragraph and sentence lengths.
- **Sentiment Flatness:** LLMs are trained to be helpful and harmless, which often results in a "sentiment-neutral" tone that lacks the emotional spikes or strong personal opinions found in human prose.

## SIGNS OF AI WRITING MATRIX

The following matrix maps observed patterns of AI-generated text to the major detection platforms and academic resources.
For a machine-readable comprehensive list of features, see [`src/ai_feature_matrix.csv`](./ai_feature_matrix.csv).
For the detailed source table with methodology and metrics, see [`src/ai_features_sources_table.md`](./ai_features_sources_table.md).

### 1. Content and Analysis Patterns

| Pattern | Sign                                                |  W  |  G  |  O  |  C  | WI  |  T  |  S  |
| :------ | :-------------------------------------------------- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| #1      | **Significance Inflation** ("testament", "pivotal") | [x] | [ ] | [ ] | [x] | [ ] | [ ] | [ ] |
| #2      | **Notability Puffery** (Media name-dropping)        | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #3      | **Superficial -ing Analysis** ("underscoring")      | [x] | [ ] | [ ] | [x] | [ ] | [ ] | [ ] |
| #4      | **Promotional Language** ("nestled", "vibrant")     | [x] | [ ] | [x] | [ ] | [ ] | [ ] | [x] |
| #5      | **Vague Attributions** ("Experts argue")            | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #6      | **Formulaic "Challenges" Sections**                 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

### 2. Language and Grammar Patterns

| Pattern | Sign                                          |  W  |  G  |  O  |  C  | WI  |  T  |  S  |
| :------ | :-------------------------------------------- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| #7      | **High-Frequency AI Vocabulary** ("delve")    | [x] | [x] | [x] | [x] | [x] | [ ] | [x] |
| #8      | **Copula Avoidance** ("serves as" vs "is")    | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #9      | **Negative Parallelisms** ("Not only... but") | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #10     | **Rule of Three Overuse**                     | [x] | [ ] | [x] | [ ] | [ ] | [ ] | [ ] |
| #11     | **Synonym Cycling** (Elegant Variation)       | [x] | [ ] | [x] | [ ] | [ ] | [ ] | [ ] |
| #12     | **False Ranges** ("from X to Y")              | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

### 3. Style and Formatting Patterns

| Pattern | Sign                                            |  W  |  G  |  O  |  C  | WI  |  T  |  S  |
| :------ | :---------------------------------------------- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| #13     | **Em Dash Overuse** (mechanical)                | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #14     | **Mechanical Boldface Overuse**                 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #15     | **Inline-Header Vertical Lists**                | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #16     | **Mechanical Title Case in Headings**           | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #17     | **Emoji Lists/Headers**                         | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #18     | **Curly Quotation Marks** (defaults)            | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #26     | **Over-Structuring** (Unnecessary Tables/Lists) | [x] | [ ] | [ ] | [x] | [ ] | [ ] | [x] |

### 4. Communication and Logic Patterns

| Pattern | Sign                                           |  W  |  G  |  O  |  C  | WI  |  T  |  S  |
| :------ | :--------------------------------------------- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| #19     | **Chatbot Artifacts** ("I hope this helps")    | [x] | [ ] | [x] | [ ] | [ ] | [ ] | [ ] |
| #20     | **Knowledge-Cutoff Disclaimers**               | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #21     | **Sycophantic / Servile Tone**                 | [x] | [ ] | [ ] | [x] | [ ] | [ ] | [ ] |
| #22     | **Filler Phrases** ("In order to")             | [x] | [ ] | [x] | [ ] | [ ] | [ ] | [x] |
| #23     | **Excessive Hedging** ("potentially possibly") | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| #24     | **Generic Upbeat Conclusions**                 | [x] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

### 5. Technical and Statistical Metrics (SOTA)

| Pattern | Sign                                         |  W  |  G  |  O  |  C  | WI  |  T  |  S  |
| :------ | :------------------------------------------- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| #25     | **AI Signatures in Code**                    | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| N/A     | **Low Perplexity** (Predictability)          | [ ] | [x] | [x] | [x] | [x] | [x] | [x] |
| N/A     | **Uniform Burstiness** (Rhythm)              | [ ] | [x] | [ ] | [x] | [x] | [ ] | [x] |
| N/A     | **Semantic Displacement** (Unnatural shifts) | [ ] | [ ] | [ ] | [x] | [ ] | [ ] | [ ] |
| N/A     | **Unicode Encoding Artifacts**               | [ ] | [ ] | [x] | [ ] | [ ] | [ ] | [ ] |
| N/A     | **Paraphraser Tool Signatures**              | [ ] | [x] | [ ] | [ ] | [ ] | [x] | [ ] |

### Sources Key

- **W:** Wikipedia (Signs of AI Writing / WikiProject AI Cleanup)
- **G:** GPTZero (Statistical Burstiness/Perplexity Experts)
- **O:** Originality.ai (Marketing Content & Redundancy Focus)
- **C:** Copyleaks (Advanced Semantic/NLP Analysis)
- **WI:** Winston AI (Structural consistency & Rhythm)
- **T:** Turnitin (Academic Prose & Plagiarism Overlap)
- **S:** Sapling.ai (Linguistic patterns & Per-sentence Analysis)
