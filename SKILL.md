---
name: plainspeak
version: 0.1.0
description: |
  Rewrite scientific, technical, and data-science prose into plain, precise
  language. Use for docstrings, READMEs, methods/results/discussion sections,
  abstracts, figure captions, model cards, data dictionaries, notebook
  narration, commit messages, PR descriptions, and any technical prose that
  needs AI tells removed without losing domain meaning. Trigger on "plainspeak",
  "plain technical prose", "deslop technical writing", "make this less AI", or
  similar requests.
license: MIT
compatibility: claude-code opencode
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

# Plainspeak: Plain, Precise Technical Prose

Strip AI tells from scientific, technical, and data-science writing without flattening domain terminology or forcing blog voice into reference text. The goal is prose that reads like a careful domain expert wrote it: direct claims, exact terms, no padding, no manufactured personality.

This is not general humanizing. For essays, opinion, and blog voice, use the broader `humanizer`/`deslop` skill. Plainspeak's contract is plain technical prose, and neutral *is* the correct human voice for reference text.

## The contract

Plainspeak rewrites prose to be:

- **Direct.** State the claim before the framing. Lead with the subject and verb.
- **Precise.** Keep exact technical terms, units, metrics, citations, numbers, and caveats. Domain terminology is precision, not jargon.
- **Dense.** Cut filler, hedging, throat-clearing, and repeated summaries.
- **Context-aware.** Methods sections may use passive voice; results and discussion should name actors when it clarifies responsibility.
- **Neutral when appropriate.** Reference prose gets no blog voice, first-person performance, or manufactured personality.
- **Honest about uncertainty.** Keep real uncertainty; cut decorative hedging.

**Core override:** clarity and correctness beat rule-following. Never mangle a sentence just to remove a pattern, and never flatten a precise technical term to satisfy an anti-jargon rule.

## Core rules

These six rules are the spine. They paraphrase Orwell's "Politics and the English Language" (1946), mapped onto AI-tell fixes.

### 1. Kill stale figures of speech

Cut dead metaphors and ornate nouns doing no work: "tapestry", "landscape" (for a field), "navigate the challenges", "at the intersection of", patronizing "think of it as" analogies. If a concept needs a name, define it; do not invent a label ("the supervision paradox") and use it as if established. See [references/phrases.md](references/phrases.md).

### 2. Use the short word

Replace inflated vocabulary with plain words: utilize -> use, leverage -> use, facilitate -> help, enhance -> improve (or name the improvement), demonstrate -> show. Replace the "serves as" dodge with "is"/"has". See [references/phrases.md](references/phrases.md).

### 3. Cut every word that earns nothing

Remove filler, throat-clearing openers, emphasis crutches, hedging stacks, and fractal summaries ("In this section we will... as we have seen..."). "In order to" -> "To". "It is important to note that the data shows" -> "The data shows". See [references/phrases.md](references/phrases.md).

### 4. Prefer the active voice with a named actor

Use active constructions with real subjects. Replace false agency ("the data tells us", "the results emerged") by naming who did the work. **Exception:** passive voice in a methods section is conventional ("Samples were incubated at 37C") and should stay. Flag passive only when it hides an actor in results or discussion. See [references/structures.md](references/structures.md).

### 5. Avoid jargon, but domain terms are not jargon

Cut business jargon and AI vocabulary. **Carve the exception explicitly:** real domain terms carry methodological meaning and are precise, not slop. Preserve WIS, MCMC, cross-validation, calibration, bootstrap, posterior, mixed model, sensitivity analysis, and their kin. Never simplify a technical term into a vague everyday word.

### 6. Break any rule before writing something unclear or wrong

The override valve. If applying a rule would distort a claim, lose a citation, or mangle a sentence, do not apply it.

## Structural and formatting tells

- **No negative parallelism.** "It's not X, it's Y" / "not because X, but because Y". State Y directly.
- **No false ranges.** "From X to Y" where X and Y are not on a real scale. List the items.
- **No dramatic fragmentation** or staccato stacking for emphasis.
- **No rule-of-three padding** or anaphora ("We will develop... We will apply... We will validate...").
- **No diff-anchored docs.** Describe the thing as it is, not what it replaced, except in changelogs, release notes, and migration guides.
- **No formatting tells.** No em or en dashes, no bold-first bullets, no emojis decorating headers, no title case headings, no curly quotes, no signposted conclusions.

Detail and fixes: [references/structures.md](references/structures.md). Artifact-specific conventions: [references/technical.md](references/technical.md).

## Technical register (this replaces personality coaching)

Plainspeak does not inject voice. For technical and reference text, plain and neutral is the human voice, and adding opinions or first-person performance is itself an AI tell.

- **Match the artifact, not a persona.** A docstring sounds like a docstring; an abstract sounds like an abstract. Infer the type from the input.
- **"We" for your own work** in scientific prose; cite specific authors instead of "researchers have shown". Use "you" only where direct address is conventional (task-first documentation).
- **Voiceless is not the goal, but neutral is not voiceless.** A precise, well-ordered technical sentence already sounds like a competent human. Do not manufacture personality to avoid sterility.
- **Avoid both extremes:** the distant narrator ("It has long been recognized that...") and the casual blog voice ("Here's the thing about MCMC").

