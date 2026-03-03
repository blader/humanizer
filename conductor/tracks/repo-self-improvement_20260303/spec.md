# Track Specification: Repository Self-Improvement Cycle #1 (2026-03-03)

**Track ID:** `repo-self-improvement_20260303`

**Priority:** P1 (High - Repository Health & Maintenance)

**Type:** Maintenance, Enhancement, Technical Debt Reduction, Self-Improvement

**Estimated Duration:** 2-3 weeks

**Ralph Loop Integration:** Enabled (Phases 2, 3, 6)

**Data Gathered:** 2026-03-03T00:00:00Z

---

## Executive Summary

This is the **first recurring self-improvement cycle** for the humanizer-next repository. The track addresses:

1. **9 open Dependabot PRs** requiring review and merge
2. **20 upstream PRs** from `blader/humanizer` requiring assessment
3. **23 upstream issues** to evaluate for relevance and adoption
4. **Critical bugs** affecting Claude compatibility and shell safety
5. **Major architectural decisions** on modularization and live Wikipedia sync
6. **Security hardening** with no current vulnerabilities but missing policy documentation

---

## 1. Local Repository Analysis (edithatogo/humanizer-next)

### 1.1 Open Pull Requests

**Total:** 9 open PRs (all Dependabot automated updates)

| PR # | Title | Type | Age | Priority | Action |
|------|-------|------|-----|----------|--------|
| #20 | `build(deps-dev): bump markdownlint-cli from 0.47.0 to 0.48.0` | deps | Mar 3, 2026 | Low | Merge after changelog review |
| #19 | `build(deps-dev): bump lint-staged from 16.2.7 to 16.3.1` | deps | Mar 2, 2026 | Low | Merge after changelog review |
| #18 | `build(deps-dev): bump @types/node from 25.1.0 to 25.3.3` | deps | Mar 2, 2026 | Low | Merge |
| #15 | `build(deps-dev): bump eslint from 9.39.2 to 10.0.2` | deps (major) | Feb 24, 2026 | **High** | Review breaking changes, test |
| #10 | `build(deps-dev): bump husky from 8.0.3 to 9.1.7` | deps (major) | Feb 16, 2026 | **High** | Config migration needed |
| #7 | `build(deps): bump actions/checkout from 4 to 6` | deps (major) | Feb 16, 2026 | Medium | Update CI workflow |
| #6 | `build(deps): bump actions/setup-python from 5 to 6` | deps (major) | Feb 16, 2026 | Medium | Update CI workflow |
| #5 | `build(deps): bump actions/setup-node from 4 to 6` | deps (major) | Feb 16, 2026 | Medium | Update CI workflow |
| #4 | `build(deps): bump github/codeql-action from 3 to 4` | deps (major) | Feb 16, 2026 | Medium | Update CI workflow |

**Summary:**
- Total open PRs: 9
- Dependabot PRs: 9 (100%)
- Human-authored PRs: 0
- Major version updates: 6 (require careful testing)
- Minor version updates: 3 (low risk)

**Security Status:**
- No merge conflicts detected
- All PRs have clean mergeable state
- No security vulnerabilities reported

---

### 1.2 Security Status

| Category | Status | Notes |
|----------|--------|-------|
| Security Advisories | None published | Clean record |
| SECURITY.md | **Missing** | ⚠️ Needs creation |
| Known Vulnerabilities | None reported | Clean |
| Dependabot Alerts | All clear | No vulnerable dependencies |

**Action Required:** Create SECURITY.md with vulnerability reporting process

---

### 1.3 Repository Health Metrics

**File Sizes:**
- `SKILL.md`: 941 lines (⚠️ approaching maintainability limit)
- `SKILL_PROFESSIONAL.md`: 963 lines (⚠️ approaching maintainability limit)
- `QWEN.md`: 2000+ lines (❌ exceeds recommended size)
- `AGENTS.md`: ~200 lines (✅ good)

**Adapter Count:** 12 platforms
- amp, antigravity-rules-workflows, antigravity-skill
- claude, cline, codex, copilot
- gemini-extension, kilo, opencode
- qwen-cli, vscode

**CI/CD Status:**
- GitHub Actions versions: Outdated (checkout v4, setup-python v5, setup-node v4, codeql-action v3)
- Pre-commit hooks: Configured and functional
- Test coverage: Needs verification

---

## 2. Upstream Repository Analysis (blader/humanizer)

### 2.1 Open Issues Summary

**Total:** 23 open issues

