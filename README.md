# Plainspeak

A Claude Code skill that makes scientific, technical, and data-science writing clear. Plainspeak cuts padding, keeps the exact terms and numbers, and puts the claim first. The same edits remove the signs of AI writing, so clean prose comes out as a result.

Plainspeak takes its method and its name from Orwell. The core rules paraphrase the six from his "Politics and the English Language" (1946); the name sets plain, truthful prose against the obfuscating Newspeak of *1984*.

Plainspeak is a fork of [blader/humanizer](https://github.com/blader/humanizer) retuned for technical prose. For essays, opinion, and personal writing, use humanizer instead.

## What it is good for

- Docstrings and API documentation
- README and usage sections
- Manuscript sections: methods, results, discussion, and abstracts
- Figure captions and table notes
- Data dictionaries and dataset descriptions
- Notebook narration and reproducibility notes

## What makes it different

- **Domain terms are precision, not jargon.** Plainspeak preserves WIS, MCMC, cross-validation, posterior, bootstrap, and their kin instead of flattening them into vague everyday words.
- **It respects scientific convention.** Passive voice stays in methods sections. Numbers, confidence intervals, p-values, units, software versions, and citations stay intact.
- **It does not inject personality.** For reference text, neutral is the correct human voice. Plainspeak removes manufactured opinions and blog framing rather than adding them.
- **Clarity beats rule-following.** No edit ships unless the sentence comes out clearer and still correct (Orwell's sixth rule).

## Installation

Plainspeak installs as a Claude Code plugin, so you can update it from inside Claude Code instead of managing a clone by hand. Add the marketplace, then install:

```
/plugin marketplace add saraya209/plainspeak
/plugin install plainspeak@plainspeak
```

To update later, after a new version is published:

```
/plugin marketplace update plainspeak
```

You can also turn on auto-update for the marketplace from the `/plugin` menu under the Marketplaces tab.

## Usage

```
/plainspeak

[paste your text here]
```

Or ask for it directly:

```
Make this docstring clearer: [paste text]
```

By default Plainspeak returns the rewrite first, followed by a short change note when it helps. To see a structured review instead, ask for one ("review this against the rubric").

## How it works

Plainspeak follows a short loop:

1. Identify the artifact type and audience.
2. Preserve claims, terminology, citations, numbers, and constraints.
3. Cut filler, inflated vocabulary, false authority, and formulaic structure.
4. Apply the conventions for the artifact.
5. Audit for false positives so precise technical language is not flattened.
6. Return the rewrite and a brief change note.

The skill is split into a compact `SKILL.md` plus reference files it loads as a task needs them.

| File | What it covers |
|------|----------------|
| `SKILL.md` | Core rules, technical register, quick checks, and process |
| `references/phrases.md` | Filler, AI vocabulary, the "serves as" dodge, jargon substitutes |
| `references/structures.md` | Negative parallelism, false ranges, false agency, passive/actor guidance |
| `references/technical.md` | Conventions per artifact (docstrings, methods, captions, and more) |
| `references/examples.md` | Before/after examples by artifact type |
| `references/sources.md` | Attribution and the writing principles behind the rules |

## Examples

**Docstring**

Before:
> This powerful function provides a robust solution for seamlessly handling missing values, leveraging a comprehensive suite of imputation strategies.

After:
> Fill missing values using the chosen strategy ('mean', 'median', or 'most_frequent').

**Results paragraph**

Before:
> It was observed that performance degraded at longer horizons, with uncertainty naturally increasing as the prediction window expanded.

After:
> We found that performance degraded at longer horizons. Each additional week of lead time added roughly 15% to the mean WIS.

**Discussion**

Before:
> It's worth noting that these findings have important implications moving forward. Despite these challenges, this work contributes meaningfully to the literature.

After:
> If model rankings are unstable across geography and time, performance-weighted ensembles may not beat equal weighting.

More examples are in [references/examples.md](references/examples.md).

## Credits

Plainspeak builds on two open-source lineages. The full chain, with links and notes on what was borrowed, is in [references/sources.md](references/sources.md).

- **Git base:** [blader/humanizer](https://github.com/blader/humanizer) by Siqi Chen (MIT), rooted in [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing). This repository keeps that history and license.
- **Rule catalog:** adapted from [deslop](https://github.com/stephenturner/skill-deslop) by Stephen Turner (MIT), which itself adapts [tropes.fyi](https://tropes.fyi) by Ossama Hassanein and stop-slop by Hardik Pandya.
- **Writing principles:** Orwell's "Politics and the English Language", the Google developer documentation style guide, Williams's "Style", NumPy and pandas docstring conventions, and Tufte on captions. These shape the conventions and examples as paraphrased principles, not copied passages.

## Version history

- **0.1.0** - Initial Plainspeak fork. Reframed humanizer around clarity for technical prose: Orwell-based core rules, an explicit domain-terminology exception, a methods-section passive-voice exception, artifact-specific conventions, and removal of the blog-voice personality material. Scope set to core technical and scientific prose. Packaged as a Claude Code plugin for marketplace install and in-app updates.

## License

MIT. See [LICENSE](LICENSE).
