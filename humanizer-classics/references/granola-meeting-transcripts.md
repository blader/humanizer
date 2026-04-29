# Live Inputs: Granola Meeting Transcripts and Wispr Flow Dictation

This file documents how to pull thought-capture inputs (Granola meeting transcripts, Wispr Flow dictation, raw pasted "AI slop") into the humanizer-classics workflow. It is not a rule file — it's an operational guide for the skill.

---

## Granola: live transcript pull via MCP

When the user says any of the following, treat it as a request to humanize a Granola meeting:

- "Humanize my last meeting"
- "Clean up the standup notes"
- "Take my Acme call transcript and turn it into [a memo / an email / a blog post]"
- "I just had a meeting about X — can you write up a summary in my voice?"
- "Pull my notes from this morning's meeting"

### Workflow

1. **List meetings.** Call `mcp__granola__list_meetings` (or `mcp__granola__query_granola_meetings` with a search term if the user named the meeting). If there's only one obvious match, proceed; otherwise present the top 3-5 to the user with date, title, and brief context, and ask which one.

2. **Fetch the transcript.** Once selected, call `mcp__granola__get_meeting_transcript` with the meeting ID. The transcript will typically include speaker labels, timestamps, and may be lightly cleaned by Granola's own AI summarization.

3. **Pre-pass: strip artifacts.** Before running the two-pass humanizer, remove:
   - Timestamps (`[00:14:32]`, `(14:32)`)
   - Speaker labels at the start of every turn (unless the user wants attributed quotes)
   - Granola's own auto-generated summary boilerplate ("Action items:", "Key takeaways:" — these often have AI patterns the humanizer should rebuild from scratch)
   - Disfluencies and false starts that are pure noise (`um`, `uh`, `you know what I mean`, restarts like `I think — actually no, what I mean is`)

4. **Identify the target form.** Ask the user (or infer from their request): is this becoming a memo, an email, a blog post, a LinkedIn post, a section of a book draft, or a meeting summary? This sets the **context tag** that governs which rules fire most:
   - **memo / email / meeting-summary** → H-1, H-2, H-3, H-4, H-5 lead. Z-5 (be present) generally does NOT fire.
   - **blog / book-draft** → Z-1, Z-2, Z-5, Z-6 lead. H-1 helps but isn't dominant.
   - **dictation cleanup (raw to readable)** → Z-1, Z-3, Z-4 lead (cut clutter, active verbs, strip qualifiers). Preserve the speaker's voice; this is an editing pass, not a rewrite.

5. **Run the two-pass process** (described in the main `SKILL.md`): draft rewrite → audit pass → final rewrite. Apply the rules selected by the context tag.

6. **Return the output** with a brief change log noting which rules fired most. If the user provided a writing sample for voice calibration, mention that calibration was applied.

### Granola MCP tools available

The user's environment has the `mcp__granola__*` tool family loaded:
- `mcp__granola__list_meetings` — list recent meetings
- `mcp__granola__list_meeting_folders` — list folder organization
- `mcp__granola__query_granola_meetings` — search across meetings
- `mcp__granola__get_meetings` — fetch one or more meetings (metadata)
- `mcp__granola__get_meeting_transcript` — fetch full transcript text

Load these tools via `ToolSearch` with `select:mcp__granola__list_meetings,mcp__granola__get_meeting_transcript` (etc.) before calling, since they're deferred.

---

## Wispr Flow: dictation cleanup

Wispr Flow is a Mac dictation tool. It transcribes the user's voice directly into the active text field — there's no API or MCP integration. The user typically dictates a stream of thought and pastes the result into the prompt. Or they dictate directly into the chat.

### What dictation looks like

- Long run-on sentences with weak conjunctions (`and so`, `and then`, `and basically`)
- Filler words (`um`, `uh`, `you know`, `I mean`, `like`)
- Restarts and self-corrections (`it's a — well, what I'm trying to say is`)
- No paragraph breaks
- All-lowercase or only sentence-initial caps (depending on Wispr Flow settings)
- Punctuation by voice command (`comma`, `period`, `new paragraph`) — sometimes literal text, sometimes auto-formatted
- Numbers spelled out where Wispr couldn't translate ("twenty twenty-six" instead of "2026")

### Rules that fire most on dictation

| Rule | Why |
|------|-----|
| Z-1 (cut clutter) | Spoken thought rambles; written thought shouldn't |
| Z-3 (active verbs) | Speech defaults to "I would say that..." — written form wants the verb |
| Z-4 (strip qualifiers) | "I kind of think maybe" reads like hedging in print |
| W-9 (negative parallelisms) | Spoken self-correction often produces "It's not just X, it's Y" |
| W-23 (filler) | Many spoken filler phrases survive transcription |
| H-3 (one idea per paragraph) | Dictation has no paragraph breaks; the editor must add them |

### What NOT to do with dictation

- **Don't rewrite into a different voice.** Dictation captures the speaker's actual cadence. The humanizer's job on dictation is to *edit* the speaker's voice into readable form, not to replace it with a generic written register. Use the existing voice-calibration feature: take the dictated text itself as the voice sample, then humanize lightly.
- **Don't cut all hedges.** A real hedge — "I'm not sure about this but" — is the speaker telling the reader something true. Cut only the qualifiers that are pure verbal tics (Z-4).
- **Don't impose business-writing structure on personal dictation.** H-1 (lead with bottom line) is wrong for a stream-of-thought essay or a journal-style book draft. Match the form to the user's intent.

---

## Raw pasted slop

When the user pastes a block of AI-generated text without context, default to:

1. The full rule catalog (W-1..W-29 for detection, Z/S/H for fixes)
2. **Context tag: blog** unless the text shape signals otherwise (an obvious memo header → memo; an email greeting → email; a long narrative → book-draft)
3. Two-pass process per `SKILL.md`

If the pasted text is itself a Granola summary or Wispr dictation, follow the appropriate workflow above instead.

---

## Future work (deferred)

- Direct Wispr Flow integration (no MCP exists; would require new tooling)
- Auto-detect the source of pasted text (Granola format vs. Wispr vs. AI chat output) by structural cues
- A separate `references/wispr-flow-dictation.md` if the dictation-specific patterns warrant their own file (currently they're a section here because the rule overlap with Granola is high)