## Scientific and data-science exceptions

- Passive voice in methods is conventional and fine.
- Keep numbers, confidence intervals, p-values, units, software versions, dataset names, and citations intact unless the user asks for substantive editing.
- Prefer specific authors, datasets, models, tools, or metrics over vague authorities.
- Cut unsupported claims instead of inventing support. If a source is not known, say so or cut the sentence; do not write plausible filler.

## Quick checks

Run before delivering:

- Inflated vocabulary (utilize, leverage, delve, robust, showcase)? Use the plain word.
- "serves as" / "stands as" / "represents" meaning "is"? Use "is".
- Filler transition ("It's worth noting", "In order to")? Cut or shorten.
- Passive voice hiding an actor outside a methods section? Name the actor.
- Negative parallelism ("not X, it's Y")? State Y.
- False range ("from X to Y")? List the items.
- "-ing" tail injecting shallow analysis ("highlighting its role")? Cut or make a real claim.
- Rule-of-three or anaphora padding? Use the natural number of items; vary openings.
- Em dash, en dash, curly quote, bold-first bullet, emoji, title-case heading? Remove.
- A domain term flattened into a vague word? Restore the term (rule 6).
- Numbers, units, citations all intact? Confirm.

## Detection guidance

### What NOT to flag (false positives)

- Perfect grammar and consistent style. Professionals and edited writers exist.
- Formal or academic vocabulary. AI overuses *specific* words, not all precise ones. Do not flatten "ostensibly" or "heteroscedastic".
- Domain terminology. WIS, MCMC, posterior predictive check: precision, not jargon.
- Passive voice in a methods section. Conventional.
- One "however" or one em dash in isolation. Look for clusters, not single tells.
- Curly quotes alone. Word and editors auto-curl by default.

A single tell means little. A cluster (significance inflation plus rule-of-three plus "vibrant tapestry" plus a "Conclusion" section) is the confession.

### Signs of human/expert writing (preserve these)

- Specific, hard-to-fabricate detail: a real dataset version, an exact metric, a named tool.
- Precise hedging that reflects genuine uncertainty ("underpowered for the interaction term").
- Variety in sentence length and structure.
- Genuine asides, caveats, and self-corrections.
- Correct, consistent use of a domain convention (NumPy docstring sections, CONSORT terms).

## Process and output

1. **Identify** the artifact type and audience.
2. **Preserve** claims, terminology, citations, numbers, and constraints.
3. **Rewrite, don't delete.** Replace AI-isms with plain technical prose. Cover everything the original covers; match its length unless padding is the problem.
4. **Apply** the conventions for the artifact (see [references/technical.md](references/technical.md)).
5. **Audit silently:** ask "what still screams AI here?" and fix it. Check for false positives so precise language is not flattened.
6. **Final scan:** em/en dashes, curly quotes, bold-first bullets, flattened domain terms. Any hit means the draft isn't done.

**Output:** the rewritten prose first, then a brief change note (2-4 bullets) when it helps. Keep the audit loop internal; do not print it. Do not print a numeric score unless the user explicitly asks for a review or rubric.

### Reference loading

Read reference files by task size:

- Short text (< 2 paragraphs) or a quick fix: the core rules above are enough.
- Medium text or a standard request: read [references/phrases.md](references/phrases.md) + [references/structures.md](references/structures.md).
- An artifact with conventions (docstring, model card, manuscript section, commit): also read [references/technical.md](references/technical.md).
- A long or thorough edit: read all reference files, including [references/examples.md](references/examples.md).

## Reference files

- [references/phrases.md](references/phrases.md): filler, AI vocabulary, the "serves as" dodge, jargon substitutes, formatting-phrase tells.
- [references/structures.md](references/structures.md): negative parallelism, false ranges, fragmentation, anaphora, passive/actor guidance, diff-anchored writing.
- [references/technical.md](references/technical.md): artifact-specific rules for docstrings, docs, manuscripts, model cards, data dictionaries, notebooks, commits, and PRs.
- [references/examples.md](references/examples.md): before/after examples organized by artifact type.
- [references/sources.md](references/sources.md): attribution and principle summaries (humanizer/Wikipedia, deslop/tropes.fyi/stop-slop, Orwell, Google docs, Williams, NumPy/pandas, model cards, Tufte).

## Examples

**Docstring (significance inflation + copula dodge):**

Before:
> "This powerful function serves as a robust solution for seamlessly handling missing values, leveraging a comprehensive suite of imputation strategies."

After:
> "Impute missing values using the chosen strategy (mean, median, or most-frequent)."

**Results paragraph (false agency + passive hiding the actor):**

Before:
> "It was observed that performance degraded at longer horizons, with uncertainty naturally increasing as the prediction window expanded."

After:
> "We found that performance degraded at longer horizons. Each additional week of lead time added roughly 15% to the mean WIS."

**Discussion (filler + "despite these challenges" formula):**

Before:
> "It's worth noting that these findings have important implications moving forward. Despite these challenges, this work contributes meaningfully to the literature."

After:
> "If model rankings are unstable across geography and time, performance-weighted ensembles may not beat equal weighting."
