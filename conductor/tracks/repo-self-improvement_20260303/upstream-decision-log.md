# Self-Improvement Decision Record

**Track:** `repo-self-improvement_20260303`

**Generated:** 2026-03-14T02:52:56.747Z

**Local Repository:** edithatogo/humanizer-next

**Upstream Repository:** blader/humanizer

---

## How to use this file

- This file is the track-owned decision record for the weekly self-improvement workflow.
- The workflow refreshes the candidate decisions from live repository data.
- Maintainers should edit the decision text only when making an explicit final call, rather than rewriting the whole file from scratch.
- Suggested decisions are not final approvals. They are triage inputs for the track.

## Decision Rubric

- Evidence quality: prefer changes grounded in reproducible examples or clear user pain, not vibes.
- Pattern overlap: avoid adding new rules that duplicate existing Humanizer patterns without meaningfully improving coverage.
- False-positive risk: reject changes that are likely to flatten legitimate human style or technical writing.
- Adapter impact: prefer improvements that do not increase sync complexity or runtime dependencies across supported adapters.

## Local Repository Decisions

- None

## Upstream Repository Decisions

- upstream #58: docs: add MIT LICENSE file (#7)
  Decision: DEFER
  Why: Reasonable repo hygiene improvement, but lower priority than dependency maintenance and evidence-backed skill changes.
- upstream #57: fix: remove horizontal rule separators from SKILL.md (#35)
  Decision: DEFER
  Why: No automation rule matched. Review manually.
- upstream #56: feat: add hyphenated word pair overuse pattern (#42)
  Decision: DEFER
  Why: Potentially useful, but it needs evidence review against the repo rubric: evidence quality, overlap with existing patterns, false-positive risk, and adapter impact.
- upstream #52: feat: improve skill review score from 17% to 89%
  Decision: DEFER
  Why: Potentially useful, but it needs evidence review against the repo rubric: evidence quality, overlap with existing patterns, false-positive risk, and adapter impact.
- upstream #51: feat: Claude-specific humanizer rewrite — 34 patterns, severity ranking, mode system
  Decision: DEFER
  Why: Potentially useful, but it needs evidence review against the repo rubric: evidence quality, overlap with existing patterns, false-positive risk, and adapter impact.
- upstream #49: fix: Claude compatibility
  Decision: REJECT
  Why: Compatibility fixes should be evaluated against the local adapter architecture, not cherry-picked blindly from the upstream single-skill format.
- upstream #47: feat: add OpenCode support
  Decision: REJECT
  Why: OpenCode support is already implemented locally through the adapter distribution path, so this is not a missing capability in humanizer-next.
- upstream #44: feat: live Wikipedia sync for auto-updating AI patterns (v2.3.0)
  Decision: REJECT
  Why: Live upstream fetches add runtime dependencies and instability to a skill-source repo that should stay deterministic and artifact-driven.
