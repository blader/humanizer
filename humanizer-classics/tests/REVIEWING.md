# Manual Reviewer Checklist

`humanizer-classics` is pure Markdown. There's no automated test runner. Verification is a **golden-corpus eyeball check**: a reviewer runs the skill against the samples in `corpus/` and confirms the expected rules fire and the rewrites read naturally.

Run this checklist **before merging any rule PR**.

---

## Setup

1. Install the skill locally:
   ```bash
   ln -s "$(pwd)/humanizer-classics" ~/.claude/skills/humanizer-classics
   ```
   (Or symlink to `~/.config/opencode/skills/` for OpenCode.)

2. Restart your Claude Code session so the skill is reloaded.

3. Confirm `/humanizer-classics` appears in the skills list.

---

## Per-PR check (every rule PR)

For each of the 6+ corpus samples in `corpus/`:

- [ ] Read the `.md` file (the slop input).
- [ ] Read the `.expected-fixes.md` file (the list of rule IDs that should fire).
- [ ] Run the skill: `/humanizer-classics` followed by the slop content.
- [ ] Confirm:
  - [ ] The rules listed in `.expected-fixes.md` actually fire (mentioned by ID in the skill's "Rules applied" output, or visibly addressed in the rewrite)
  - [ ] No rules fire that *shouldn't* on this sample (the new rule under review doesn't fire spuriously on samples it doesn't apply to)
  - [ ] The rewrite reads naturally — no over-correction, no robotic chopping of every modifier
  - [ ] Meaning is preserved — facts and the writer's intent survive
  - [ ] The context tag chosen by the skill matches the `context: <tag>` line at the top of the sample

If any sample fails, the rule needs revision before merging.

---

## Per-book check (when adding a new book)

In addition to the per-PR check above:

- [ ] At least one corpus sample exercises rules from the new book and lists them in `.expected-fixes.md`.
- [ ] The new book's reference file follows the format in `references/_template-book-rules.md` exactly.
- [ ] The new book's rules appear in `references/_rule-index.md` (both the main table and the cross-reference graph if applicable).
- [ ] The new book's rules appear in `SKILL.md`'s craft-rule catalog.
- [ ] The new book is mentioned in `README.md`'s "Books currently included" list.
- [ ] Pull-quotes are 10-25 words and properly attributed (book, edition, chapter or page).

---

## v2.x non-regression check

The v2 skill must still work for users on `~/.claude/skills/humanizer/`. After installing v3:

- [ ] `/humanizer` (v2) still loads in Claude Code.
- [ ] `/humanizer-classics` (v3) loads alongside it without conflict.
- [ ] Running both on the same input produces different (but reasonable) outputs.

---

## Skill structural sanity

- [ ] `SKILL.md` frontmatter parses (name, version, description, license, compatibility, allowed-tools).
- [ ] Every `Read references/<file>.md` directive in `SKILL.md` points to a file that exists.
- [ ] Every rule ID mentioned in the skill is also in `references/_rule-index.md`.
- [ ] Every reference file follows the format from `_template-book-rules.md` (or `wikipedia-signs-of-ai-writing.md` for the imported W-rules).

---

## When the corpus needs updating

Update the corpus when:

- A new rule introduces a pattern not represented in the existing samples
- A new book joins the canon (add at least one sample exercising its rules)
- A user reports a real-world failure mode that the corpus didn't catch (add the failing sample as a new corpus entry, with the expected rules listed)

Don't update the corpus to "make a failing rule pass" — fix the rule.

---

## Audit log (optional)

Some maintainers keep an `audit-log.md` with a one-line note for each release: "v3.0.x — ran corpus, all 6 samples passed, no regressions on W-rules." This is helpful for reviewers but not required.
