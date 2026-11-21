# Academic register

Read this file before editing a research paper, proposal, thesis, report, abstract, poster, or the LaTeX source of one, or when the user asks for an academic, scientific, or IEEE style. The rules here override the main patterns where the two differ.

The goal is prose that reads like a careful researcher wrote it: formal, precise, and impersonal, but not padded. Removing an AI tell must never lower the register. When the plain fix for a pattern would make a sentence conversational, choose a formal fix instead.

## How the main patterns change

- **§6 Triads.** Lists of real items are normal: objectives, limitations, sensor axes, research questions. Flag only lists whose items repeat one idea.
- **§8 Dashes.** Follow the venue. In IEEE style, use an en dash for number, page, and citation ranges (`1--5`, `pp.~10--12`). Do not use em dashes in running prose.
- **§9 Qualifiers.** Calibrated hedging belongs to the register: *may*, *suggests*, *is expected to*, *to the best of our knowledge*. Match the strength of each claim to its evidence. A proposal states what it will test, not what it found. Cut only stacked hedges.
- **§11 Passive voice.** Passive is normal in methods and wherever the actor is obvious ("The signals are segmented into 5 s windows"). Use the active voice when the actor matters to the claim.
- **§12 Words.** *Key*, *robust*, and *enhance* are fine in their technical sense (a robust estimator, image enhancement). The other words on the list stay tells.
- **§20 Headings.** Follow the venue. IEEE uses title case for section and subsection headings.
- **§25 The document itself.** A roadmap sentence ("Section 3 describes the protocol") and cross-references are conventions of the genre. Keep one roadmap where the venue expects it. Still cut accounts of how the text was drafted.
- **§26** does not apply.

## Register rules

### 1. Use formal words, not conversational ones

Replace idioms, phrasal verbs, and casual framing with the formal equivalent. Do not use contractions, *you*, rhetorical questions, or exclamation marks.

| Conversational | Formal |
|---|---|
| fill that gap | address this limitation |
| this project is about X | this project addresses X; this work focuses on X |
| says something about their health | is an indicator of their health |
| once they are back home | after discharge; in the home environment |
| the usual suspect | the most likely cause |
| a burden to wear | uncomfortable to wear |
| the battery runs out too soon | battery life is too short for continuous use |
| the things that matter are | the target activities are |
| Today, ... | Currently, ...; or drop it |
| get, figure out, look at | obtain, determine, examine |
| a lot of, big | many, much; large, substantial |

### 2. Move from the general to the specific

Open a section or a paragraph with the problem as the field knows it, then narrow to the setting, then to this work. A reader should know why the problem matters before meeting the hospital, the dataset, or the project name.

**Before:**
> At CHU Clermont-Ferrand, clinicians follow the mobility of such patients to detect early signs of deterioration.

**After:**
> Monitoring the mobility of patients with complex health profiles is difficult in clinical settings, and the Centre Hospitalier Universitaire (CHU) Clermont-Ferrand faces the same difficulty.

### 3. Make the argument chain visible

In an introduction or a motivation paragraph, each sentence must follow from the one before: a need, the current practice, its limitation, the proposed means, the limitation of that means, and this work. Mark each turn in the argument with one connective: *however*, *nevertheless*, *therefore*, *to address this*, *in this context*. Do not put a connective on every sentence; a chain of *moreover* and *additionally* is still §12. Write concessions correctly: "Although difficult, ..." or "Despite this difficulty, ...", not "Nevertheless difficult, ...".

### 4. Use the field's terms and keep them fixed

Name concepts with the terms the research community uses: *staff observation*, *self-reported data*, *non-invasive*, *real-time*, *activity monitoring*. Use one term for one concept across the whole document. Define each acronym at first use, full form first: "Centre Hospitalier Universitaire (CHU)". Do not introduce a technical label that the text never defines or needs; describe what is measured instead ("the contribution of the gyroscope" rather than an unexplained "sensor ablation").

### 5. Join clauses with periods, not colons or semicolons

