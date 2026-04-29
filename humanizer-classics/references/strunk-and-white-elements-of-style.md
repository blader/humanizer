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
| S-6 | Express coordinate ideas in similar form | II.19 |
| S-7 | Place the emphatic words of a sentence at the end | II.22 |
| S-8 | Avoid a succession of loose sentences | II.18 |
| S-9 | Do not affect a breezy manner | V.9 |

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


### S-6. Express coordinate ideas in similar form

**Source:** Strunk & White, *The Elements of Style*, 4th ed., II.19

> "This principle, that of parallel construction, requires that expressions similar in content and function be outwardly similar."
> — Strunk, II.19

**Cross-references:** W-10 (rule of three), W-11 (synonym cycling), Z-3 (active verbs)
**Context tags:** all
**Detection cue:** Lists or series where items break grammatical parallel — mixing noun phrases with verb phrases, infinitives with gerunds, past tense with present. Correlative conjunctions (`both/and`, `not only/but also`, `either/or`) where the two halves don't match grammatically. Bullet lists where some items are full sentences and others are noun phrases.

**Problem:** LLMs vary the form of expression where parallel form was needed, "mistakenly believing in the value of constantly varying the form of expression." The reader has to do the work of recognizing that two ideas serve the same function despite different shapes — a small but real cognitive tax that adds up across a document. Strunk's prescription: like content gets like form. The reader's eye can then group, compare, and remember.

**Before**
> Our priorities for next quarter are to ship the new dashboard, customer onboarding will be redesigned, and we should also be focused on improving system reliability.

**After**
> Our priorities for next quarter are to ship the new dashboard, redesign customer onboarding, and improve system reliability.

**How to apply:** When a sentence or bullet list contains two or more items that serve the same function, write each item with the same grammatical shape. If the first item starts with a verb, all do. If the first is a noun phrase, all are. Correlative pairs (`both X and Y`, `not only X but also Y`, `either X or Y`) require X and Y to be the same grammatical type.


### S-7. Place the emphatic words of a sentence at the end

**Source:** Strunk & White, *The Elements of Style*, 4th ed., II.22

> "The proper place in the sentence for the word or group of words that the writer desires to make most prominent is usually the end."
> — Strunk, II.22

**Cross-references:** H-1 (lead with the bottom line), Z-6 (endings matter), W-25 (generic conclusions)
**Context tags:** all
**Detection cue:** Sentences where the most important word is buried mid-sentence and weak filler comes after it. Phrases like "in many ways", "in the modern world", "as well", "for various reasons" tacked onto the end of an otherwise punchy sentence. The strong noun or verb appears in position 4 of 8, then four words of throat-clearing follow.

**Problem:** Sentences land with whatever words sit at the end. LLMs tend to place qualifiers, scope-broadening clauses, and meta-commentary at sentence-end — the very position Strunk says belongs to the *new information*. Each sentence loses its punch because the punch isn't where the reader's eye stops. This is the sentence-level analog of H-1 (lead with the bottom line at the document level): both rules are about putting weight where the reader's attention is.

**Before**
> Humanity has hardly advanced in fortitude since that time, though it has advanced in many other ways.

**After**
> Since that time, humanity has advanced in many ways, but it has hardly advanced in fortitude.

