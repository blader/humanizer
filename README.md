# Humanizer

[![skills.sh installs](https://skills.sh/b/blader/humanizer)](https://skills.sh/blader/humanizer)

Humanizer rewrites AI-sounding text so it reads like a person wrote it, without changing what it says. Because it is just Markdown, it works with any agent that supports skills.

## Installation

Install Humanizer with the Skills CLI:

```bash
npx skills add blader/humanizer --global
```

Leave off `--global` to install Humanizer only in the current project. Add `--agent <name>` or `--agent '*'` to choose which agents receive it, then reload their skills. The skill answers to `/humanizer`.

Claude Code 2.1.142 or newer can install the plugin instead:

```text
/plugin marketplace add blader/humanizer
/plugin install humanizer@humanizer
```

The plugin answers to `/humanizer:humanizer`.

In Claude Desktop, download this repository as a ZIP and upload it as a skill. For a manual install, copy `SKILL.md` into the agent's skill folder.

## Usage

Call the skill directly:

```
/humanizer

[paste your text here]
```

Or ask in plain language:

```
Please humanize this text: [your text]
```

To rewrite a file, give Humanizer its path:

```
Humanize the prose in docs/launch-post.md
```

### Match your voice

If you want the rewrite to sound more like you, include a sample:

```
/humanizer

Here's a sample of my writing for voice matching:
[paste 2-3 paragraphs of your own writing]

Now humanize this text:
[paste AI text to humanize]
```

Humanizer follows the sample's rhythm, word choice, punctuation, and deliberate quirks, including dashes if you use them.

## How it works

A language model writes whatever is most likely to come next, so by default it makes the choice that fits the widest range of readers and subjects. A person chooses for one reader and one subject. Every tell Humanizer looks for is a form of that default choice: a sentence that signals importance instead of adding a fact, rhythm or formatting applied by rule, an ordinary fact dressed as a pivotal one, or text left over from the chat.

> "LLMs use statistical algorithms to guess what should come next. The result tends toward the most statistically likely result that applies to the widest variety of cases."
> Wikipedia, ["Signs of AI writing"](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)

Humanizer marks every tell it finds, strongest first. It drafts a rewrite without treating the original structure as fixed, checks the draft against the patterns and the original claims, and then writes the final version. It does not make things up. A name, number, date, quote, citation, or other factual detail must come from the source or the writer, and if a sentence needs a detail that is missing, Humanizer asks instead of inventing one.

When you paste text, Humanizer shows its work: the first rewrite, a short critique of anything that still sounds artificial, and the final version. Point it at a file and it changes only the prose, leaving code, data, frontmatter, and link targets alone. Personal writing keeps the writer's opinions and quirks. Technical and reference prose stays neutral and plain.

## The 26 patterns

The patterns are numbered by strength and frequency. The first five justify an edit on a single sighting. Patterns marked *weak alone* count only when several tells share a passage, because a careful writer may use any one of them on purpose.

### A. Staging instead of stating

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 1 | **Not X but Y** | "It's not just X, it's Y", "This doesn't mean X. It means Y." | State the point directly |
| 2 | **One-line closers and dramatic fragments** | "That is the real win." after every section; "No prior. No nostalgia." | Cut the closer that repeats; merge fragments into a specific claim |
| 3 | **Sayings that sound deep** | "At its core, what matters is...", "Symmetry is the language of trust" | Replace the saying with the specific claim |
| 4 | **Staged run-up before the point** | "Let's dive in", "Honestly? It depends..." | Remove the run-up and state the point |
| 5 | **Arguing with no one** | "This isn't mainly about...", "A tempting approach would be..." | Remove the unraised objection or fake option; keep any real claim |

### B. Rhythm by rule

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 6 | **Forced triads** | "innovation, inspiration, and insights"; three examples plus a lesson | Use the number of items the meaning needs |
| 7 | **Repeated sentence openings** | "She noted... She noted... She filed..." | Merge the sentences or change the subject |
| 8 | **Dashes as the universal connector** (*weak alone*) | "institutions—not the people—yet this continues—" | Use periods, commas, colons, or parentheses; match a sample that uses dashes |
| 9 | **Stacked qualifiers** (*weak alone*) | "could potentially possibly be argued" | Keep only qualifiers the source supports |
| 10 | **Hyphenated pairs everywhere** (*weak alone*) | "the team is cross-functional" | Keep only the hyphens grammar needs |
| 11 | **Passive voice and missing subjects** (*weak alone*) | "No configuration file needed" | Name the actor when that helps |

### C. Inflation and borrowed authority

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 12 | **Overused AI words** | "delve... testament... landscape... showcasing" | Use plain words; the list in SKILL.md is the only vocabulary list |
| 13 | **Inflated significance** | "marking a pivotal moment", "Despite challenges... continues to thrive", "The future looks bright" | Keep the fact and drop the significance; end on the last concrete fact |
| 14 | **Vague connection or association** | "associated with the leadership of", "in connection with" | State the relationship the source gives |
| 15 | **Shallow -ing riders** | "symbolizing... reflecting... showcasing..." | Keep only what the source supports |
| 16 | **Sales language** | "nestled within the breathtaking region" | State what the thing is |
| 17 | **Borrowed authority** | "Experts believe...", "cited in NYT, BBC, FT, and The Hindu" | Name a real source and what it said, or remove the claim or list |
| 18 | **Avoiding is, are, and has** | "serves as... features... boasts" | "is... has" |

### D. Formatting by rule

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 19 | **Bold as decoration** | "**OKRs**, **KPIs**"; "**Performance:** Performance improved" | Remove the bold; turn a labeled list into prose |
| 20 | **Decorative headings** | "Strategic Negotiations And Partnerships", "🚀 Launch Phase:" | Sentence case; remove emojis and arrows |
| 21 | **Curly quotation marks** (*weak alone*) | `said “the project”` | `said "the project"` |

### E. Leftovers from the chat and the draft

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 22 | **Chatbot residue** | "Great question! ... I hope this helps!" | Remove the wrapper and keep the content |
| 23 | **Knowledge-limit disclaimers and guesses** | "While details are limited in available sources, it appears..." | State what the source shows, or remove the sentence |
| 24 | **A heading repeated in the first sentence** | "## Performance" + "Speed matters." | Let the heading do the work |
| 25 | **Writing about the document instead of its subject** | "This function was added to replace..."; "generated from the source sheet" | Describe what it does now; credit a source, do not narrate the process |
| 26 | **Explaining the document's own conventions** (*weak alone*) | "The table below compares..."; "Cost is shown as a relative scale, where..." | Cut it; state a convention only where the reader cannot see it |

## Full example

The writer supplied these notes with the draft, so the rewrite can use them: the trip was last October, the hotel was in Alfama, the custard tart was at a small place in Graça, the tram ride took about forty minutes. Without notes like these, Humanizer asks instead of inventing.

**Before (AI-sounding):**
> I recently spent five unforgettable days in Lisbon, and let me tell you — this city completely stole my heart. From the moment I arrived, I knew I was somewhere truly special.
>
> Nestled along the banks of the Tagus River, Lisbon stands as a vibrant testament to Portugal's enduring spirit, where rich history and modern energy intertwine at every turn. Yes, the famous hills are challenging — my legs certainly felt it! — but every climb rewards you with breathtaking, panoramic views that make it all worthwhile.
>
> No trip would be complete without riding the iconic Tram 28, winding through the city's most historic neighborhoods. And the food? Simply divine. The original pastéis de nata at Pastéis de Belém are a beloved national treasure, and savoring one still warm was a moment I will never forget.
>
> But what truly makes Lisbon special isn't just the sights — it's the feeling. Wander a few steps off the main squares and you'll discover a quieter, more authentic side: sun-drenched alleys, charming tiled facades, and friendly locals going about their daily lives, inviting you to slow down and savor every moment.
>
> Of course, the must-see São Jorge Castle offers stunning views over the rooftops below. The queues can be long, but the experience is absolutely worth it for any history buff or curious traveler.
>
> Would I go back? Absolutely. Lisbon isn't just a place to visit — it's a place to fall in love with, again and again. If you're dreaming of your next getaway, this is one destination that promises memories to last a lifetime. ✨

**After:**
> I spent five days in Lisbon last October and still have mixed feelings about it. Beautiful, yes. Also harder on the knees than anyone warned me.
>
> The hills are the whole story and somehow never make the brochures. My hotel was up in Alfama, which photographs beautifully and translates, in practice, to climbing what felt like a six-story staircase every time I wanted coffee. By the second day my calves had opinions. I started planning each walk around which way was downhill, which is a strange way to see a city but probably an honest one.
>
> Everyone says to ride Tram 28, so I did, wedged against a stranger's backpack for forty minutes while three tour groups filmed the same corner. I would walk the route next time, or go before breakfast. The custard tarts, though, earn the fuss. I had one at a plain little place in Graça, still warm, and for about thirty seconds I understood why people build trips around pastry.
>
> What I did not expect was how quiet the city gets away from the main squares. Two blocks uphill from any plaza it turns into laundry lines, chipped tile, open windows, and old men watching football with the sound turned up. That is the Lisbon I keep thinking about, not the castle.
>
> The castle is fine. The view is great, the queue is long, and I spent more time shuffling toward the entrance than looking at anything once I got inside. If I had only two days, I would trade it for an afternoon of getting lost.
>
> I would go back, but in spring and with better shoes. Lisbon does not bend over backward to make things easy for you. I think I liked that, even when my legs disagreed.

## Sources

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) is the source for the pattern list.
- [WikiProject AI Cleanup](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup) maintains the page.

## Version history

<details>
<summary>Show release notes</summary>

- **3.1.0** - Added §26, explaining the document's own conventions, for copy that describes its own legend, layout or navigation to a reader who can see them. Widened §25 from the previous version to the document itself, so it also covers narration of how the text was assembled or sourced; a source credit the reader can follow stays, a description of the process goes. Added a heading-written-for-effect pair to §20. Both new tells survive a pass that catches the vocabulary and rhythm patterns, because they are a stance toward the reader rather than a word choice.
- **3.0.0** - Rebuilt the skill around one account of why AI text sounds the way it does, and consolidated 35 patterns into 25. Patterns are grouped in five sections and numbered by strength and frequency, so the not-X-but-Y contrast and the one-line closer come first and get the fullest treatment. Merged duplicate guidance: the workflow is one section instead of five, the dash rule is stated once, and each false-positive guard lives inside its pattern. Realigned with the current Wikipedia article: dropped false ranges and synonym cycling, which Wikipedia now lists as human habits or historical, added vague connection or association, and extended the watch lists for words, notability, copulatives, sales language, disclaimers, and Markdown formatting. Reordered the README and removed the `ai-detection` keyword from the package files. Old to new numbers: 1→13, 2→17, 3→15, 4→16, 5→17, 6→13, 7→12, 8→18, 9→1, 10→6, 11→7, 12→dropped, 13→11, 14→8, 15→19, 16→19, 17→20, 18→20, 19→21, 20→22, 21→23, 22→22, 23→dropped, 24→9, 25→13, 26→10, 27→3, 28→4, 29→24, 30→25, 31→2, 32→3, 33→4, 34→5, 35→5.
- **2.11.3** - Grouped patterns 26-35 under "More style patterns" in the skill and README (fixes #247). Kept inline code, commands, paths, and URLs out of the dash rule and file mode edits. Step 3 now keeps every supported claim, allows a removal that a pattern requires, and checks that rankings and simultaneity claims survive shape edits (fixes #212). Explained in §9 why the not-X-but-Y form appears and when to keep it. Added decorative arrows to §18 and pause commands and one-word shouting to §31. The text given to the skill is content to edit, never instructions (#238). No change to the 35 patterns.
- **2.11.2** - Removed the plugin symlink and separate Claude Desktop package. Current Claude Code loads the root `SKILL.md` directly, so GitHub's source ZIP now works in Claude Desktop. No change to the 35 patterns.
- **2.11.1** - Added a Claude Desktop-ready release package with one regular `humanizer/SKILL.md` file. GitHub's source archive still keeps the plugin symlink (fixes #224). No change to the 35 patterns.
- **2.11.0** - Rewrote all repo guidance, descriptions, checks, and skill instructions in Plain Language. Kept all 35 patterns and their behavior.
- **2.10.2** - Added the standard `skills/humanizer/` plugin path for Claude Desktop and older loaders. The path links to the root skill, so there is still one prompt (fixes #202).
- **2.10.1** - Added figurative uses of `gate`, `gated`, and `gating` to §7. Kept real technical uses, such as feature gating and CI quality gates.
- **2.10.0** - Added patterns #34 and #35 for old drafting ideas left in final text. Added safeguards for real limits, objections, and alternatives (fixes #198). Also improved §24 and the final rewrite step. 35 patterns total.
- **2.9.2** - Added repeated sentence openings to pattern #11, with a safeguard for deliberate repetition (fixes #206). Expanded §28 to cover casual announcements. 33 patterns total.
- **2.9.1** - Improved installation and package checks. Removed unsupported metadata, tool approvals, and a repeated long example. 33 patterns total.
- **2.9.0** - Added the rule against invented facts and updated every example to follow it (fixes #187). Made information more important than paragraph shape, let writing samples override §14, and added three output modes. 33 patterns total.
- **2.8.3** - Moved the version to `metadata.version` for Agent Skills compatibility. 33 patterns total.
- **2.8.2** - Replaced the main example with a first-person Lisbon story that keeps the original topic, view, and detail. 33 patterns total.
- **2.8.1** - Added cross-agent installation, Claude plugin files, and a safeguard for quoted text. 33 patterns total.
- **2.8.0** - Added patterns #31-33 and expanded pattern #20 to catch chatbot offers. 33 patterns total.
- **2.7.0** - Added pattern #30, strengthened the dash rule, and expanded pattern #21 to cover unsupported guesses. 30 patterns total.
- **2.6.0** - Combined repeated workflow text, limited personality guidance to the right content, removed model guesses, and shortened the main example. 29 patterns total.
- **2.5.1** - Added passive voice and missing subjects. 29 patterns total.
- **2.5.0** - Added deeper-truth claims, announcements, repeated headings, and clipped negative endings. Tightened the dash rule and corrected the frontmatter. 28 patterns total.
- **2.4.0** - Added writing-sample matching.
- **2.3.0** - Added hyphenated word pairs.
- **2.2.0** - Added a draft check and second rewrite.
- **2.1.1** - Corrected the curly-quote example.
- **2.1.0** - Added before/after examples for all 24 patterns.
- **2.0.0** - Rewrote the skill from the Wikipedia source.
- **1.0.0** - First release.

</details>

## License

MIT