Two independent clauses become two sentences, or one sentence joined by a subordinating word (*because*, *while*, *which*). Keep a colon only to introduce a list or a definition, and a semicolon only to separate list items that contain commas.

**Before:**
> This project is about HAR for health: the end users are doctors and patients.

**After:**
> This project addresses HAR for clinical monitoring, with doctors and patients as its end users.

### 6. Be formal, not wordy

A formal register is not a licence for inflation (§13) or for empty noun chains. Prefer *use* to *the usage of*, *can* to *is capable of*, and a verb to a noun built from it. Drop *task*, *the fact that*, and *in order to* when they add nothing.

**Before:**
> The continuous monitoring of patient movements task can be assisted with the usage of wearable inertial sensors.

**After:**
> Wearable inertial sensors can support the continuous monitoring of patient movement.

### 7. Keep the specific facts inside the formal sentence

Raising the register must not replace a concrete detail with a general phrase. "Worn on the wrist, the waist, or the thigh" stays in the sentence; "ensure personalized care" does not replace "estimate the risk of falls". Keep every citation on the clause it supports. When two sentences merge, move each `\cite` with its claim. Do not widen a cited finding beyond what the source states.

### 8. Write impersonally

Refer to the work as *this project*, *this work*, or *the proposed approach*. Use *we* only if the writer or the venue does. Never address the reader as *you*.

### 9. Fix the language

Correct agreement ("traditional methods rely", "the raw outputs are"), spelling, and missing articles. Keep the document's spelling variety (British or American) consistent with the rest of the text.

## LaTeX sources

Edit only the prose. Keep commands, environments, labels, `\cite` and `\ref` keys, non-breaking spaces (`~`), math, and `%` comments unchanged unless the user asks. Keep the line breaks of untouched sentences so the diff stays small.

## Full example

**Plain humanizer output (too informal):**
> At CHU Clermont-Ferrand, the university hospital of Clermont-Ferrand, clinicians follow the mobility of such patients to detect early signs of deterioration, to estimate the risk of falls and of lost autonomy, to adapt care plans and to judge whether a rehabilitation programme works \cite{chu2025ssl}. Today this follow-up relies mostly on observation by staff and on what patients report themselves. Both are subjective, neither scales to many patients, and neither says what a patient does once they are back home \cite{chu2025ssl}.
>
> Wearable inertial sensors can fill that gap. A small device worn on the wrist, the waist or the thigh records movement continuously over long periods, without a camera in the room \cite{serpush2022wearable}. This project is about HAR for health: the end users are doctors and patients.

**Academic register:**
> Monitoring the mobility and physical activity of patients with complex health profiles is difficult in clinical settings, and the Centre Hospitalier Universitaire (CHU) Clermont-Ferrand faces the same difficulty. Accurate activity assessment is nevertheless essential to detect early signs of deterioration, to estimate the risk of falls and loss of autonomy, to adapt care plans, and to evaluate rehabilitation programmes \cite{chu2025ssl}. Current practice relies mainly on staff observation and on self-reported data. Both are subjective, do not scale to large numbers of patients, and provide no information on activity outside the hospital \cite{chu2025ssl}.
>
> Wearable inertial sensors can support the continuous monitoring of patient movement. Small, non-invasive devices worn on the wrist, the waist, or the thigh record movement over long periods without a camera, which avoids the privacy and occlusion problems of video-based monitoring \cite{serpush2022wearable}. However, raw inertial signals cannot be interpreted directly by clinicians. Human activity recognition (HAR) converts them into a timeline of activities. This project addresses HAR for clinical monitoring, with doctors and patients as its end users.

## Final check

Before returning academic text, confirm that:

- no contraction, idiom, *you*, or rhetorical question remains;
- each paragraph moves from the general problem to the specific work;
- every acronym is defined once, at first use;
- no colon or semicolon joins two independent clauses;
- every fact, number, and citation of the original is still present and attached to its claim;
- the main tells (§1, §2, §6, §8, §19) are gone.
