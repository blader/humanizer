"""
Streamlit UI that forwards text to the local `claude` CLI and invokes the
`humanizer` skill. No API key required by default; uses the user's existing
Claude Code login. `ANTHROPIC_API_KEY` is also honored if set.

Lifecycle:
- No `claude` process runs at idle.
- Each click spawns a one-shot `claude -p "<prompt>"` subprocess.
- The subprocess exits on its own once the answer is finished.
- Clicking Humanize again kills any still-running subprocess first.
- Closing the browser alone does NOT kill an in-flight subprocess — it
  will self-terminate within seconds when claude finishes the request.
  To stop the server itself, Ctrl+C the terminal (local) or
  `docker compose down` (container). See README for details.
"""

import atexit
import os
import re
import shutil
import subprocess

import streamlit as st

CLAUDE_BIN = shutil.which("claude") or os.path.expanduser("~/.local/bin/claude")

PROMPT_TEMPLATE = """Invoke the humanizer skill on the text below and rewrite it so it does not look AI-generated.

OUTPUT RULES (STRICT):
- Output ONLY the final rewritten prose.
- No draft version, no "what makes it AI" analysis, no summary of changes.
- No preamble ("Here is...", "I've rewritten..."), no closing remarks.
- No markdown headers, no --- separators, no surrounding quotes.
- First character of your response must be the first character of the rewritten text.
- Last character must be the last character of the rewritten text.

Text to humanize:

{text}
"""

_PREAMBLE_RE = re.compile(
    r"^(?:Here(?:'s| is)\b|Below is\b|Sure[,!.]?|Certainly[,!.]?|"
    r"I(?:'ve| have)\s+rewritten\b|Got it[,!.]?|Okay[,!.]?|Alright[,!.]?|"
    r"Rewritten text:|Output:|Result:)[^\n]*\n+",
    re.IGNORECASE,
)
_TRAILING_RE = re.compile(
    r"\n+(?:---+\s*\n+)?\*{0,2}(?:Summary|Changes?|Notes?|What makes)[^\n]*\n[\s\S]*$",
    re.IGNORECASE,
)
_CODEFENCE_RE = re.compile(r"^\s*```[a-zA-Z]*\n(.*?)\n```\s*$", re.DOTALL)


def _clean_output(text: str) -> str:
    """Defensive post-processing in case the model leaks preambles or the
    skill's default 'Summary of changes' block despite the strict prompt."""
    t = (text or "").strip()
    m = _CODEFENCE_RE.match(t)
    if m:
        t = m.group(1).strip()
    t = _PREAMBLE_RE.sub("", t, count=1).strip()
    t = _TRAILING_RE.sub("", t, count=1).strip()
    if len(t) >= 2 and t[0] in '"\'' and t[-1] == t[0]:
        t = t[1:-1].strip()
    return t


def _kill(proc):
    if proc is None:
        return
    try:
        if proc.poll() is None:
            proc.kill()
    except Exception:
        pass


st.set_page_config(page_title="Humanizer", layout="wide")
st.title("Humanizer")
st.caption(
    "Paste text → click **Humanize** → get the final rewritten prose. "
    "Uses your local `claude` CLI + the `humanizer` skill. No API key required."
)

col_in, col_out = st.columns(2)

with col_in:
    st.subheader("Input")
    text = st.text_area(
        "Input",
        height=560,
        key="input_text",
        label_visibility="collapsed",
        placeholder="Paste the AI-sounding text here…",
    )
    go = st.button("Humanize", type="primary", use_container_width=True)

with col_out:
    st.subheader("Output")
    status_slot = st.empty()
    output_slot = st.empty()

if go and text.strip():
    _kill(st.session_state.get("proc"))

    prompt = PROMPT_TEMPLATE.format(text=text)
    proc = subprocess.Popen(
        [CLAUDE_BIN, "-p", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=0,
    )
    st.session_state["proc"] = proc
    atexit.register(_kill, proc)

    status_slot.info(
        "⏳ Running humanizer skill via `claude -p`… first call has ~3–5 s "
        "startup overhead, then streams."
    )

    def stream():
        while True:
            chunk = proc.stdout.read(32)
            if not chunk:
                break
            yield chunk
        proc.wait()

    with st.spinner("Humanizing…"):
        raw = output_slot.write_stream(stream())

    if proc.returncode != 0:
        err = (proc.stderr.read() or "").strip()
        status_slot.empty()
        output_slot.error(
            f"`claude` exited with code {proc.returncode}.\n\n"
            f"Check that Claude Code is installed and logged in (`claude /login`) "
            f"or that `ANTHROPIC_API_KEY` is set.\n\n"
            f"stderr:\n```\n{err}\n```"
        )
        st.session_state.pop("final_text", None)
    else:
        cleaned = _clean_output(raw or "")
        st.session_state["final_text"] = cleaned
        status_slot.success("Done. Use the copy icon in the top-right of the box below.")
        output_slot.code(cleaned, language=None, wrap_lines=True)

elif "final_text" in st.session_state:
    output_slot.code(st.session_state["final_text"], language=None, wrap_lines=True)
