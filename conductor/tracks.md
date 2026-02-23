# Project Tracks

This file tracks all major tracks for the project. Each track has its own detailed plan in its respective folder.

**Track Conventions:** See [`docs/conventions.md`](./docs/conventions.md) for status values, priority levels, dependency syntax, and artifact flow patterns.

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  P0 (Critical Path - Sequential)                                             │
│                                                                              │
│  1. reasoning-failures-stream ──► 2. reasoning-stream-implementation        │
│         │                              │                                     │
│         │                              ├─────────────────────────┐           │
│         │                              │                         │           │
│         ▼                              ▼                         ▼           │
│  3. conductor-review-skill      7. systematic-refactor    4. templates       │
│         │                              │                 │                   │
│         └──────────────────────────────►─────────────────┘                    │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  P1 (Parallel-Safe)                     P2 (After P1)                        │
│                                                                              │
│  5. repo-hardening-release-ops ◄───── 6. downstream-skill-sync              │
│         (parallel-safe)                                                      │
│                                                                              │
│  Run 5 in parallel with 1-4 to save time.                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Active Tracks

Priority order (run sequentially unless marked parallel-safe):

### 1. [ ] repo-hardening-skill-distribution_20260215

**Summary:** Repository hardening and skill distribution optimization - consolidate agent files, organize context files, ensure installability
**Status:** new | **Priority:** P1 | **Dependencies:** none
_Link: [./tracks/repo-hardening-skill-distribution_20260215/](./tracks/repo-hardening-skill-distribution_20260215/)_

### 2. [x] reasoning-failures-stream_20260215 [c623d3e]

**Summary:** LLM reasoning failures stream - source archiving, evidence cataloging, taxonomy, Wikipedia workflow
**Status:** completed | **Priority:** P0 | **Dependencies:** none
_Link: [./tracks/archive/reasoning-failures-stream_20260215/](./tracks/archive/reasoning-failures-stream_20260215/)_

### 2. [x] reasoning-stream-implementation_20260215 [p6q7r8s]

**Summary:** Productize reasoning stream - source fragments, adapters, regression safety
**Status:** completed | **Priority:** P0 | **Dependencies:** reasoning-failures-stream
_Link: [./tracks/reasoning-stream-implementation_20260215/](./tracks/reasoning-stream-implementation_20260215/)_

### 3. [x] conductor-review-skill_20260215 [p6q7r8s]

**Summary:** Humanizer review skill - severity-ordered findings, citation/taxonomy checks
**Status:** completed | **Priority:** P1 | **Dependencies:** reasoning-failures-stream (taxonomy)
_Link: [./tracks/conductor-review-skill_20260215/](./tracks/conductor-review-skill_20260215/)_

### 4. [x] conductor-humanizer-templates_20260215 [o5p6q7r]

**Summary:** Conductor-compatible templates - style toggles, stream switches, review integration
**Status:** completed | **Priority:** P1 | **Dependencies:** reasoning-stream-implementation, conductor-review-skill
_Link: [./tracks/conductor-humanizer-templates_20260215/](./tracks/conductor-humanizer-templates_20260215/)_

### 5. [x] repo-hardening-release-ops_20260215 [r8s9t0u]

**Summary:** CI/CD hardening, release policy, versioning, upstream PR runbook
**Status:** completed | **Priority:** P1 | **Dependencies:** none (parallel-safe)
_Link: [./tracks/repo-hardening-release-ops_20260215/](./tracks/repo-hardening-release-ops_20260215/)_

### 6. [x] downstream-skill-sync-automation_20260215 [q7r8s9t]

**Summary:** Auto-sync downstream repos after version updates
**Status:** completed | **Priority:** P2 | **Dependencies:** repo-hardening-release-ops (release policy)
_Link: [./tracks/downstream-skill-sync-automation_20260215/](./tracks/downstream-skill-sync-automation_20260215/)_

### 7. [x] systematic-refactor-hardening_20260215 [o5p6q7r]

**Summary:** Modular refactor baseline, structural guardrails, maintenance playbook, ADRs
**Status:** completed | **Priority:** P2 | **Dependencies:** reasoning-stream-implementation (hotspot discovery needs new code)
_Link: [./tracks/systematic-refactor-hardening_20260215/](./tracks/systematic-refactor-hardening_20260215/)_

---

### Legacy Active Tracks (pre-2026-02-15)

## [x] Track: Adopt upstream pull requests #3, #4, and #5 from blader/humanizer [d06f5c7]

_Status: completed | Archived: ./tracks/archive/adopt-upstream-prs_20260131/_

## [x] Track: Add Skillshare distribution + AIX validation (skill-distribution_20260131) [e0131db]

_Status: completed | Archived: ./tracks/archive/skill-distribution_20260131/_

## [x] Track: Implement repo management tooling recommendations (Vale scripts, Renovate, npx skills distribution docs) [d06f5c7]

_Status: completed | Archived: ./tracks/archive/repo-tooling-enhancements_20260214/_

---

## Archived Tracks

## [x] Track: Skill Expansion & Portable Compilation

_Link: [./tracks/skill-expansion_20260201/](./tracks/skill-expansion_20260201/)_

## [x] Track: DevOps and Quality Engineering (da248f2)

_Link: [./tracks/devops-quality_20260131/](./tracks/devops-quality_20260131/)_

## [x] Track: Universal Automated Adapters (5067d34)

_Link: [./tracks/universal-automated-adapters_20260131/](./tracks/universal-automated-adapters_20260131/)_

## [x] Track: Expand Humanizer adapters to Qwen CLI and Copilot (5067d34)

_Link: [./tracks/adapters-expansion_20260131/](./tracks/adapters-expansion_20260131/)_

## [x] Track: Create Google Antigravity rules/workflows adapter guidance for Humanizer (5067d34)

_Link: [./tracks/antigravity-rules-workflows_20260131/](./tracks/antigravity-rules-workflows_20260131/)_

## [x] Track: Create a Google Antigravity skill adapter for Humanizer (5067d34)

_Link: [./tracks/antigravity-skills_20260131/](./tracks/antigravity-skills_20260131/)_

## [x] Track: Create a Gemini CLI extension adapter for Humanizer (5067d34)

_Link: [./tracks/gemini-extension_20260131/](./tracks/gemini-extension_20260131/)_

## [x] Track: Build multi-agent Humanizer adapters (Codex CLI, Gemini CLI, Google Antigravity, VS Code) while keeping SKILL.md canonical and unchanged (e2c47dc)
