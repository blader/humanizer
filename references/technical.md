# Artifact-specific rules

Conventions for each technical artifact Plainspeak targets. Identify the artifact first, then apply its conventions on top of the general phrase and structure rules. When a general rule conflicts with a convention here, the convention wins (this is the core override applied to genre).

The principle summaries behind these conventions (Google developer docs, NumPy/pandas, model cards, Tufte) are in [sources.md](sources.md).

## Docstrings and API documentation

- Open with a one-line summary in the imperative or third-person present: "Compute the weighted interval score." or "Computes the weighted interval score." Match the surrounding codebase; do not mix.
- Describe what the function does and its contract (parameters, returns, raises, side effects), not how it is implemented internally.
- Do not narrate history or the diff. No "this replaces the old approach". The current behavior is the documentation.
- Omit types from prose when type hints already carry them (per NumPy style and the user's house rule): the signature is the source of truth.
- Cut booster adjectives: a function is not "powerful", "robust" (unless statistically robust), "flexible", or "seamless". State what it does.
- Keep examples runnable and minimal. One clear example beats three decorative ones.

Before: "This powerful helper provides a robust, flexible way to seamlessly handle missing data."
After: "Fill missing values using the given strategy ('mean', 'median', or 'most_frequent')."

## READMEs and installation guides

- Lead with what the tool is and does in one or two sentences. No "In today's fast-paced world" opener.
- Installation and usage are task-first and use direct address ("Clone the repo", "Run `pytest`"). Second person is conventional here; "you" is fine.
- Use present tense for behavior ("the parser returns a DataFrame"), imperative for instructions.
- Cut promotional language: not "blazing-fast", "production-grade", "battle-tested" unless backed by a number or benchmark.
- Code blocks stay verbatim. Do not rewrite commands or output.

## Methods sections

- Passive voice is conventional and correct. "Samples were incubated", "Models were fit with Stan", "Reads were aligned with BWA-MEM (v0.7.17)". Do not convert these to active.
- Past tense for what was done. Be specific: name software, versions, parameters, datasets, sample sizes.
- Cut filler ("In order to assess..." -> "To assess..."), but keep every methodological detail. Reproducibility outranks brevity here.
- No significance inflation about the method's importance; that belongs (sparingly) in the introduction or discussion.

## Results sections

- Use "we" for what you did with the data: "We fit", "We observed", "We compared". Avoid false agency ("the data revealed", "the results emerged").
- Report numbers with their uncertainty: point estimate, interval, and the metric. "Mean WIS was 0.42 (95% CI 0.38 to 0.46)."
- State what happened, not what it means; interpretation belongs in the discussion.
- Keep every number, unit, CI, p-value, and n exactly as given.

## Discussion and limitations

- Name actors and interpret. Active voice is clearer here than in methods.
- Replace the "despite these challenges" formula with specific limitations and their consequences for the conclusion. "Our two-season window includes only post-COVID influenza dynamics, so the calibration estimates may not transfer to typical seasons."
- Keep genuine uncertainty; cut decorative hedging. "Underpowered for the interaction term" is a real claim.
- No grandiose stakes inflation and no generic positive conclusion. End on a specific implication or next step, not "exciting times lie ahead".

## Abstracts

- One claim per sentence; no throat-clearing. The first sentence states the problem or the finding, not "In recent years...".
- Keep the quantitative result in the abstract: the effect size, the metric, the comparison.
- No citations unless the venue requires them; no "this paper serves as".
- Density matters most here. Every word competes for a strict word budget.

## Figure captions and table notes

- State what the figure shows, then how to read it. "Mean WIS by forecast horizon for each model. Lower is better." (Tufte: the caption reports the evidence, it does not decorate it.)
- Define axes, units, error bars, and n. "Error bars are 95% bootstrap CIs (1,000 resamples)."
- No interpretive padding in the caption ("strikingly, the model excels"); let the reader read the figure.
- Present tense, sentence fragments are acceptable and conventional for captions.

## Model cards and dataset cards

- Follow the transparent-disclosure structure: intended use, out-of-scope use, training data, evaluation, limitations, ethical considerations.
- Limitations must be concrete and honest: name the populations, distributions, or conditions where the model underperforms. No "despite these limitations, the model performs well".
- Report evaluation with the metric, the dataset, and the number. No vague "achieves strong performance".
- Do not inflate intended use or downplay risk. The card's value is candor.

## Data dictionaries and dataset descriptions

- One row per field: name, type, units, allowed values or range, and meaning. Be exact about units and encodings (is `temp` Celsius or Fahrenheit; is `missing` coded as NA, -999, or empty).
- Describe provenance: source, collection method, date range, known gaps.
- No prose padding. A data dictionary is reference; terseness is correct.

## Notebook narration (markdown cells)

- State what the next cell does and why, in plain present tense. "Load the cohort and drop rows with missing outcome."
- No tutorial-voice signposting ("Now let's dive into the fun part!"). One line of context is usually enough.
- Keep it honest about exploratory steps: "Quick check; not used downstream" beats dressing a scratch cell as a result.
- Conclusions in a notebook still need the number and the caveat, not "the results look great".

## Commit messages

- Subject line: imperative mood, concise, no trailing period. "Fix off-by-one in horizon indexing".
- Body (when the "why" is not obvious): explain the reason for the change and any consequence, wrapped prose. This is one place where describing the change is correct, not diff-anchored: commit messages are version-scoped by definition.
- No AI attribution or "Co-Authored-By" lines (house rule).
- Do not pad. If the change is self-explanatory, the subject line is enough.

## PR descriptions

- Lead with what the PR does and why, in one short paragraph. Then context, testing, and anything a reviewer must know.
- Link issues and prior discussion instead of restating them.
- No promotional framing ("this massively improves..."); state the measured effect if there is one.
- Checklists and test notes are fine and useful; keep them concrete.

## Changelogs, release notes, migration guides

- These are legitimately version-scoped, so diff-anchored writing is correct here: describe what changed, what was added, removed, or deprecated.
- Group by Added / Changed / Fixed / Removed (Keep a Changelog style) or the project's convention.
- Be specific about breaking changes and the migration path. "Renamed `score()` to `weighted_interval_score()`; update call sites."
- Past tense or imperative per the project's convention; stay consistent.

## Code comments and inline documentation

- Explain why, not what, when the code already shows what. "Clamp to avoid log(0)" beats "set x to epsilon".
- Describe current intent, not history. Not "used to use a loop here"; that belongs in version control.
- Keep TODO/FIXME/NOTE markers if the project uses them; they are signal, not slop.
