# The Elements of Style — William Strunk Jr. & E. B. White

**Source:** William Strunk Jr. and E. B. White, *The Elements of Style*, 4th edition (Allyn & Bacon, 1999)
**Type:** Craft prescription (positive guidance — what good writing *does*)
**License of pull-quotes:** Fair use — short excerpts for educational commentary
**Rule prefix:** `S`

## Why this book belongs in humanizer-classics

Strunk's principles are the shortest, sharpest writing rules in English. They're stated as commands ("Omit needless words"), they're decades old, and they survive because each one names a real defect in unrevised prose — defects that LLMs reproduce with statistical reliability. Where Zinsser is a guide and a teacher, Strunk is a drill sergeant. Use these rules when a draft needs the brisk, declarative version of the same advice.

## Rules in this file

| ID | Rule (one line) | Reference |
|----|-----------------|-----------|
| S-1 | Omit needless words | II.17 |
| S-2 | Use the active voice | II.14 |
| S-3 | Put statements in positive form | II.15 |
| S-4 | Use definite, specific, concrete language | II.16 |
| S-5 | Do not overstate | V.7 |

---

### S-1. Omit needless words

**Source:** Strunk & White, *The Elements of Style*, 4th ed., II.17

> "Vigorous writing is concise. A sentence should contain no unnecessary words, a paragraph no unnecessary sentences."
> — Strunk, II.17

**Cross-references:** Z-1 (cut clutter), W-7 (AI vocab), W-23 (filler), W-27 (persuasive tropes)
**Context tags:** all
**Detection cue:** "the question as to whether" (= whether), "there is no doubt but that" (= doubtless), "used for fuel purposes" (= used for fuel), "he is a man who" (= he), "in a hasty manner" (= hastily), "this is a subject which" (= this subject), "his story is a strange one" (= his story is strange).

**Problem:** Strunk's rule is the strongest and most-quoted in the book because it's the most violated. LLMs accumulate words in patterns that read fine sentence-by-sentence and bloated paragraph-by-paragraph. The fix is mechanical: each phrase that can be shorter, should be.

**Before**
> The fact that he had not succeeded in the matter of the negotiations was a circumstance which gave rise to considerable disappointment among the members of the team.

**After**
> His failure in the negotiations disappointed the team.

**How to apply:** Run Strunk's specific phrase swaps on every draft (the list above). Then re-read each sentence with the question "could this be shorter and still mean the same thing?" If yes, cut. This is closely related to Z-1, but Z-1 is about clutter as a *disease*; S-1 is about each *sentence* as a unit.


### S-2. Use the active voice

**Source:** Strunk & White, *The Elements of Style*, 4th ed., II.14

> "The active voice is usually more direct and vigorous than the passive."
> — Strunk, II.14

**Cross-references:** W-13 (passive voice), Z-3 (active verbs), W-8 (copula avoidance)
**Context tags:** all (especially memo, blog, technical-doc instructions)
**Detection cue:** "be" + past participle constructions where the actor is hidden ("a decision was made"), where the actor is named but demoted ("the report was written by Sarah"), or where the actor is "the system" / "it" / "one" trying to dodge naming a person.

**Problem:** Passive voice is grammatical, not wrong, and sometimes correct (when the actor is unknown or genuinely irrelevant). But LLMs default to it because passive constructions are statistically safe — they avoid commitment. The result is prose where nothing is being done by anyone. Strunk's rule is to prefer the active form, and use the passive only when the actor is genuinely beside the point.

**Before**
> A decision was reached by the committee. The proposal will be reviewed in the coming weeks. Recommendations will be provided to leadership.

**After**
> The committee decided. They will review the proposal in the coming weeks and recommend to leadership.

**How to apply:** Find every "be + participle" construction. For each, identify the actor (the person, group, or thing actually doing the action). If the actor is known, rewrite in active voice with the actor as the subject. If the actor is genuinely irrelevant or unknown, the passive can stay — but verify that's true rather than the default.


### S-3. Put statements in positive form

**Source:** Strunk & White, *The Elements of Style*, 4th ed., II.15

