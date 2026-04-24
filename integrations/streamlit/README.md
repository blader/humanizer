# Streamlit wrapper

A minimal web UI for the `humanizer` skill. Paste text, click **Humanize**, get the rewritten prose back — without the skill's default draft / audit / summary sections.

Paste text → `claude -p` + humanizer skill → clean final prose, with a copy button.

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

**To stop:** press `Ctrl+C` in the same terminal. That sends SIGINT to Streamlit, Streamlit's `atexit` hook kills any in-flight `claude -p` subprocess, and the port is released.

## Option B — Run with Docker

```bash
cd integrations/streamlit
docker compose up --build
```

Then open http://localhost:8501.

The compose file mounts your host's `~/.claude/` into the container so any file-based auth + your installed skills carry over. See [Authentication](#authentication) for the macOS caveat.

**To stop:** two options, either works.

- **From the terminal running `docker compose up`** — press `Ctrl+C`. Compose sends SIGTERM to the container, waits a few seconds, then SIGKILL if needed. When the container's PID 1 dies, the kernel kills every process inside the namespace, including any in-flight `claude -p`.
- **From a separate terminal** (or if `up` is detached with `-d`):
  ```bash
  docker compose down          # stop + remove container (recommended)
  # or
  docker compose stop          # stop but keep container for a quick restart
  # or (last resort, hard kill)
  docker kill humanizer-streamlit
  ```

---

## Lifecycle — when does `claude` run, and when does it stop?

The wrapper keeps **no** persistent `claude` session. Each click is self-contained.

| Moment | What happens |
|---|---|
| You open the browser | Streamlit boots. **No `claude` process yet.** |
| You paste text | Nothing happens — text just sits in the textarea. |
| You click **Humanize** | `app.py` spawns `claude -p "<your text + strict output rules>"` as a subprocess. Right panel shows a spinner + "Running humanizer skill…" status message, then streams the rewrite live as it arrives. |
| Generation finishes (~5–15 s) | Subprocess exits on its own. Status flips to "Done". Output is re-rendered in a code block with a native copy icon in the top-right corner. |
| You click **Humanize** again | Any still-running subprocess is killed first, then a fresh one spawns. |
| You close **only** the browser tab | Streamlit server stays up. A subprocess that was already running **will finish on its own within seconds** (its stdout just gets discarded). **Closing the tab alone does not stop Streamlit.** |
| You `Ctrl+C` the local terminal | Streamlit shuts down → `atexit` fires → any in-flight subprocess is killed → port released. |
| You `docker compose down` / `Ctrl+C docker compose up` | Container is stopped → kernel kills every process in its namespace, subprocess included. |

In Claude Code terms: **each click is a brand-new one-shot session** with no memory of previous clicks. The subprocess is launched with `--no-session-persistence`, so no session file is written to disk either — there is no way for the output of one click to leak into the context of the next.

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
2. **Post-process-level:** Even if the model leaks a "Here is…" opener or the skill's default "**Summary of changes:**" trailer, `_clean_output()` in `app.py` strips them before the output block is populated.

During generation you'll see text stream into the right panel as it arrives. Once it finishes, that streamed view is replaced by a `st.code` block — this gives you a **native copy-to-clipboard icon in the top-right corner** of the output so you can paste the result straight into your doc.

If you ever see leftover garbage in the cleaned output, that's a prompt-obedience failure — tighten `PROMPT_TEMPLATE` or extend `_PREAMBLE_RE` / `_TRAILING_RE` in `app.py`.

---

## Security considerations

Scoped for **single-user, local use**. A few things to know before you deploy this further:

- **No authentication on the UI.** Anyone who can reach `http://<host>:8501` can humanize text against your Claude Code credentials. The Docker compose file publishes the port on `127.0.0.1` by default so only your machine can hit it. Don't remove that bind unless you're putting auth in front of it.
- **`~/.claude` is mounted read-write into the container.** This gives the container full access to your host Claude Code auth tokens and installed skills. It needs to be writable because the macOS `claude /login`-inside-container fix writes back there. Treat the container image as trust-equivalent to the host for those credentials — don't run a random image against this compose file.
- **Container runs as a non-root user** (`app`, uid 1000) so a bug in a dependency can't trivially write to host files as root. (Your mounted `~/.claude/` files end up owned by uid 1000; that's normal.)
- **Prompt injection isn't a security issue here** — you are both the user *and* the "attacker". If you paste text that tries to redirect the skill, the worst case is your own output is weird. Don't deploy this in a multi-user setting without thinking that through.

## Limitations

- First call has the usual Claude Code startup cost (plugin sync, CLAUDE.md discovery, keychain read); subsequent calls are faster.
- Long texts are passed as a positional argument, so input is bounded by your shell's `ARG_MAX` (≈256 KB on macOS, ≈128 KB on Linux). Enough for any single essay; swap to `--input-format stream-json` if you need more.
- Closing the browser tab alone does not stop an in-flight subprocess (it will self-terminate within seconds anyway). If you need a hard stop, use `Ctrl+C` / `docker compose down` — see [How to stop](#option-a--run-locally) above.
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
