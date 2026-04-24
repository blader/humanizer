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
# Match the humanizer skill's own trailing metadata blocks only. Require
# either a `---` separator + bold header, or a bolded skill-specific phrase
# ("Summary of changes", "Changes made", "What makes … AI …", "Draft rewrite",
# "Now make it not"). This avoids truncating legitimate prose that merely
# begins with a word like "Notes" or "Summary".
_TRAILING_RE = re.compile(
    r"\n+(?:---+\s*\n+)?\*{2}"
    r"(?:Summary\s+of\s+changes?|Changes?\s+made|What\s+makes[^\n]*AI[^\n]*|"
    r"Draft\s+rewrite|Now\s+make\s+it\s+not)"
    r"[^\n]*\*{2}[\s\S]*$",
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


@st.cache_resource
def _proc_holder():
    """Single shared handle for the current subprocess. `atexit` is
    registered exactly once (via cache_resource) so it doesn't accumulate
    across Streamlit reruns."""
    holder = {"proc": None}
    atexit.register(lambda: _kill(holder["proc"]))
    return holder


st.set_page_config(page_title="Humanizer", layout="wide")
st.title("Humanizer")
st.caption(
    "Paste text → click **Humanize** → get the final rewritten prose. "
    "Uses your local `claude` CLI + the `humanizer` skill."
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
    holder = _proc_holder()
    _kill(holder["proc"])

    prompt = PROMPT_TEMPLATE.format(text=text)
    # --no-session-persistence keeps each invocation fully ephemeral: no
    # session file is written to disk, and no prior session can be picked
    # up by the next click. Combined with the default absence of -c / -r,
    # each Humanize click is a brand-new stateless call.
    proc = subprocess.Popen(
        [CLAUDE_BIN, "-p", "--no-session-persistence", prompt],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    holder["proc"] = proc

    status_slot.info(
        "⏳ Running humanizer skill — first call has ~3–5 s startup "
        "overhead. Output appears when the run finishes."
    )

    with st.spinner("Humanizing…"):
        stdout, stderr = proc.communicate()

    if proc.returncode != 0:
        status_slot.empty()
        output_slot.error(
            f"`claude` exited with code {proc.returncode}.\n\n"
            f"Check that Claude Code is installed and logged in (`claude /login`) "
            f"or that `ANTHROPIC_API_KEY` is set.\n\n"
            f"stderr:\n```\n{(stderr or '').strip()}\n```"
        )
        st.session_state.pop("final_text", None)
    else:
        cleaned = _clean_output(stdout or "")
        st.session_state["final_text"] = cleaned
        status_slot.success("Done. Use the copy icon in the top-right of the box below.")
        output_slot.code(cleaned, language=None, wrap_lines=True)

elif "final_text" in st.session_state:
    output_slot.code(st.session_state["final_text"], language=None, wrap_lines=True)