> "Make definite assertions. Avoid tame, colorless, hesitating, noncommittal language."
> — Strunk, II.15

**Cross-references:** W-24 (excessive hedging), Z-4 (strip qualifiers)
**Context tags:** all
**Detection cue:** "not honest" (= dishonest), "not important" (= trivial / unimportant), "did not remember" (= forgot), "did not pay attention to" (= ignored), "did not have much confidence in" (= distrusted). Long strings of "not" and "no" before adjectives.

**Problem:** Negation is weaker than affirmation. "She was not honest" makes the reader build the positive image of honesty and then mentally negate it. "She was dishonest" lands directly. LLMs use the negative form because it sounds judicious and tentative; Strunk says the positive form sounds like a writer who knows what they think.

**Before**
> The new policy is not without its drawbacks. It is not unlikely that some teams will not be entirely supportive.

**After**
> The new policy has drawbacks. Some teams will resist.

**How to apply:** Search the draft for "not" + adjective constructions. For each, ask "is there a single word that says the positive form of what I mean?" Usually there is. Replace. The sentence shortens and the assertion sharpens.


### S-4. Use definite, specific, concrete language

**Source:** Strunk & White, *The Elements of Style*, 4th ed., II.16

> "Prefer the specific to the general, the definite to the vague, the concrete to the abstract."
> — Strunk, II.16

**Cross-references:** W-3 (-ing analyses), W-12 (false ranges), W-5 (vague attributions), Z-2 (plain words)
**Context tags:** all
**Detection cue:** Abstract nouns where a concrete one would do: "individuals" (people), "vehicles" (cars), "facilities" (buildings), "stakeholders" (customers, employees, investors — name them), "deliverables" (the report, the prototype). Adjectives like "various", "several", "a number of", "many" without follow-through.

**Problem:** LLMs hover at the abstract level because abstraction is a low-risk default. The reader's mind, however, only engages when it has something specific to picture. "Several attendees expressed concerns about the implementation" puts no image in the head. "Three engineers said the rollout broke their production deploys" does.

**Before**
> A number of stakeholders expressed concerns about various aspects of the implementation, particularly around several key areas of operational impact.

**After**
> Three engineers and the head of customer support said the rollout broke production deploys, slowed the help-desk queue by half, and forced a 4 a.m. rollback.

**How to apply:** Underline every abstract noun and every quantity word ("several", "various", "many", "a number of", "a variety of"). For each, ask "what specifically?" Replace with the concrete answer. If you don't know the concrete answer, the sentence isn't ready — find out, or cut the sentence.


### S-5. Do not overstate

**Source:** Strunk & White, *The Elements of Style*, 4th ed., V.7

> "When you overstate, the reader will be instantly on guard, and everything that has preceded your overstatement as well as everything that follows it will be suspect."
> — Strunk and White, V.7

**Cross-references:** W-4 (promotional language), W-1 (significance inflation), W-25 (generic positive conclusions)
**Context tags:** all
**Detection cue:** Superlatives without evidence: "groundbreaking", "transformative", "revolutionary", "world-class", "best-in-class", "unparalleled", "the most ___ ever", "incredibly", "absolutely", "literally" (when not literal). LLM marketing words: "boasts", "stunning", "must-have", "game-changing".

**Problem:** Overstatement is the LLM's default register. Trained on marketing copy, blog headlines, and Wikipedia-with-puffery, it reaches for the strongest adjective whether or not the strength is earned. Strunk and White's warning is sharper than "don't be cheesy" — overstatement makes the *whole piece* less credible. One unearned superlative casts doubt on every adjacent claim.

**Before**
> Our groundbreaking new platform is a transformative, best-in-class solution that boasts unparalleled performance and a stunning user experience.

**After**
> The platform is faster than the previous version on the three benchmarks we tested. The new dashboard surfaces alerts that used to require three clicks to find.

**How to apply:** Scan for superlatives and intensifiers. For each, ask "is this earned by a specific fact in the same paragraph?" If yes, the superlative can stay (and the fact does the convincing). If no, cut the superlative and replace with the specific fact, or cut the sentence.
