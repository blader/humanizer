#!/usr/bin/env bash
# One-click launcher for the Streamlit wrapper. Spins up a local venv,
# installs Streamlit, and runs app.py which shells out to `claude -p`.

set -e
cd "$(dirname "$0")"

if ! command -v claude >/dev/null 2>&1; then
  echo "claude CLI not found in PATH. Install Claude Code first:"
  echo "  https://claude.com/claude-code"
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 not found. Install Python 3 and retry."
  exit 1
fi

if [ ! -d ".venv" ]; then
  echo "Creating local Python venv..."
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate

if ! python -c "import streamlit" >/dev/null 2>&1; then
  echo "Installing dependencies..."
  pip install --quiet --upgrade pip
  pip install --quiet -r requirements.txt
fi

echo "Ready. Opening http://localhost:8501 — Ctrl+C here to stop."

exec streamlit run app.py \
  --server.headless false \
  --browser.gatherUsageStats false \
  --server.fileWatcherType none