(Strunk's own example.)

**How to apply:** Find the most important word in the sentence — usually the new information or the noun the sentence is really about. Rewrite so that word lands at or near the end. The principle scales: emphatic words at the end of the sentence, emphatic sentences at the end of the paragraph, emphatic paragraphs at the end of the section.


### S-8. Avoid a succession of loose sentences

**Source:** Strunk & White, *The Elements of Style*, 4th ed., II.18

> "An unskilled writer will sometimes construct a whole paragraph of sentences of this kind, using as connectives *and*, *but*, and, less frequently, *who*, *which*, *when*, *where*, and *while*…"
> — Strunk, II.18

**Cross-references:** W-10 (rule of three), W-11 (synonym cycling), Z-3 (active verbs)
**Context tags:** all (especially blog, book-draft, dictation)
**Detection cue:** Three or more sentences in a row with the same shape — typically `[subject] [verb] [object], and [clause]` or `[subject] [verb] [object], while [clause]`. Each sentence is two clauses joined by a conjunction. Read the paragraph aloud: it sounds like a metronome. The Personality and Soul section in `SKILL.md` calls this "every sentence is the same length and structure" — S-8 is the explicit prescription.

**Problem:** Sentence rhythm carries the reader. LLMs often produce paragraphs where every sentence has the same length and the same construction — the "loose" sentence pattern of two clauses joined by a conjunction. The result, in Strunk's words, "is bad because of the structure of its sentences, with their mechanical symmetry and singsong." Even if every individual sentence is grammatical and clear, the paragraph reads as flat because nothing in the rhythm signals what matters.

**Before**
> The third concert of the subscription series was given last evening, and a large audience was in attendance. Mr. Edward Appleton was the soloist, and the Boston Symphony Orchestra furnished the instrumental music. The former showed himself to be an artist of the first rank, while the latter proved itself fully deserving of its high reputation.

**After**
> Mr. Edward Appleton soloed last night with the Boston Symphony before a large audience. He proved himself a first-rank artist. The orchestra deserved its reputation.

(Strunk's "Before" example, paired with a rewrite that varies sentence length and breaks the conjunction-joined pattern.)

**How to apply:** Read each paragraph aloud. If three or more consecutive sentences share the same shape — same length, same conjunction-joined two-clause pattern — rewrite to break the pattern. Mix a short simple sentence next to a longer periodic one. Vary openings: a sentence starting with the subject, then one starting with a phrase, then one starting with a dependent clause. Variety of construction is what keeps the reader awake.


### S-9. Do not affect a breezy manner

**Source:** Strunk & White, *The Elements of Style*, 4th ed., V.9

> "The breezy style is often the work of an egocentric, the person who imagines that everything that comes to mind is of general interest and that uninhibited prose creates high spirits and carries the day."
> — White, V.9

**Cross-references:** Z-5 (be present on the page) — *tension*, W-22 (sycophantic tone), W-20 (chatbot artifacts)
**Context tags:** blog, email, dictation (does NOT fire on memo, technical-doc, meeting-notes)
**Detection cue:** Forced casualness — "Hey folks!", "Welp,", "let's talk turkey", "lemme just say". Manufactured asides ("just thinking out loud here"). Performative humility disclaimers without follow-through. Exclamation marks on declarative statements. Slang or emoji dropped in for personality flavor with no specific content behind it. The voice is *loud* but the writer "has not done his work" (V.9).

**Problem:** This rule is the counter-tension to Z-5 ("be present on the page"). When the humanizer over-applies Z-5 — adding "I" claims and personality without substance — the writing tips into the breezy register White warns against. Voice on the page should come from having something specific to say, not from manufactured spontaneity. The breezy register is just another form of AI slop: padding with "personality" instead of padding with corporate vocabulary. It "obviously has nothing to say" and is "showing off and directing the attention of the reader to himself" (V.9).

**Before**
> Hey folks! So I've been thinking about this whole AI productivity thing and lemme just tell ya — it's wild out there! Like, seriously, the takes I've been seeing are all over the place, and I'm just sitting here like, "Wait, what?" But anyway, here's my hot take...

**After**
> The AI productivity takes I keep seeing are all over the place. The studies are mixed too — Google says 55% faster for simple functions; Uplevel finds no PR-throughput difference. I'm watching the metric I actually trust: how often I cancel a Copilot suggestion mid-stream because I realized it was wrong. That number isn't going down.

**How to apply:** When Z-5 is applied (first person, opinions, voice), check that the personality is doing real work — naming a specific case, taking a defensible position, telling a small true story. If the "voice" is "Hey folks!", manufactured exclamations, or generic "I'm just spitballing here" disclaimers, the writer has not done the work. Strip the breeziness, keep the substance. **S-9 fires only on the same contexts as Z-5** (blog, email, dictation) — it's the calibrating partner, not a contradiction.
