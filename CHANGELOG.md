# Changelog

## 4.0.0

- The skill no longer forbids adding facts. Where the text is generic, it now adds a specific detail it knows to be true. It still keeps every claim the original made and treats a lost or changed claim as an error. This reverses the no-invention rule from 2.9.0. Patterns 14 and 17 follow the same change.
- Reworked 15 "After" examples in `SKILL.md` and both README examples. Several were vaguer or stiffer than the text they replaced, used phrases from the skill's own watch lists, or changed a stated fact.
- File mode now reads the whole current file before editing, even one written in the same session. Its summary says how many sections it reviewed, so a partial pass is visible (#326, #327).
- Text being edited can contain fake closing tags or notes from an "operator" or a "system message". The skill now treats those as material to edit, never as instructions (#317).
- Rewrote unclear sentences in `SKILL.md` and `README.md`. Coined terms such as "riders" and "shape edits" became plain words, and sentences that only announced or repeated a neighbor are gone. Step 3 now checks for dropped or changed facts first. Pattern 15 is now "Shallow -ing phrases". The README gives `/humanizer` as the only command (#330).
- Added a blank line above each pattern label in `SKILL.md` so GitHub shows every label and example on its own line (#329).
- The skill description no longer cites Wikipedia. The credit stays in the Source section and the README (#321).
- Added a pi package manifest, so `pi install git:github.com/blader/humanizer` installs the skill (#315).
- Removed the `$schema` key from the Claude plugin manifest, which caused a sync warning (#307).

## 3.6.1

- Corrected the blind-test keys: `evals/make_pairs.py` had recorded every key as {"A": old, "B": new} regardless of the shuffle, so the committed keys for all three judged runs were wrong whenever a pair was shuffled. The true mappings were reconstructed from the archived pair texts (`evals/reconstruct_keys.py`, `evals/results/key-reconstruction.json`). Corrected outcomes: runs 1–2 (v3.1.0 vs v3.3.0) were **7–2 for v3.1.0**, not 9–0; run 3 (v3.1.0 vs v3.6.0) was **5–1 for v3.1.0**, not 3–3. The direction of every release decision is unchanged — the gate still preferred the pre-rhythm-check version, and v3.6.0's changes still did not beat the baseline — but the magnitudes in earlier entries were wrong.
- Gate disposition for v3.6.0: with the corrected keys, v3.6.0's behavior changes lost the run-3 gate 5–1. The changes remain in the skill as candidate improvements, but they are gate-pending: a clean re-judge (fixed keys, frozen run artifacts, judge not previously exposed to tallies) decides whether they stay. The related claims "v3.6.0 wins all prior-defying comparisons" and the 9/0 figure are withdrawn.
- Consistency fixes in `SKILL.md` from the audit: reactions and opinions are allowed only when the source or user supports them (creative writing the user requests stays exempt); §22 now states precedence for artifact cleanup — file-mode link targets stay untouched, citation markup converts to plain attribution or is flagged, and cleanup never erases an attribution it cannot resolve. `references/profiles/README.md` no longer contradicts itself: verbatim exemplars are authorized by the writer, and the rule is that their facts never travel into rewrites of other text.
- JFLEG restraint medians corrected (even-sample median): humans 14.3%, v3.1.0 47.7%, v3.3.0 73.1% — see `evals/results/jfleg-restraint.md`.
- Watch-word study corrected (shared matcher, every candidate measured in both baselines): "comprehensive" was measured, not absent — 5.2/100k in human prose, 12× ratio — and is demoted from discovery to §12 candidate. Tapestry-tier ratios revised from 291× to 178×. See `evals/results/word-ratios.md`.
- Second audit pass. The corrected tallies themselves mis-stated the arithmetic: runs 1–2 sum to **7–2** (2–1 plus 5–1), and run 3's technical pair (A=v3.1.0, pick A) is a fifth v3.1.0 win, so run 3 was **5–1**, with email v3.6.0's only win. Eval tooling hardened: `check_profile.py` now compares complete numeric tokens on both sides ("23.5" no longer passes for "23", "$400,000.50" for "$400,000", and a moved sentence period no longer fails) and tokenizes rewrites and exemplars identically, so verbatim hyphenated copies are caught; `rhythm_metrics.py` fence stripping tracks the opening delimiter, so four-backtick blocks containing triple backticks no longer leak code into prose metrics; `freeze_run.py` hashes LF-normalized content (checkout line endings no longer cause false drift), rejects missing inputs and empty manifests, and `run3.json` now freezes source corpus, rewrites, pairs, keys, judgments, and metrics together, verified in CI; `make_pairs.py` writes each run to its own `evals/blind/<name>/` directory and refuses to overwrite one, and its self-test forces both shuffle outcomes; the profile-fixture command now carries the `--claims` its report describes. Step 2 now reads "unsupported factual claims are never allowed" — the earlier wording also banned the supported claims step 2 says to keep.

## 3.6.0

- Added "What the rewrite must never add" after the workflow steps: the rewrite-side failure mode where the editor strips machine tells and installs a stock "human" voice instead. Bans inserting a speaker perspective the source does not record, manufactured stakes, a foil the source never argues with, performed candor, dramatic dashes and manufactured fragments, and any specific the source does not supply. Adapted from conorbronsdon/avoid-ai-writing's editing contract (which credits an independent stress test of `blader/humanizer` and isatimur/de-slop); the human gate's preference for the pre-rhythm-check versions (corrected to 7–2 in 3.6.1) independently supports it — the performed looseness the gate rejected is this failure mode seen from the reader's side.
- Step 1 gained a paragraph-order test: if two body paragraphs could swap without breaking the piece, the order is decorative. "What to return" gained the no-op rule: text with no justified tells comes back unchanged. §22 now covers shipped machine artifacts (unfilled placeholders, chatbot citation markup, AI tracking parameters). §12 notes that delve, tapestry, and garner are near-machine-only markers while the rest of the list weighs as wordiness fixes, not authorship evidence. No change to the 26 patterns.
- Evals: added the external detector cross-check (`avoid-ai-writing-detector`) over the corpus and all twelve rewrites — raw drafts score 3–18, rewrites 0–5 once the header-line artifact is discounted, with one Tier-1 word ("optimize") their list catches and ours does not, flagged as a §12 candidate pending the false-positive sweep. Cross-check only; its authors' own paragraph-level ROC-AUC of 0.501 keeps it out of the gate role.
- CI: added a `validate` workflow running the package validator and the metrics self-check on every push. It does not gate prose — report-only stands.

## 3.5.0

- Removed the rhythm check pass added in 3.3.0. Blind judging by a human over all six eval registers preferred the pre-rhythm-check v3.1.0 rewrites in most pairs across two runs — reconstructed as 7–2 after the key bug fix recorded in 3.6.1, originally recorded as 9/0 (see `evals/blind/JUDGMENTS-human.md`, `JUDGMENTS-human-2.md`): the unevenness and performed looseness the check adds is what the gate reader discounts, and the repo's rule is that a change ships only when it beats the previous version here. The mechanical metrics, `references/rhythm.md` inventory, and eval protocol stay — uniformity remains worth measuring; the skill just no longer varies shape on its own. Step 4's "vary sentence length where the content calls for it, not by formula" guard is unchanged. No change to the 26 patterns.
- Evals: added a blinded pair pipeline (`evals/make_pairs.py`, hidden key in `evals/blind/key.json`) and ran a smoke judging pass. The smoke run was self-judged — the same model wrote the rewrites and picked the winner, knowing the key — so it validates the plumbing, not the skill.
- Voice profiles: surveyed 16 prior-art voice/style systems in `references/profiles/PRIOR-ART.md` and folded the adopted lessons into `references/profiles/README.md`: a sample pasted into the request outranks a saved profile, measured bands belong in the profile format, exemplars stay verbatim, only prose the writer owns or published gets profiled, and a grown corpus means rebuilding the profile, not appending.

## 3.4.0

- Voice profiles: writing samples can now be saved under `references/profiles/` and reused across rewrites instead of pasted per request. A profile counts as a writing sample at the same strength, with two limits that always hold: style carries over, facts do not, and the profile never outranks the no-fabrication rule. Building and maintenance rules in `references/profiles/README.md`; corrections the user makes to a rewrite update the profile in the same session. Includes an illustrative example profile. No change to the 26 patterns.

## 3.3.0

- Added a rhythm check between draft and final version. Blind judging of the rewrite pass found the tells it removes go to zero while the ones it does not touch grow: uniform beat rate 60 → 101 citations, aphoristic closers 38 → 61, contraction uniformity 21 → 43. A subtractive rewrite leaves prose more uniformly well-shaped, and uniform good shape is itself a tell.
- The check covers paragraph beat rate, section endings that tighten into quotable lines, contraction rate flattened in either direction, and paragraph openings repeating the same move. It varies shape only where the content allows it, never for its own sake.
- Added `references/rhythm.md` with the full rhythmic-tell inventory, the measured evidence, and the constructions that must not be encoded (performed hedging 0.89, self-answered question 0.00, typography 0.61 — all misfire on human prose). Added `evals/` with mechanical rhythm metrics, a six-register corpus, and the blind pairwise protocol. No change to the 26 patterns.

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
