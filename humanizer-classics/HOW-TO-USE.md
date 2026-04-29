# How to Use Humanizer Classics

A plain-English guide for anyone on the team. No coding background needed.

## What it is

Take any AI-written text — a draft Claude wrote for you, a LinkedIn post that came out sounding fake, an email that reads like a chatbot, a Granola meeting summary — and the skill rewrites it to sound human. It uses rules from books you've probably read or heard of: William Zinsser's *On Writing Well*, Strunk and White's *Elements of Style*, and the *HBR Guide to Better Business Writing*. Plus a list of the specific tells of AI writing maintained by editors on Wikipedia.

**It edits writing. It does not write from scratch.** Bring it text and it will hand back a cleaner version.

## What you need

- A Mac
- **Claude Code** installed. If you don't have it, get it at [claude.ai/code](https://claude.ai/code).

That's it. There's nothing else to install — the skill is just plain text that Claude Code reads.

## One-time setup (5 minutes)

Open the **Terminal** app on your Mac (press ⌘+Space, type "Terminal", hit Return) and paste these three lines, one at a time, pressing Return after each:

```bash
mkdir -p ~/.claude/skills

git clone https://github.com/bdevz/humanizer ~/humanizer-source

ln -s ~/humanizer-source/humanizer-classics ~/.claude/skills/humanizer-classics
```

What each line does, in plain English:
1. Make sure the folder Claude Code reads its skills from exists.
2. Download the source code into a folder in your home directory.
3. Tell Claude Code where to find this skill.

If you already have Claude Code open, **quit it and reopen it.** Then type `/` in any Claude Code session and you should see `humanizer-classics` in the list.

## How to use it

### 1. Humanize text you paste in

Open Claude Code. Type:

```
/humanizer-classics
```

Then paste your AI-written text below it. Send it. Claude will read your text, identify the AI patterns, rewrite it, do a self-audit ("what still sounds AI?"), then give you the final version.

### 2. Match your own voice

If you want the rewrite to sound like *you* and not like generic "clean prose," paste 2-3 paragraphs of writing you've actually published or sent (LinkedIn posts, an email you wrote, a section of your book). The skill will analyze your sentence rhythm, word choice, and quirks, then match them in the rewrite.

Example of what to type:

```
/humanizer-classics

Match my voice. Here's a sample of how I write:

[paste 2-3 of your own paragraphs]

And here's the AI-written text I want you to humanize:

[paste the AI text]
```

### 3. Clean up a Granola meeting transcript

If you use Granola for meeting notes, you can ask the skill to pull a transcript directly and humanize it:

```
/humanizer-classics

Pull the transcript from my standup this morning and turn it into a memo I can share with the team.
```

The skill will list your recent meetings, ask which one, fetch the transcript, strip out timestamps and speaker labels, and turn it into a tight memo.

### 4. Clean up Wispr Flow dictation

If you talk into Wispr Flow and end up with a wall of stream-of-thought text, paste it in:

```
/humanizer-classics

I dictated this into Wispr Flow. Clean it up but keep my voice — it's for a blog post.

[paste the dictation]
```

The skill knows dictation has different patterns (run-ons, "um", restarts) and edits without flattening your voice into generic prose.

## Real examples of what it fixes

**AI-sounding LinkedIn post:**
> 🚀 Three lessons I learned from my biggest professional failure. Earlier in my career, I had the privilege of leading a high-stakes product launch that fundamentally changed my perspective on leadership...

**After humanizer-classics:**
> I shipped a payments product four months late in 2023. It taught me three things, only one of which I'd say out loud at a conference. Here's all three.

---

**AI-sounding business memo:**
> Hi team, I hope this email finds you well. As you know, we've been working hard over the past quarter to drive growth and execute on our strategic priorities. I wanted to take a moment to share some thoughts on where we landed and what comes next. Looking back at Q3, it's been a quarter of mixed results...

**After humanizer-classics:**
> Q3 came in 8% under plan. Two enterprise deals slipped to Q4 — Acme and Globex — and we still expect both in October. SMB beat plan by 14%, mostly from the new onboarding flow. Cloud spend ran hot after the data warehouse migration. Details below.

## Tips

- **Tell it the form.** "Treat this as a memo" or "this is a blog post" or "this is an email" helps it pick the right rules. A memo gets the bottom line on top; a blog post keeps your personal voice.
- **Always provide a voice sample for personal-voice writing** (LinkedIn, blog, book draft). Without one, the rewrite will be technically correct but generic.
- **Trust the audit step.** The skill rewrites once, then asks itself "what still sounds AI?", then rewrites again. The final version is usually noticeably better than the first. Don't stop reading at the draft.
- **It's editing, not magic.** If your input is empty or wrong, the output won't fix what wasn't there. The skill makes good-but-AI-flavored writing sound human; it can't make a bad argument into a good one.

## What the rules come from

53 rules total, each pulled from a real source:

- **29 rules** describe what AI writing *looks like* — from [Wikipedia's "Signs of AI Writing"](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) page.
- **10 rules** from **William Zinsser, *On Writing Well*** (25th anniversary ed., 2001) — the classic guide to writing nonfiction in plain English.
- **9 rules** from **Strunk & White, *The Elements of Style*** (4th ed., 1999) — the shortest, sharpest writing handbook in the language.
- **5 rules** from **Bryan A. Garner, *HBR Guide to Better Business Writing*** (2012) — the modern guide for memos, emails, and reports.

Each rule includes a short pull-quote from the source so you can see exactly what the author was saying.

## When something goes wrong

- **The skill doesn't appear in `/`** — quit Claude Code completely and reopen it. The setup runs at startup.
- **The rewrite sounds wrong / not like me** — provide a voice sample (see tip above). Without one, the skill defaults to a generic register.
- **The rewrite cut something I wanted to keep** — say so explicitly: "Keep the line about Acme's renewal exactly as I wrote it." Claude will preserve specific lines on request.
- **Anything else** — open an issue at [github.com/bdevz/humanizer/issues](https://github.com/bdevz/humanizer/issues).

## Want to add a writing book you love?

The repo is built to grow. If you have a writing book that taught you to write — anything from Pinker to McPhee to Verlyn Klinkenborg — see `CONTRIBUTING.md` in the repo. Anyone can propose a rule. The bar is: it has to trace to a specific page, and the example has to actually catch a real AI failure mode.