**By Category:**
| Category | Count | Priority Issues |
|----------|-------|-----------------|
| 🐛 Bugs | 3 | #48 (Claude format), #41 (YAML frontmatter), #37 (shell leak) |
| ✨ Feature Requests | 4 | #34 (Codex), #31/#29 (tiered architecture), #25 (SkillShare) |
| 💡 Enhancements | 2 | #42 (hyphenation), #35 (remove AI signs from skill.md) |
| 📄 Documentation | 1 | #27 (research matrix) |
| Discussion/Unclear | 13 | Various |

**Critical Issues to Address:**

#### Issue #48: Format is wrong for Claude.ai
- **Problem:** Claude.ai cannot properly parse the current skill format
- **Impact:** Users cannot use Humanizer in Claude.ai platform
- **Fix:** PR #49 addresses this
- **Priority:** **Critical** - affects core functionality

#### Issue #37: Skill content leaks into shell on load
- **Problem:** Markdown blockquotes (`>`) in skill docs escape TUI and execute as shell commands
- **Impact:** Creates junk files (`The`, `It`, `None`, etc.), 31+ shell errors, session corruption
- **Root Cause:** `>` redirection operator in zsh interprets blockquotes as file creation
- **Priority:** **Critical** - data loss risk, workflow disruption

#### Issue #41: Unexpected key in skill.md frontmatter
- **Problem:** YAML frontmatter validation errors
- **Impact:** May break skill loading in some platforms
- **Priority:** **High** - compatibility issue

---

### 2.2 Open Pull Requests Summary

**Total:** 20 open PRs

**By Category:**
| Category | Count | Key PRs |
|----------|-------|---------|
| 🐛 Bug Fixes | 4 | #49 (Claude), #38 (quotes), #16 (AI-signatures), #3 (YAML) |
| ✨ Features | 8 | #44 (Wikipedia sync), #47 (OpenCode), #30 (tiered arch), #28 (distribution) |
| 💡 Enhancements | 5 | #39 (patterns 25-27), #26 (prompting), #17 (offline robustness), #5 (single quotes) |
| 📄 Documentation | 3 | #33 (AdaL install), #14 (Conductor), #4 (grammar) |
| 🌐 i18n | 3 | #11 (humanizer-pro), #9 (Russian), #6 (German) |

---

### 2.3 Critical PRs Requiring Immediate Assessment

#### PR #49: fix: Claude compatibility
- **Status:** Open, 1 comment, no reviews
- **Author:** fernandosmither
- **Created:** Feb 28, 2026
- **Addresses:** Issue #48
- **Changes:** Not visible in fetch (need to review Files Changed tab)
- **Merge Conflicts:** None
- **Reviews:** None yet
- **Priority:** **Critical** - fixes Claude.ai breakage
- **Recommendation:** Review immediately, test in Claude.ai, merge if functional

#### PR #44: feat: live Wikipedia sync for auto-updating AI patterns (v2.3.0)
- **Status:** Open, 4 tasks completed
- **Author:** justinmassa
- **Created:** Feb 26, 2026
- **Implementation:**
  - Fetches patterns from Wikipedia MediaWiki API via `curl`
  - 7-day cache refresh interval
  - Graceful fallback to static patterns on fetch failure
  - Adds `Bash` and `WebFetch` to allowed-tools
  - `.gitignore` for runtime cache file
- **Benefits:**
  - Auto-updates patterns without manual skill updates
  - Community-discovered AI tells picked up automatically
  - Tested with cache miss, cache creation, fallback scenarios
- **Concerns:**
  - ⚠️ External dependency on Wikipedia API stability
  - ⚠️ User-Agent arms race (WebFetch already blocked with 403)
  - ⚠️ Security: `curl` against external URLs in skill processing text
  - ⚠️ No pattern validation/sanitization
  - ⚠️ Cache integrity checks missing
  - ⚠️ Co-authored by "Claude Opus 4.6" (ironic for AI detection tool)
- **Priority:** **High** - major feature but needs security review
- **Recommendation:** 
  - Security review required before merge
  - Add pattern validation
  - Implement cache integrity checks
  - Consider opt-in vs. default behavior

#### PR #39: Add patterns #25-27: persuasive tropes, signposting, fragmented headers
- **Status:** Open
- **Author:** jacobjmc
- **Created:** Feb 22, 2026
- **New Patterns:**
  - **Pattern #25:** Persuasive tropes (clichéd rhetorical devices)
  - **Pattern #26:** Signposting (excessive structural markers)
  - **Pattern #27:** Fragmented headers (incomplete/broken heading structures)
- **Priority:** **High** - expands detection coverage
- **Recommendation:** Review pattern definitions, test on sample texts, merge if quality is good

