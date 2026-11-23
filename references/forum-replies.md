# Forum and comment-thread replies

Use this when you draft or rewrite a reply in a public thread (Hacker News, Reddit, a GitHub issue, a Discord channel). The sentence-level patterns in SKILL.md still apply. The problems in this file sit above the sentence: which point you pick, how the reply is shaped, and what detail it carries.

## Where this comes from

Two blind tests in November 2026. Each test used 8 real Hacker News parent comments. Three AI writers replied to each parent under different instructions, and the real human reply was mixed in with theirs. Two judge models (Opus and Sonnet) had to pick the human reply and score every candidate 1–10 for how human it read.

| Setup | Round 1 score | Round 2 score |
|---|---|---|
| Real human reply | 8.7 | 7.9 |
| No style rules | 2.7 | — |
| Style rules only | 4.3 | — |
| Rules + 12 real example comments | 5.2 | 3.3 (v1 rules) |
| Revised rules (v2) | — | 4.75 |
| Revised rules (v2) + examples | — | 5.0 |

The judges found the human reply in 30 of 32 picks. The AI candidates that fooled a judge were short, made one observation, and carried a detail that didn't matter, like the writer's GPU, with no closing line. Real example comments helped more than rules alone. Better rules lowered the judges' confidence but did not close the gap. The tells that were left all came from the model trying to be useful.

## Checks, strongest first

1. **Don't take the obvious angle.** Given the same parent, every model reaches for the same rebuttal and the same nouns. Judges caught AI candidates mostly because they converged. A real reply goes sideways: it picks up a minor clause, makes a pedantic correction, drops a link, mentions some unrelated experience of the writer's, or just reacts.
2. **Don't grab the parent's most salient hook.** If the parent names a famous person, ad, or term, models build the reply around it, usually as a trivia fact or a correction. People reply to whatever caught their eye, which often isn't that.
3. **No arc.** A claim, then the mechanism, then an example, then a closing payoff is the AI shape even in lowercase. Don't end on an aphorism, a reframe, a punchline, or a question meant to sound engaged. Stop when the one point is made, even mid-thought.
4. **Make the detail odd rather than useful.** Invented detail that proves the point reads fake: command flags, paper years, "it failed 1 in 4 times", a vendor anecdote that fits too neatly. Real detail is often beside the point: an exact rig, a tape that got recorded over, a product someone is eyeing.
5. **Allow low effort and self-interest.** "I agree" plus a link to your own project, a bare question back, a gripe with no fix, or genuine confusion ("this is confusing to me, how does it converge?") all read human. A reply doesn't need to help, be complete, or be correct.
6. **Don't use the community's catchphrases.** On HN, "X is doing a lot of work there", "Unless I'm mistaken", "small nitpick" and "looking at you, Electron" are now AI tells too, because every model reaches for them. The same goes for opening every reply with a `>` quote followed by a tidy rebuttal.
7. **Be one-sided.** Cut "X, sure, but Y", "Still, I'd take…", "credit where it's due" and "fair, but". Grumpy, half-right, or testy is fine.
8. **Keep one real imperfection, not a sprinkle.** Examples: odd word order, a run-on held together with "i.e.", an abbreviation (OR, BH), an emoticon, a bare URL, a typo in a product name. When the writer's own draft has them, leave them in. Don't add a pile of them to fake it.

## When drafting

Get two or three of the community's real comments as voice samples before you write, and match them; samples beat rules here. Write one point. Read the parent again and ask what a tired regular would actually reply to, rather than what the smartest reply would be.

Don't use these checks to pass off machine text as a human's in a place that forbids it. They are for making a reply the user means to post sound like them.
