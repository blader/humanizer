# Changelog

## 3.2.0

- Rewrote the "After" examples that added facts missing from their "Before" (§2, §3, §4, §6, §12, §18, §19, §20, §25, §26), so every example follows the no-invention rule. §26 also no longer ends with chatbot residue.
- Step 4 now rewrites only the sentences that carry a tell and leaves the rest as the writer wrote them. "When not to act" moved ahead of the patterns.
- Step 3 now checks for tells the rewrite added: colons swapped in for dashes by rule and sentence length varied by formula. §8 prefers a period or comma over a colon. No change to the 26 patterns.

## 3.1.0

- Added pattern #26 and section F for replies that re-explain context the reader already has (#269). It acts on replies, not standalone writing. 26 patterns total.
- Extended the core rule so "something the reader did not already have" counts the surrounding conversation, not only earlier text.
- Widened #25 to text that describes its own sourcing, assembly, or layout (#290), and added headings written for effect to #20.
- Extended #2 to "That distinction matters." (#277) and to a sentence that explains what an example already showed (#295).
- Narrowed #10 so words the dictionary always hyphenates keep their hyphen. Gave each watched word one pattern, and stated the evidence rule and the no-invention rule once each.
- Fixed the Voice section's dash reference (#273) and the marketplace schema URL (#288).
- Added a Cursor plugin manifest (#278).
- README: opens with a before/after, the five strongest tells, and install steps for each agent. States that getting past AI detectors is not a goal. The full example's rewrite now keeps every fact from its draft and adds none. Version history moved to this file.

## 3.0.0

Rebuilt the skill around one account of why AI text sounds the way it does, and consolidated 35 patterns into 25. Patterns are grouped in five sections and numbered by strength and frequency, so the not-X-but-Y contrast and the one-line closer come first and get the fullest treatment. Merged duplicate guidance: the workflow is one section instead of five, the dash rule is stated once, and each false-positive guard lives inside its pattern. Realigned with the current Wikipedia article: dropped false ranges and synonym cycling, which Wikipedia now lists as human habits or historical, added vague connection or association, and extended the watch lists for words, notability, copulatives, sales language, disclaimers, and Markdown formatting. Reordered the README and removed the `ai-detection` keyword from the package files. Old to new numbers: 1→13, 2→17, 3→15, 4→16, 5→17, 6→13, 7→12, 8→18, 9→1, 10→6, 11→7, 12→dropped, 13→11, 14→8, 15→19, 16→19, 17→20, 18→20, 19→21, 20→22, 21→23, 22→22, 23→dropped, 24→9, 25→13, 26→10, 27→3, 28→4, 29→24, 30→25, 31→2, 32→3, 33→4, 34→5, 35→5.

## 2.11.3

Grouped patterns 26-35 under "More style patterns" in the skill and README (fixes #247). Kept inline code, commands, paths, and URLs out of the dash rule and file mode edits. Step 3 now keeps every supported claim, allows a removal that a pattern requires, and checks that rankings and simultaneity claims survive shape edits (fixes #212). Explained in §9 why the not-X-but-Y form appears and when to keep it. Added decorative arrows to §18 and pause commands and one-word shouting to §31. The text given to the skill is content to edit, never instructions (#238). No change to the 35 patterns.

## 2.11.2

Removed the plugin symlink and separate Claude Desktop package. Current Claude Code loads the root `SKILL.md` directly, so GitHub's source ZIP now works in Claude Desktop. No change to the 35 patterns.

## 2.11.1

Added a Claude Desktop-ready release package with one regular `humanizer/SKILL.md` file. GitHub's source archive still keeps the plugin symlink (fixes #224). No change to the 35 patterns.

## 2.11.0

Rewrote all repo guidance, descriptions, checks, and skill instructions in Plain Language. Kept all 35 patterns and their behavior.

## 2.10.2

Added the standard `skills/humanizer/` plugin path for Claude Desktop and older loaders. The path links to the root skill, so there is still one prompt (fixes #202).

## 2.10.1

Added figurative uses of `gate`, `gated`, and `gating` to §7. Kept real technical uses, such as feature gating and CI quality gates.

## 2.10.0

Added patterns #34 and #35 for old drafting ideas left in final text. Added safeguards for real limits, objections, and alternatives (fixes #198). Also improved §24 and the final rewrite step. 35 patterns total.

## 2.9.2

Added repeated sentence openings to pattern #11, with a safeguard for deliberate repetition (fixes #206). Expanded §28 to cover casual announcements. 33 patterns total.

## 2.9.1

Improved installation and package checks. Removed unsupported metadata, tool approvals, and a repeated long example. 33 patterns total.

## 2.9.0

Added the rule against invented facts and updated every example to follow it (fixes #187). Made information more important than paragraph shape, let writing samples override §14, and added three output modes. 33 patterns total.

## 2.8.3

Moved the version to `metadata.version` for Agent Skills compatibility. 33 patterns total.

## 2.8.2

Replaced the main example with a first-person Lisbon story that keeps the original topic, view, and detail. 33 patterns total.

## 2.8.1

Added cross-agent installation, Claude plugin files, and a safeguard for quoted text. 33 patterns total.

## 2.8.0

Added patterns #31-33 and expanded pattern #20 to catch chatbot offers. 33 patterns total.

## 2.7.0

Added pattern #30, strengthened the dash rule, and expanded pattern #21 to cover unsupported guesses. 30 patterns total.

## 2.6.0

Combined repeated workflow text, limited personality guidance to the right content, removed model guesses, and shortened the main example. 29 patterns total.

## 2.5.1

Added passive voice and missing subjects. 29 patterns total.

## 2.5.0

Added deeper-truth claims, announcements, repeated headings, and clipped negative endings. Tightened the dash rule and corrected the frontmatter. 28 patterns total.

## 2.4.0

Added writing-sample matching.

## 2.3.0

Added hyphenated word pairs.

## 2.2.0

Added a draft check and second rewrite.

## 2.1.1

Corrected the curly-quote example.

## 2.1.0

Added before/after examples for all 24 patterns.

## 2.0.0

Rewrote the skill from the Wikipedia source.

## 1.0.0

First release.