#### PR #30: feat: implement tiered architecture (v3.0.0)
- **Status:** Open, 1 review
- **Author:** edithatogo
- **Created:** Jan 31, 2026
- **Architecture:** Router-Retriever pattern with modular compiler
- **Changes:**
  - Creates `modules/` directory with specialized detection modules
  - Refactors `SKILL.md` as router coordinating module execution
  - Modules: Core Patterns, Technical, Academic, Governance
  - Adds severity classification (Critical/High/Medium/Low)
  - Technical literal preservation rules
  - Chain-of-thought reasoning examples
  - Self-verification checklist
- **Benefits:**
  - Better maintainability through separation of concerns
  - SOTA prompting improvements
  - Python migration with 100% test coverage
  - Pre-commit hooks (Ruff, Mypy, Markdownlint)
  - CI/CD automation
  - Adapter validation system
- **Drawbacks:**
  - Increased complexity vs. monolithic design
  - More files to maintain
  - Router overhead for simple tasks
  - 84 commits - large change surface
- **Priority:** **Critical** - major architectural decision
- **Recommendation:** 
  - Architecture decision record (ADR) required
  - Evaluate hybrid approach (modular source, compiled output)
  - Assess migration effort for existing adapters

---

### 2.4 High-Priority PRs

#### PR #47: feat: add OpenCode support
- **Status:** Open
- **Assessment:** We already have `adapters/opencode/` - need to compare implementations
- **Priority:** Medium
- **Action:** Compare with existing adapter, merge improvements

#### PR #28: feat: Skill distribution & validation (Skillshare + AIX)
- **Status:** Open, 2 reviews
- **Assessment:** Distribution infrastructure for SkillShare/AIX platforms
- **Priority:** Medium
- **Action:** Review compatibility with current `scripts/sync-adapters.js`

#### PR #17: feat: offline robustness, non-text slop pattern
- **Status:** Open, 3 reviews, 6 comments
- **Assessment:** Enhanced detection patterns
- **Priority:** High
- **Action:** Review new patterns, test on sample texts

#### PR #16: fix: address AI-signatures in code (issue #12)
- **Status:** Open, 1 review, 10 comments
- **Assessment:** Fixes AI-generated code pattern detection
- **Priority:** High
- **Action:** Verify alignment with Technical Module, merge

#### PR #5: feat: Add detection for AI-style primary single quotes
- **Status:** Open, 2 reviews
- **Assessment:** Pattern #25 (primary single quotes as delimiters)
- **Priority:** Medium
- **Action:** Check if already implemented in current SKILL.md

---

### 2.5 PRs to Close/Defer

#### PR #36: Claude/cowork plugin conversion twf64
- **Author:** teslaproduuction
- **Assessment:** Appears to be low-quality/spam
- **Recommendation:** Close with polite explanation

#### PR #9: Add Russian language adaptation
- **Assessment:** Language-specific, not needed unless requested
- **Recommendation:** Defer until community request

#### PR #6: Add German language support with auto-detection
- **Assessment:** Language-specific, not needed unless requested
- **Recommendation:** Defer until community request

---

### 2.6 Already Implemented (Close with Note)

#### PR #20: feat: migrate build system to Node.js
- **Status:** Already done - we have `package.json`, `scripts/`
- **Action:** Close with note that implementation exists

#### PR #14: Conductor: Complete Project Setup
- **Status:** Already done - we have full conductor workflow
- **Action:** Close with note

#### PR #11: Add professional version of the skill (humanizer-pro)
- **Status:** Already done - we have `SKILL_PROFESSIONAL.md`
- **Action:** Close with note

---

## 3. SOTA Approaches Analysis

### 3.1 Tiered Architecture (v3.0.0)

**Pattern:** Router-Retriever with modular compiler

**Key Features:**
1. **Context-Aware Routing:** Analyzes input type (code, academic, governance, general)
2. **Module Activation:** Only runs relevant detection modules
3. **Severity Classification:** Critical/High/Medium/Low pattern ratings
4. **Technical Literal Preservation:** Protects code blocks, URLs, identifiers
5. **Chain-of-Thought Reasoning:** Explicit reasoning before applying fixes
6. **Self-Verification:** Checklist before outputting changes

**Implementation Status:**
- Referenced in `SKILL_PROFESSIONAL.md` but modules don't exist as files
- Modules mentioned: `SKILL_CORE.md`, `SKILL_TECHNICAL.md`, `SKILL_ACADEMIC.md`, `SKILL_GOVERNANCE.md`, `SKILL_REASONING.md`
- **Gap:** These files are missing - only referenced, not implemented

**Recommendation:** Implement modular architecture with hybrid approach:
- Modular source files in `src/modules/`
- Compiled monolithic output for distribution
- Maintains backward compatibility with adapters

