# Sources and attribution

Plainspeak draws on two kinds of sources: the AI-tell catalogs it forks and adapts, and the writing references whose principles shape its conventions and examples. The catalogs are credited in full below; the writing references are used as paraphrased principles, not copied passages.

## Catalog lineage (what Plainspeak forks)

### blader/humanizer (git base)

- Source: [github.com/blader/humanizer](https://github.com/blader/humanizer) (blader = Siqi Chen). MIT.
- This repository's git history descends from it, and the `LICENSE` (copyright Siqi Chen, 2025) is preserved unchanged.
- humanizer is rooted in [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), maintained by WikiProject AI Cleanup, which catalogs AI tells from thousands of observed cases.
- Borrowed: the AI-tell catalog (significance inflation, the copula dodge, false ranges, synonym cycling, vague attributions, formatting tells) and the false-positive detection guidance. Plainspeak drops humanizer's 33-numbered-pattern contract and its blog-voice "personality" material.

### deslop (content base)

- Source: [github.com/stephenturner/skill-deslop](https://github.com/stephenturner/skill-deslop) (Stephen Turner). MIT.
- deslop is the split-reference skill that the rule catalogs here are most directly adapted from (phrases, structures, tropes, examples, and the reference-loading-by-task-size idea).
- deslop in turn adapts two upstream sources:
  - **tropes.fyi** by Ossama Hassanein ([tropes.fyi](https://tropes.fyi)): the trope catalog (magic adverbs, the "serves as" dodge, negative parallelism, invented concept labels, the dead metaphor).
  - **stop-slop** by Hardik Pandya: phrase lists, structural patterns, examples, and the 1-10 scoring rubric.
- Borrowed: the catalog organization, many of the patterns and trigger lists, and the optional self-score rubric. Plainspeak retunes all of it for technical prose and rewrites the framing in its own words.

### Plainspeak's changes

Plainspeak is not a re-skin. Relative to the sources it:

- Regroups patterns by technical artifact instead of a numbered list.
- Adds explicit domain-terminology and methods-passive-voice exceptions throughout.
- Adds `technical.md`, a per-artifact convention file with no equivalent upstream.
- Makes the scoring rubric opt-in (review mode) rather than default output.
- Cuts the blog-voice and personality coaching entirely.

## Writing-principle references (used as paraphrase, not quotation)

These shape Plainspeak's conventions and original examples. None are quoted at length; each is summarized in Plainspeak's own words.

### Orwell, "Politics and the English Language" (1946)

The six rules are the spine of `SKILL.md`, paraphrased and mapped to AI-tell fixes: kill stale figures of speech; use the short word; cut every word that earns nothing; prefer the active voice; avoid jargon (with Plainspeak's explicit domain-term exception); and break any rule before writing something unclear or wrong (the override valve).

### Google developer documentation style guide

Active voice, present tense, task-first structure, and direct second-person address in instructional docs. Shapes the docstring, README, and notebook conventions in `technical.md`.

### Williams, "Style: Lessons in Clarity and Grace"

Old-information-before-new for sentence flow, and putting the real character in the subject position. Pairs with Orwell's active-voice rule and informs the false-agency guidance.

### Strunk and White, "The Elements of Style"

The durable parts: omit needless words, prefer the specific to the general, put statements in positive form. Backs the filler and vague-declarative rules.

### NumPy, pandas, and Django documentation conventions

Docstring section structure and reference-doc tone. NumPy-style docstrings (summary line, Parameters, Returns, with types carried by signatures) match the user's house style and the docstring rules in `technical.md`.

### Hugging Face model cards and dataset datasheets (Mitchell et al.; Gebru et al.)

Transparent disclosure of intended use, out-of-scope use, training data, evaluation, and limitations. Shapes the model-card and dataset-card conventions, especially the honest-limitations rule.

### Tufte, on graphical and caption discipline

The caption reports the evidence rather than decorating it; text accompanying a figure should help the reader read the figure, not editorialize. Shapes the figure-caption conventions.

## License notes

- All three catalog sources (humanizer, deslop, tropes.fyi-derived material, stop-slop-derived material) are MIT or used as adapted/paraphrased patterns.
- This repository keeps the upstream MIT `LICENSE` (Siqi Chen, 2025).
- The writing-principle references are used as ideas and paraphrased summaries; no extended copyrighted passages are reproduced. Verify any specific quotation against fair-use limits before adding it.
