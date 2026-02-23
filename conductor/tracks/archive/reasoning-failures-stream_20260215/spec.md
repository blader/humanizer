# Spec: LLM Reasoning Failures Stream - Research, Integration, and Wikipedia Update Workflow

## Overview

Create a new Conductor track that introduces a new Humanizer stream focused on LLM reasoning failures, grounded in:

- arXiv paper: https://arxiv.org/abs/2602.06176
- repo: https://github.com/Peiyang-Song/Awesome-LLM-Reasoning-Failures
- additional corroborating sources discovered via research (including claims referenced from https://x.com/benCBai/status/2022860750998356302)

This track includes source acquisition, cataloging, repository documentation and implementation updates, and a headful-browser-assisted workflow for updating the relevant Wikipedia page after user login.

## Functional Requirements

1. Source Acquisition and Archival

- Download the target arXiv paper asset(s) and store them in an `archive/` location in this repository.
- Store citation metadata and source traceability (URL, access date, checksum/hash where practical).
- Preserve reproducibility of source retrieval.
- Add a lightweight provenance manifest (e.g., `archive/sources_manifest.json`) for indexed retrieval history.

2. Research Expansion and Evidence Catalog

- Analyze the provided paper and Awesome repo.
- Search for additional papers, repositories, and articles describing LLM reasoning failures relevant to the target topic.
- Create/update a structured research log that catalogs:
  - source type (paper/repo/article/post),
  - claim summary,
  - reasoning failure category,
  - confidence/quality assessment,
  - citation links.
- Include a "deferred/unverified claims" section for items that cannot be substantiated with primary sources in this track.

3. Repo Documentation Updates

- Add/update a dedicated LLM reasoning failures documentation surface in the Humanizer repo, consistent with existing project structure and style.
- Integrate the new findings into repo docs and source materials used to generate skills.
- Add an editorial policy note that distinguishes:
  - humanization patterns (writing-quality rewrites),
  - reasoning-failure diagnostics (model behavior/evidence claims).

4. Humanizer Skill Architecture and Implementation

- Default architecture for this track: create a separate reasoning-focused module/skill (or subskill stream), keeping core Humanizer skill lean.
- Include explicit rationale in docs for why this separation is chosen.
- Ensure compatibility with existing sync/build workflow (`src/` -> compiled outputs/adapters).
- Define and commit a canonical taxonomy/schema for reasoning-failure categories to keep naming consistent across docs/skills/adapters.
- Enforce minimal evidence threshold for introducing a new taxonomy category:
  - at least 2 independent sources, or
  - 1 strong primary source with clear empirical backing.

5. Wikipedia Update Workflow (Headful Browser + User Login)

- Use a headful browser session.
- Navigate to the target Wikipedia page: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- Pause to allow user login.
- Draft proposed edits in-repo before publishing.
- After login, apply edits that reflect well-sourced, neutral, verifiable findings from the research set.
- Record edit evidence in repo notes/docs (diff text, permalink/revision ID, timestamp, summary).

6. Recommendations and Follow-on Design Notes

- Provide recommendations for subsequent tracks (review skill, conductor templates/workflows, CI/CD and release hardening, downstream sync workflows).
- Capture decision points that should be revisited later.

## Non-Functional Requirements

- Consistency: align naming, format, and structure with existing Humanizer/Conductor conventions.
- Traceability: every substantive claim in new reasoning-failure docs is cited to a source.
- Maintainability: modular structure that prevents uncontrolled growth of core skill files.
- Reproducibility: retrieval and update steps are scriptable/documented where feasible.
- Safety/neutrality: Wikipedia edits must remain neutral point-of-view and source-backed.
- Auditability: retain a pre-publish draft and post-publish revision trace.

## Source-Quality Gate

- Each major claim must cite at least one primary source (peer-reviewed paper, official repository/material, or equivalent authoritative source).
- Claims based only on social posts must be labeled "unverified" until supported.
- Evidence confidence levels must be explicit.

## Wikipedia Readiness Checklist

Before publishing edits:

- Proposed edit text is drafted in-repo.
- Every changed sentence is mapped to citation(s).
- Wording is neutral, concise, and avoids synthesis beyond cited content.
- Any disputed/weakly sourced claims are excluded.

## Acceptance Criteria

- [ ] arXiv source materials are archived in-repo with metadata.
- [ ] Provenance manifest is present and populated for newly collected sources.
- [ ] Research log exists and includes additional sources beyond the initial paper/repo pair.
- [ ] Unverified/deferred claims are explicitly documented.
- [ ] Repo has an updated/dedicated LLM reasoning failures documentation page with citations.
- [ ] Editorial policy note distinguishing writing patterns vs reasoning diagnostics is committed.
- [ ] A separate reasoning-focused module/skill stream is added (default architecture for this track), with implementation notes.
- [ ] Canonical reasoning-failure taxonomy/schema is committed and used consistently.
- [ ] Taxonomy changelog (`TAXONOMY_CHANGELOG.md`) exists for tracking future evolution.
- [ ] Headful browser flow is executed; user can log in; page updates are applied and recorded.
- [ ] Wikipedia edit status is checked at 48h; reversion is documented if it occurs.
- [ ] Pre-publish wiki draft and post-publish revision evidence are captured.
- [ ] Existing Humanizer behavior has no unintended regressions (tests/validation run).
- [ ] Pre-commit hook validates `sources_manifest.json` schema on changes.

## Success Metrics

| Metric                     | Target                             | Measurement                               |
| -------------------------- | ---------------------------------- | ----------------------------------------- |
| Primary sources archived   | ≥ 3 (paper + repo + additional)    | Count in `sources_manifest.json`          |
| Taxonomy categories        | ≥ 5 distinct categories            | Count in `reasoning-failures-taxonomy.md` |
| Evidence quality           | 100% of claims cite primary source | Audit `docs/reasoning-failures.md`        |
| Wikipedia edit persistence | 48h without reversion              | Manual check at 48h                       |

## Out of Scope (for this track)

- Building and fully implementing the conductor "review" command integration.
- Building full conductor template/workflow packs for Humanizer.
- Full CI/CD overhaul, release automation redesign, and cross-repo propagation automation.
- Broad refactor/hardening beyond what is required to safely deliver this track's objectives.

## Risks and Mitigations

| Risk                                | Likelihood | Impact | Mitigation                                                            |
| ----------------------------------- | ---------- | ------ | --------------------------------------------------------------------- |
| Wikipedia edit reverted             | Medium     | Low    | Document in `wikipedia-edit-history.md`; draft revised edit for retry |
| arXiv paper updated after archiving | Low        | Low    | Record version/fetch date; re-fetch if cited version changes          |
| Taxonomy evolves rapidly            | Medium     | Medium | `TAXONOMY_CHANGELOG.md` tracks changes; version taxonomy schema       |
| Social-only claims proliferate      | Medium     | Low    | Strict "unverified" labeling; defer to future research                |
| Reasoning stream bloats core skill  | Low        | Medium | Separate module by default; strict boundary enforcement               |