---

### 3.2 Live Wikipedia Sync

**Pattern:** External API integration with caching

**Key Features:**
1. **Auto-Update:** Fetches latest patterns from Wikipedia MediaWiki API
2. **Caching:** 7-day refresh interval
3. **Fallback:** Graceful degradation to static patterns
4. **Tool Requirements:** `Bash` (curl) and `WebFetch`

**Security Concerns:**
1. External dependency on Wikipedia API
2. `curl` execution in skill context
3. No pattern validation/sanitization
4. Cache integrity not verified
5. AI co-authorship (trust issue)

**Recommendation:** Implement with safeguards:
- Opt-in behavior (not default)
- Pattern validation against schema
- Cache integrity checks (hash verification)
- Security review of curl implementation
- Logging for fetch failures

---

### 3.3 Pattern Expansion (#25-27)

**New Patterns:**
1. **Persuasive Tropes:** Clichéd rhetorical devices
2. **Signposting:** Excessive structural markers ("First...", "Second...", "In conclusion...")
3. **Fragmented Headers:** Incomplete or broken heading structures

**Recommendation:** Adopt after quality review

---

### 3.4 Severity Classification

**Pattern:** Critical/High/Medium/Low ratings for each detection

**Benefits:**
- Users can prioritize fixes
- Better transparency on impact
- Aligns with security industry standards

**Recommendation:** Adopt

---

## 4. Repository Architecture Assessment

### 4.1 Current Structure

```
humanizer-next/
├── SKILL.md (941 lines) ⚠️
├── SKILL_PROFESSIONAL.md (963 lines) ⚠️
├── QWEN.md (2000+ lines) ❌
├── AGENTS.md (~200 lines) ✅
├── adapters/ (12 platforms)
├── conductor/ (project management)
├── src/ (skill fragments)
├── scripts/ (automation)
└── docs/ (documentation)
```

### 4.2 Identified Issues

**1. Missing Modules:**
- `SKILL_PROFESSIONAL.md` references modules that don't exist
- Modules are conceptual, not implemented as files

**2. File Size Concerns:**
- QWEN.md at 2000+ lines is unmaintainable
- SKILL.md approaching 1000-line threshold

**3. CI/CD Gaps:**
- GitHub Actions versions outdated
- No automated release workflow
- No file size monitoring

**4. Adapter Sync:**
- Manual version tracking
- No automated drift detection

---

## 5. Goals

### Primary Objectives

1. ✅ Clear 9 Dependabot PRs (review, test, merge)
2. ✅ Create SECURITY.md
3. ✅ Assess 20 upstream PRs with decision log
4. ✅ Update GitHub Actions to latest versions
5. ✅ Architecture decision on modularization
6. ✅ Ralph Loop integration for self-improvement

### Secondary Objectives

1. ✅ Adapter synchronization verification
2. ✅ Adopt patterns #25-27
3. ✅ Documentation updates
4. ✅ Release automation configuration

---

## 6. Success Criteria

1. Zero open Dependabot PRs
2. SECURITY.md published
3. Upstream decision log for all 20 PRs
4. All GitHub Actions updated
5. ADR-001 on modularization published
6. Ralph Loop workflow running
7. All adapters validated

---

## 7. Constraints

- Canonical skills must remain functional
- Adapter compatibility maintained
- Ralph Loop must not disrupt conductor
- Upstream adoption respects licensing

---

## 8. Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| ESLint v10 breaking changes | High | Medium | Test in isolation, review changelog |
| Husky v9 config migration | High | Medium | Follow migration guide, test hooks |
| Wikipedia sync security | High | Medium | Security review, opt-in behavior |
| Modularization breaks adapters | High | Medium | Hybrid compile approach |
| Ralph Loop infinite cycles | Medium | Low | Max iterations, completion criteria |

---

## 9. Recommended Next Steps

1. **Immediate (Day 1-2):**
   - Merge low-risk Dependabot PRs (#18, #19, #20)
   - Create SECURITY.md
   - Review PR #49 (Claude compatibility)

2. **Week 1:**
   - Test major dependency updates (eslint v10, husky v9)
   - Create upstream adoption branch
   - Run Ralph Loop Phase 1 analysis

3. **Week 2:**
   - Architecture decision on modularization
   - Security review of Wikipedia sync
   - Adopt patterns #25-27

4. **Week 3:**
   - Implement chosen architecture
   - Configure automated releases
   - Track closure and archival

---

*Specification Version: 1.0*
*Data Gathered: 2026-03-03*
*Track Status: Ready for Execution*
