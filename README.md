# Humanizer

sponsored by [cfo.ai](https://cfo.ai/?utm_source=github&utm_medium=sponsorship&utm_campaign=humanizer)

[![GitHub stars](https://img.shields.io/github/stars/blader/humanizer?style=flat)](https://github.com/blader/humanizer/stargazers) [![skills.sh installs](https://skills.sh/b/blader/humanizer)](https://skills.sh/blader/humanizer)

Humanizer makes AI-written text sound like a person wrote it, without changing what it says. It has two parts:

- A skill that rewrites text when you ask. Run `/humanizer` in Claude Code, Codex, or any other agent that supports skills.
- Hooks that come with the Claude Code plugin. Installing the plugin enables them in your Claude Code settings. From then on, Claude Code checks everything Claude writes, in every session and project: prose files, chat replies, and thinking. Text with AI tells goes back to Claude for a rewrite. You can turn the hooks off in [Configuration](#configuration).

The patterns come from Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), the guide Wikipedia editors use to catch AI-generated text.

Here is a product announcement before and after a rewrite:

**Before:**
> I'm thrilled to announce that shared drafts are finally here! 🚀 For months, our own team was drowning in files named final_v7.docx — and we knew there had to be a better way. Now two people can edit the same doc at once, with every change appearing live for both of them. It's not just a feature; it's a whole new way to collaborate. Comments stay anchored to the exact sentence they reference, even as the text around them evolves. And the best part? It's available today on every plan, completely free. Let that sink in.

**After:**
> Shared drafts are here. For months, our own team kept losing track of files named final_v7.docx, and we wanted a better way to work on one document together. Now two people can edit the same doc at once, and each of them sees the other's changes as they happen. Comments stay attached to the sentence they refer to, even when the text around that sentence changes. Shared drafts are available today and free on every plan.

In a blind test of an earlier rewrite of this text, judges preferred Humanizer's version 16 times out of 16 ([#229](https://github.com/blader/humanizer/issues/229)).

## Status

Humanizer is active. The current release is 4.0.0, and [CHANGELOG.md](CHANGELOG.md) lists the changes made since.

Humanizer edits for human readers. It does not try to get past AI detectors, and detectors still flag most of its output.

## The five strongest tells

These are the most common signs of AI writing. Humanizer rewrites any of them on sight:

1. **Not X but Y:** "It's not just a feature, it's a shift."
2. **One-line closers:** "Let that sink in."
3. **Sayings that sound deep:** "At its core, what really matters is..."
4. **A staged run-up:** "Here's the thing." "Honestly?" "The hard part is..."
5. **Arguing with no one:** "I'm not saying X, but..."

They are the first five of the [26 patterns](#the-26-patterns) Humanizer checks.

## Requirements

You need an agent that supports skills, such as Claude Code, Codex, pi, or Claude.ai. Some install paths need more:

- The Claude Code plugin needs Claude Code 2.1.142 or newer. Its hooks need `python3` on your `PATH`; without it, they let text through unchecked.
- The `npx skills` installs need Node.js with `npx`.

## Installation

Pick the section for your agent. After you install, run the skill with `/humanizer`.

### Claude Code

```text
/plugin marketplace add blader/humanizer
/plugin install humanizer@humanizer
```

The plugin installs the skill and the hooks described in [Configuration](#configuration). To check that the hooks loaded, start a new session and run `/hooks`. You should see `SessionStart`, `UserPromptSubmit`, `PreToolUse`, and `Stop` entries that run `scripts/humanizer-hook.py`.

On Claude Code older than 2.1.142, run `npx skills add blader/humanizer --global --agent claude-code` instead. That command installs the skill without the hooks.

### Codex

```bash
npx skills add blader/humanizer --global --agent codex
```

### pi

```bash
pi install git:github.com/blader/humanizer
```

Add `-l` to install it only in the current project. `pi update --extensions` pulls new versions.

### Claude.ai and Claude Desktop

Download this repository as a ZIP (**Code → Download ZIP**) and upload it as a skill in Settings.

### Other agents

```bash
npx skills add blader/humanizer --global --agent '*'
```

This command installs Humanizer for every agent the Skills CLI supports, including Gemini CLI, GitHub Copilot, and Windsurf. To install for the current project only, leave out `--global` in any `npx skills` command above. For an agent the Skills CLI does not cover, copy `SKILL.md` into its skill folder.

## Usage

Call the skill and paste your text:

```text
/humanizer

[paste your text here]
```

You can also ask in plain language:

```text
Please humanize this text: [your text]
```

To rewrite a file, give its path:

```text
Humanize the prose in docs/launch-post.md
```

Humanizer reads the whole file before it edits, even a file it wrote earlier in the session. Its summary says how many sections it reviewed and names any it could not cover.

### Match your voice

To make the rewrite sound like you, add a sample of your own writing:

```text
/humanizer

Here's a sample of my writing for voice matching:
[paste 2-3 paragraphs of your own writing]

Now humanize this text:
[paste AI text to humanize]
```

Humanizer then follows the sample's rhythm, word choice, punctuation, and quirks, including dashes if you use them.

## Configuration

The skill itself has no settings. The Claude Code plugin adds hooks that apply Humanizer even when the agent does not call the skill. The `npx skills` and ZIP installs do not include them.

Each hook covers one kind of text:

| Text | Hook | What happens |
| --- | --- | --- |
| Prose files (`.md`, `.mdx`, `.markdown`, `.txt`, `.rst`, `.adoc`) | `PreToolUse` on `Write`, `Edit`, `MultiEdit` | Claude Code blocks a write with AI tells until Claude rewrites it. |
| Chat replies | `Stop` | The hook sends a reply with AI tells back, and Claude posts a rewritten reply. You see both. |
| Thinking | `SessionStart`, `UserPromptSubmit`, `Stop` | The hooks add the rules to Claude's context each session and each prompt. They report tells in stored thinking at the next prompt. |

Hooks can steer thinking, but they cannot rewrite it. Claude Code also often stores thinking without its text, and then the `Stop` hook has nothing to check.

### Scoring

The hooks decide with [`scripts/humanizer-lint.py`](scripts/humanizer-lint.py), which scores text from 0 to 1. It treats each tell from `SKILL.md` as a weighted feature, like a small linear model:

- One-sighting tells flag the text alone: §1 to §5, §8 dashes, §22 chatbot residue, and §23 disclaimers.
- Weaker signals flag the text only together. Examples are stock AI words such as "delve", triads, bold labels, and flat sentence rhythm.
- Texts under 20 words are flagged only for one-sighting tells.
- The scorer skips code, URLs, blockquotes, and quoted phrases, so text that discusses a pattern passes.

You can run the scorer yourself on a file, or pipe text to it for a JSON report:

```bash
python3 scripts/humanizer-lint.py docs/launch-post.md
```

### Turn the hooks off

Set `HUMANIZER_HOOK` to `off`. To do that for one project, add it to the project's `.claude/settings.json`:

```json
{ "env": { "HUMANIZER_HOOK": "off" } }
```

This repository does that for itself, because `SKILL.md` lists every tell and would trip the hooks.

## How it works

A language model writes whatever is most likely to come next. Its default is the choice that fits the widest range of readers and subjects. A person chooses for one reader and one subject instead.

Every tell Humanizer looks for is one form of that default:

- A sentence that signals importance instead of adding a fact.
- Rhythm or formatting applied by rule.
- An ordinary fact dressed as a pivotal one.
- Text left over from the chat.
- A reply that re-explains what the reader already knows.

> "LLMs use statistical algorithms to guess what should come next. The result tends toward the most statistically likely result that applies to the widest variety of cases."
> Wikipedia, ["Signs of AI writing"](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)

To rewrite, Humanizer first marks every tell it finds, strongest first. It drafts a new version, merging, splitting, or reordering sentences as needed, and checks it against the patterns and the original claims. Only then does it write the final version. Where the text is generic, it adds a specific detail it knows to be true, and it keeps every claim the original made.

With pasted text, you see the first rewrite, a short list of tells that survived it, and the final version. With a file, Humanizer edits only the prose and leaves code, data, frontmatter, and link targets alone.

Humanizer also adjusts to the kind of writing. Personal writing keeps the writer's opinions and quirks, and technical prose stays neutral and plain. Informal human text, such as chat messages and angry reviews, stays as it is unless two unrelated tells appear together. Even then, the writer's anger keeps its full strength.

## The 26 patterns

Humanizer numbers the patterns from strongest and most common to weakest. It edits any of the first five on one sighting. It acts on a pattern marked *weak alone* only when other tells appear in the same passage. A careful writer may use any one of them on purpose.

### A. Staging instead of stating

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 1 | **Not X but Y** | "It's not just X, it's Y", "This doesn't mean X. It means Y." | State the point directly |
| 2 | **One-line closers and dramatic fragments** | "That is the real win." after every section; "This shows the importance of..." after an example; "No prior. No nostalgia." | Cut the closer that repeats or explains the example; merge fragments into a specific claim |
| 3 | **Sayings that sound deep** | "At its core, what matters is...", "Symmetry is the language of trust" | Replace the saying with the specific claim |
| 4 | **Staged run-up before the point** | "Let's dive in", "Honestly? It depends...", "The hard part is...", "the part that doesn't" | Remove the run-up and state the point; name what "the part" stands for |
| 5 | **Arguing with no one** | "This isn't mainly about...", "A tempting approach would be..." | Remove the unraised objection or fake option; keep any real claim |

### B. Rhythm by rule

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 6 | **Forced triads** | "innovation, inspiration, and insights"; three examples plus a lesson | Use the number of items the meaning needs |
| 7 | **Repeated sentence openings** | "She noted... She noted... She filed..." | Merge the sentences or change the subject |
| 8 | **Dashes as the universal connector** (*weak alone*) | "institutions—not the people—yet this continues—" | Use periods, commas, colons, or parentheses; match a sample that uses dashes |
| 9 | **Stacked qualifiers** (*weak alone*) | "could potentially possibly be argued" | Keep only qualifiers the source supports |
| 10 | **Hyphenated pairs everywhere** (*weak alone*) | "the report is high-quality" | Keep the hyphen before the noun or where the dictionary always uses one |
| 11 | **Passive voice and missing subjects** (*weak alone*) | "No configuration file needed" | Name the actor when that makes the action clearer |

### C. Inflation and borrowed authority

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 12 | **Overused AI words** | "delve... testament... landscape... showcasing" | Use plain words |
| 13 | **Inflated significance** | "marking a pivotal moment", "Despite challenges... continues to thrive", "The future looks bright" | Keep the fact and drop the significance; end on the last concrete fact |
| 14 | **Vague connection or association** | "associated with the leadership of", "in connection with" | Name the relationship if you know it |
| 15 | **Shallow -ing phrases** | "symbolizing... reflecting... showcasing..." | Keep only what the source supports |
| 16 | **Sales language** | "nestled within the breathtaking region" | State what the thing is |
| 17 | **Borrowed authority** | "Experts believe...", "cited in NYT, BBC, FT, and The Hindu" | Name a real source and what it said, or remove the claim or list |
| 18 | **Avoiding is, are, and has** | "serves as... features... boasts" | "is... has" |

### D. Formatting by rule

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 19 | **Bold as decoration** | "**OKRs**, **KPIs**"; "**Performance:** Performance improved" | Remove the bold; turn a labeled list into prose |
| 20 | **Decorative headings** | "Strategic Negotiations And Partnerships", "🚀 Launch Phase:", "The decision, on one screen" | Sentence case; remove emojis and arrows; name what the section holds |
| 21 | **Curly quotation marks** (*weak alone*) | `said “the project”` | `said "the project"` |

### E. Leftovers from the chat and the draft

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 22 | **Chatbot residue** | "Great question! ... I hope this helps!" | Remove the wrapper and keep the content |
| 23 | **Knowledge-limit disclaimers and guesses** | "While details are limited in available sources, it appears..." | State what the source does not show, or cut the sentence |
| 24 | **A heading repeated in the first sentence** | "## Performance" + "Speed matters." | Let the heading do the work |
| 25 | **Writing about the document instead of its subject** | "This function was added to replace...", "compiled from...", "The table below compares..." | Describe the subject; state a convention only when the reader cannot infer it |

### F. Writing for the wrong reader

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 26 | **Re-explaining what the reader knows** | A reply that walks the diagnosis and proves the plan works before the decision | Lead with the decision; leave the diagnosis and the proof for the ticket that follows |

## Full example

**Before (AI-sounding):**
> I recently spent five unforgettable days in Lisbon last October, and let me tell you — this city completely stole my heart. From the moment I checked into my charming hotel perched high in the historic Alfama district, I knew I was somewhere truly special.
>
> Yes, the famous hills are challenging — with countless stairs between my hotel and everything else, my legs certainly felt it! — but every climb rewards you with breathtaking, panoramic views that make it all worthwhile.
>
> No trip would be complete without riding the iconic Tram 28, a roughly forty-minute journey shared with plenty of fellow travelers eager to capture the magic. And the food? Simply divine. While the pastéis de nata at Pastéis de Belém are a beloved national treasure, my absolute favorite came from a hidden gem in Graça, still warm from the oven.
>
> But what truly makes Lisbon special isn't just the sights — it's the feeling. Wander just a block or two above the main squares and you'll discover a quieter, more authentic side of the city, inviting you to slow down and savor every moment.
>
> Of course, the must-see São Jorge Castle offers stunning views over the rooftops below. The queues can be long, but the experience is absolutely worth it for any history buff or curious traveler.
>
> Would I go back? Absolutely — next time in spring, and with better shoes! Lisbon isn't just a place to visit; it's a place to fall in love with, again and again. ✨

**After:**
> I spent five days in Lisbon last October and loved it. My hotel was high up in the Alfama district, and I liked the place from the day I checked in.
>
> The hills are hard work. There were a lot of stairs between my hotel and everything else, and my legs felt every one of them. The views from the top make up for it, though, and you get one after almost every climb.
>
> I rode Tram 28, which takes about forty minutes and was full of other tourists holding up their phones. The food was excellent. Everyone goes to Pastéis de Belém for pastéis de nata, and theirs are good, but my favorite came from a place in Graça, still warm from the oven.
>
> What I liked most was how quickly the city calms down. Walk a block or two uphill from the main squares and the crowds thin out and the streets go quiet, so you can take your time.
>
> I also went to São Jorge Castle, which has a great view over the rooftops. The line was long, but if you like history, it's worth the wait.
>
> I'd go back. Next time I'll go in spring, and I'll bring better shoes.

## Testing

Before you publish a change, run the package checks:

```bash
python3 scripts/validate-package.py
python3 -m unittest discover -s tests
npx skills add . --list
claude plugin validate .
```

A passing run prints `Humanizer package v4.0.0 is valid` from the validator and `OK` from the tests. [AGENTS.md](AGENTS.md) lists the rules a change must follow.

## Support

- Report a missed tell with the **New tell** issue form.
- Report a rewrite that kept a tell, changed the meaning, or over-edited with the **Rewrite problem** issue form.
- Ask questions in [Discussions](https://github.com/blader/humanizer/discussions).

Open both forms from [Issues](https://github.com/blader/humanizer/issues/new/choose).

## Sources

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) is the source for the pattern list.
- [WikiProject AI Cleanup](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup) maintains the page.
- El Attar, Dönmez, Maurer, and Falenska, ["A Systematic Analysis of Linguistic Features in AI-Generated English Text Detection Across Domains and Models"](https://arxiv.org/abs/2606.04177) (2026) is the source for the caution that most signals change with the model and the text type.
- Kobak et al., ["Delving into LLM-assisted writing in biomedical publications through excess vocabulary"](https://arxiv.org/abs/2406.07016) (2025), and Reinhart et al., ["Do LLMs write like humans?"](https://arxiv.org/abs/2410.16107) (2025), are the sources for the scorer's word weights.

## Version history

See [CHANGELOG.md](CHANGELOG.md).

## License

Humanizer is released under the [MIT License](LICENSE).

If Humanizer helps you, a star helps other people find it.
