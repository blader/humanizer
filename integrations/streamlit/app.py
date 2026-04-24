"""
Streamlit UI that forwards text to the local `claude` CLI and invokes the
`humanizer` skill. No API key: relies on the user's existing Claude Code login.

Paste text → click Humanize → get the final rewritten prose, with the
skill's usual draft / audit / summary suppressed.
"""

import atexit
import os
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
    "Paste text → click Humanize → get the final rewritten prose. "
    "Uses your local `claude` CLI + the `humanizer` skill. No API key."
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

    def stream():
        while True:
            chunk = proc.stdout.read(32)
            if not chunk:
                break
            yield chunk
        proc.wait()

    with col_out:
        output_slot.empty()
        final = st.write_stream(stream())

    if proc.returncode != 0:
        err = (proc.stderr.read() or "").strip()
        st.error(
            f"`claude` exited with code {proc.returncode}.\n\n"
            f"Check that Claude Code is installed (`which claude`) and logged in.\n\n"
            f"stderr:\n```\n{err}\n```"
        )
    else:
        st.session_state["final_text"] = (final or "").strip()

elif "final_text" in st.session_state:
    with col_out:
        output_slot.markdown(st.session_state["final_text"])
