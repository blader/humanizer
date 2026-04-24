# Streamlit wrapper

A minimal web UI for the `humanizer` skill. Paste text, click **Humanize**, get the rewritten prose back — without the skill's default draft / audit / summary sections.

Paste text → `claude -p` + humanizer skill → clean final prose.

---

## Prerequisites

Both the local and Docker paths need:

1. [Claude Code](https://claude.com/claude-code) installed. Verify with:
   ```bash
   claude --version
   ```
2. The `humanizer` skill installed (see the repo root `README.md` → _Installation_).
3. Either **one** of:
   - A completed Claude Code login (`claude /login`), **or**
   - `ANTHROPIC_API_KEY` exported in your shell.
4. Python 3.9+ (for local) **or** Docker 24+ (for container).

See [Authentication](#authentication) below for details on the two login options.

---

## Option A — Run locally

```bash
cd integrations/streamlit
./run.sh
```

`run.sh` will:

1. Confirm `claude` is on `$PATH`.
2. Create a local `.venv/` and install `streamlit`.
3. Launch the app on http://localhost:8501.

Press `Ctrl+C` in the terminal to stop.

## Option B — Run with Docker

```bash
cd integrations/streamlit
docker compose up --build
```

Then open http://localhost:8501.

The compose file mounts your host's `~/.claude/` into the container so any file-based auth + your installed skills carry over. See [Authentication](#authentication) for the macOS caveat.

Stop with `Ctrl+C`, or `docker compose down`.

---

## Lifecycle — when does `claude` run?

The wrapper keeps **no** persistent `claude` session. Each click is self-contained:

| Moment | What happens |
|---|---|
| You open the browser | Streamlit boots. **No `claude` process yet.** |
| You paste text | Nothing yet — text just sits in the textarea. |
| You click **Humanize** | `app.py` spawns `claude -p "<your text + strict output rules>"` as a subprocess. |
| Generation runs (~5–15 s) | stdout streams into the right-hand panel. |
| Subprocess finishes | Process exits on its own. Cleaned output is shown in a copy-friendly textarea. |
| You click **Humanize** again | Any still-running subprocess is killed first, then a fresh one spawns. |
| You close the browser tab | Streamlit detects the disconnect. Any in-flight subprocess is killed on Streamlit shutdown (best-effort via `atexit`). |
| You `Ctrl+C` the terminal | Streamlit shuts down, killing any remaining subprocess. |

In Claude Code terms: **each click is a brand-new one-shot session** with no memory of previous clicks. That's intentional — it keeps cost predictable and avoids stale context.

---

## Authentication

`claude -p` needs credentials to call the model. Pick one path:

### Option 1 — OAuth (default, same login as your normal terminal use)

Log in **once on your host**, before ever opening the app:

```bash
claude /login
```

This opens a browser, completes OAuth, and stores credentials in:
- **macOS:** the system Keychain.
- **Linux / WSL:** `~/.claude/`.

After that, every `claude -p` call (including the ones this app makes) reuses that login silently. You can verify by running `claude -p "hi"` from any terminal — if it answers without asking for login, you're set.

### Option 2 — `ANTHROPIC_API_KEY`

If you'd rather skip OAuth, or you're on a headless box where the Keychain isn't available (Docker on Linux, CI, a remote server), export an API key from [console.anthropic.com](https://console.anthropic.com/):

```bash
export ANTHROPIC_API_KEY=sk-ant-...
./run.sh
```

`claude -p` picks it up automatically. No `/login` needed. The subprocess inherits the env var from the Streamlit process.

### Authentication inside Docker

- **Linux host:** Claude Code's file-based auth lives in `~/.claude/`, which `docker-compose.yml` mounts into the container. OAuth works out of the box.
- **macOS host:** OAuth credentials live in the macOS Keychain, which the container cannot read. Two fixes:

  **Fix 1 — Log in once inside the container.** The credentials will persist in the mounted `.claude/` volume:
  ```bash
  docker compose up -d --build
  docker compose exec humanizer claude /login
  ```

  **Fix 2 — Use an API key.** Uncomment the `ANTHROPIC_API_KEY` line in `docker-compose.yml`, then:
  ```bash
  ANTHROPIC_API_KEY=sk-ant-... docker compose up --build
  ```

---

## Output — do I get just the result?

Yes. Two layers enforce this:

1. **Prompt-level:** The request wrapper explicitly tells Claude to output **only** the final rewritten prose — no draft, no "what makes it AI" audit, no summary of changes, no preamble, no markdown headers, no `---` separators, no surrounding quotes.
2. **Post-process-level:** Even if the model leaks a "Here is…" opener or the skill's default "**Summary of changes:**" trailer, `_clean_output()` in `app.py` strips them before the textarea is populated.

During generation you'll see text stream into the right panel. Once it finishes, that display is replaced by a clean `text_area` containing only the rewritten prose, ready to copy.

If you ever see leftover garbage in the cleaned output, that's a prompt-obedience failure — tighten `PROMPT_TEMPLATE` or extend `_PREAMBLE_RE` / `_TRAILING_RE` in `app.py`.

---

## Limitations

- First call has the usual Claude Code startup cost (plugin sync, CLAUDE.md discovery, keychain read); subsequent calls are faster.
- Long texts are passed as a positional argument, so input is bounded by your shell's `ARG_MAX` (≈256 KB on macOS, ≈128 KB on Linux). Enough for any single essay; swap to `--input-format stream-json` if you need more.
- No history / undo. Each click overwrites the previous output.

---

## Files

```
integrations/streamlit/
├── app.py              # Streamlit UI + subprocess call to `claude -p` + output cleanup
├── run.sh              # Local launcher (venv + streamlit)
├── Dockerfile          # Container with python + node + claude CLI + streamlit
├── docker-compose.yml  # Mounts ~/.claude, exposes :8501
├── .dockerignore
├── requirements.txt    # streamlit
└── README.md           # This file
```
