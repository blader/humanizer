# Streamlit wrapper

A minimal web UI for the `humanizer` skill. Paste text, click Humanize, get the rewritten prose back — without the skill's default draft / audit / summary sections.

No API key is required. The wrapper shells out to your local `claude` CLI, so it uses your existing Claude Code login.

![flow](https://img.shields.io/badge/input-paste%20text-blue) → `claude -p` + humanizer skill → ![flow](https://img.shields.io/badge/output-final%20prose-brightgreen)

## Prerequisites (both local and Docker)

1. [Claude Code](https://claude.com/claude-code) installed and logged in. Verify with:
   ```bash
   claude --version
   ```
2. The `humanizer` skill installed (see repo root `README.md` → _Installation_).
3. Python 3.9+ (for the local run) **or** Docker 24+ (for the container run).

---

## Option A — Run locally

```bash
cd integrations/streamlit
./run.sh
```

`run.sh` will:

1. Confirm `claude` is on `$PATH`.
2. Create a `.venv/` and install `streamlit`.
3. Launch the app on http://localhost:8501.

Press `Ctrl+C` in the terminal to stop.

## Option B — Run with Docker

```bash
cd integrations/streamlit
docker compose up --build
```

Then open http://localhost:8501.

The compose file mounts your host's `~/.claude/` into the container so the already-installed `humanizer` skill is available inside.

### Auth inside the container

- **Linux hosts:** Claude Code stores auth tokens in `~/.claude/`, which is mounted — you should be logged in automatically.
- **macOS hosts:** OAuth credentials live in the macOS Keychain (not in `~/.claude/`). On first run the CLI inside the container won't be logged in. Fix either way:
  - Interactive login into the container:
    ```bash
    docker compose exec humanizer claude /login
    ```
    The credentials persist in the mounted `.claude/` volume.
  - Or use an API key fallback: uncomment the `ANTHROPIC_API_KEY` line in `docker-compose.yml`, then:
    ```bash
    ANTHROPIC_API_KEY=sk-ant-... docker compose up
    ```

Stop with `Ctrl+C`, or `docker compose down`.

---

## How it works

`app.py` wraps the user's text in a prompt that:

1. Tells Claude to invoke the `humanizer` skill on the text.
2. Constrains output to only the final rewritten prose — no draft, no "what makes this AI" audit, no summary of changes, no preamble.

It then runs:

```bash
claude -p "<constrained prompt>"
```

…and streams stdout into the right-hand panel. Closing the browser tab (or clicking Humanize again) kills the in-flight subprocess.

## Limitations

- Each click spawns a fresh `claude -p` process (no persistent session). First call has the usual Claude Code startup cost (plugin sync, CLAUDE.md discovery, etc.); subsequent calls are faster.
- Long texts are passed as a positional argument, so input is capped by your shell's `ARG_MAX` (≈256 KB on macOS, ≈128 KB on Linux). Enough for a typical academic paragraph or essay; swap to `--input-format stream-json` if you need more.

## Files

```
integrations/streamlit/
├── app.py              # Streamlit UI + subprocess call to `claude -p`
├── run.sh              # Local launcher (venv + streamlit)
├── Dockerfile          # Container with python + node + claude CLI + streamlit
├── docker-compose.yml  # Mounts ~/.claude, exposes :8501
├── .dockerignore
├── requirements.txt    # streamlit
└── README.md           # This file
```
