# Upstream PR Decision Log

**Track:** `repo-self-improvement_20260303`

**Generated:** 2026-03-03

**Upstream Repository:** blader/humanizer

---

## Decision Summary

| PR # | Title | Type | Decision | Status | Notes |
|------|-------|------|----------|--------|-------|
| 49 | fix: Claude compatibility | Bug Fix | **ADOPT** | Pending | Critical fix for Claude.ai users |
| 44 | live Wikipedia sync v2.3.0 | Feature | **ADOPT with safeguards** | Pending | Security review required, opt-in behavior |
| 39 | patterns #25-27 | Enhancement | **ADOPT** | Pending | Expands detection coverage |
| 30 | tiered architecture v3.0.0 | Architecture | **HYBRID** | Pending | Modular source, compiled output (see ADR-001) |
| 47 | add OpenCode support | Feature | **REVIEW** | Pending | Compare with existing adapter |
| 28 | Skill distribution & validation | Feature | **ADOPT** | Pending | Compatible with current sync |
| 17 | offline robustness, non-text slop | Feature | **ADOPT** | Pending | Enhanced detection |
| 16 | AI-signatures in code fix | Bug Fix | **ADOPT** | Pending | Aligns with Technical Module |
| 5 | primary single quotes detection | Enhancement | **ALREADY DONE** | Close | Pattern #25 exists |
| 20 | migrate build to Node.js | Infrastructure | **ALREADY DONE** | Close | We have package.json |
| 14 | Conductor project setup | Infrastructure | **ALREADY DONE** | Close | Full conductor implemented |
| 11 | humanizer-pro version | Feature | **ALREADY DONE** | Close | SKILL_PROFESSIONAL.md exists |
| 38 | straight quotes in WARP.md | Documentation | **ADOPT** | Pending | Documentation fix |
| 36 | Claude/cowork plugin | Feature | **REJECT** | Close | Low quality/spam |
| 33 | AdaL installation docs | Documentation | **ADOPT** | Pending | Useful addition |
| 26 | SOTA prompting improvements | Enhancement | **REVIEW** | Pending | Assess overlap with tiered arch |
| 19 | [need to fetch] | ? | TBD | - | - |
| 18 | [need to fetch] | ? | TBD | - | - |
| 9 | Russian language adaptation | i18n | **DEFER** | Close | Not needed unless requested |
| 6 | German language support | i18n | **DEFER** | Close | Not needed unless requested |
| 4 | grammar fixes | Documentation | **REVIEW** | Pending | Assess quality |
| 3 | YAML description fix | Bug Fix | **ADOPT** | Pending | Frontmatter correction |

**Legend:**
- **ADOPT:** Merge into repository
- **ADOPT with safeguards:** Merge with additional conditions
- **HYBRID:** Partial adoption or modified implementation
- **REVIEW:** Needs detailed assessment before decision
- **ALREADY DONE:** Close with note that we have equivalent
- **DEFER:** Close but can reopen if community requests
- **REJECT:** Close with polite explanation

---

## Detailed Decisions

### PR #49: fix: Claude compatibility

**Decision:** ADOPT

**Priority:** Critical

**Rationale:**
- Fixes issue #48 (Claude.ai format breakage)
- No merge conflicts
- Addresses critical platform compatibility
- 1 comment, no reviews yet - needs testing

**Action Items:**
- [ ] Review Files Changed tab for specific modifications
- [ ] Test in Claude.ai platform
- [ ] Merge if functional
- [ ] Update install-matrix.md with Claude.ai notes

**Status:** Pending testing

---

### PR #44: feat: live Wikipedia sync for auto-updating AI patterns (v2.3.0)

**Decision:** ADOPT with safeguards

**Priority:** High

**Rationale:**
- Valuable feature for automatic pattern updates
- Community discoveries picked up without manual updates
- Tested with fallback mechanism
- **BUT** security concerns require mitigation

**Safeguards Required:**
1. **Opt-in behavior** - Not enabled by default
2. **Pattern validation** - Schema-based sanitization
3. **Cache integrity** - Hash verification
4. **Security review** - curl implementation audit
5. **Logging** - Fetch failure tracking
6. **Human review** - Pattern changes logged for review

**Action Items:**
- [ ] Security review of curl implementation
- [ ] Add pattern validation schema
- [ ] Implement cache hash verification
- [ ] Add opt-in configuration flag
- [ ] Create logging for fetch failures
- [ ] Update documentation with feature description
- [ ] Merge after safeguards implemented

**Status:** Pending security review

---

### PR #39: Add patterns #25-27: persuasive tropes, signposting, fragmented headers

**Decision:** ADOPT

**Priority:** High

**Rationale:**
- Expands detection coverage
- Patterns align with AI writing research
- No overlap with existing patterns
- Improves detection quality

**Action Items:**
- [ ] Review pattern definitions for clarity
- [ ] Test on sample texts with known AI patterns
- [ ] Verify examples are effective
- [ ] Add to SKILL.md and SKILL_PROFESSIONAL.md
- [ ] Update pattern count in version metadata
- [ ] Sync adapters after merge

**Status:** Pending pattern review

---

### PR #30: feat: implement tiered architecture (v3.0.0)

**Decision:** HYBRID (Modular source, compiled output)

**Priority:** Critical

**Rationale:**
- Modular architecture improves maintainability
- Router-retriever pattern is SOTA
- **BUT** breaking all adapters is costly
- **BUT** increased complexity may not be justified yet

**Hybrid Approach:**
- Modular source files in `src/modules/`
- Compiled monolithic output for distribution
- Maintains adapter compatibility
- Enables gradual migration

**Action Items:**
- [ ] Create ADR-001 with architecture decision
- [ ] Implement modules in src/modules/
- [ ] Update compile-skill.js for assembly
- [ ] Test compiled output matches current behavior
- [ ] Document module system
- [ ] Plan gradual adapter migration (optional)

**Status:** Pending ADR

---

### PR #47: feat: add OpenCode support

**Decision:** REVIEW

**Priority:** Medium

**Rationale:**
- We already have `adapters/opencode/`
- Need to compare implementations
- May have improvements to merge

**Action Items:**
- [ ] Fetch PR diff
- [ ] Compare with existing adapters/opencode/
- [ ] Identify improvements
- [ ] Merge improvements or close with note

**Status:** Pending comparison

---

### PR #28: feat: Skill distribution & validation (Skillshare + AIX)

**Decision:** ADOPT

**Priority:** Medium

**Rationale:**
- Distribution infrastructure for SkillShare/AIX
- Compatible with current sync scripts
- 2 reviews already - community validated

**Action Items:**
- [ ] Review implementation details
- [ ] Test with current sync-adapters.js
- [ ] Merge if compatible
- [ ] Update docs/skill-distribution.md

**Status:** Pending review

---

### PR #17: feat: offline robustness, non-text slop pattern

**Decision:** ADOPT

**Priority:** High

**Rationale:**
- Enhanced detection patterns
- 3 reviews, 6 comments - community validated
- Improves offline functionality

**Action Items:**
- [ ] Review new patterns
- [ ] Test on offline/non-text examples
- [ ] Merge if quality is good
- [ ] Update pattern documentation

**Status:** Pending pattern review

---

### PR #16: fix: address AI-signatures in code (issue #12)

**Decision:** ADOPT

**Priority:** High

**Rationale:**
- Fixes AI-generated code pattern detection
- 1 review, 10 comments - well discussed
- Aligns with Technical Module

**Action Items:**
- [ ] Review code pattern changes
- [ ] Verify alignment with Technical Module
- [ ] Test on AI-generated code samples
- [ ] Merge if functional

**Status:** Pending review

---

### PR #5: feat: Add detection for AI-style primary single quotes

**Decision:** ALREADY DONE

**Priority:** Low

**Rationale:**
- Pattern #25 (primary single quotes) exists in current SKILL.md
- No action needed

**Action Items:**
- [ ] Close PR with note that Pattern #25 is implemented
- [ ] Link to current pattern in SKILL.md

**Status:** Ready to close

---

### PR #20: feat: migrate build system to Node.js

**Decision:** ALREADY DONE

**Priority:** Low

**Rationale:**
- We have full Node.js build system
- package.json with scripts
- scripts/ directory with automation

**Action Items:**
- [ ] Close PR with note
- [ ] Link to package.json

**Status:** Ready to close

---

### PR #14: Conductor: Complete Project Setup

**Decision:** ALREADY DONE

**Priority:** Low

**Rationale:**
- Full conductor workflow implemented
- 16 completed tracks
- All conductor files present

**Action Items:**
- [ ] Close PR with note
- [ ] Link to conductor/tracks.md

**Status:** Ready to close

---

### PR #11: Add professional version of the skill (humanizer-pro)

**Decision:** ALREADY DONE

**Priority:** Low

**Rationale:**
- SKILL_PROFESSIONAL.md exists
- Module-aware routing implemented
- QWEN.md includes full Pro version

**Action Items:**
- [ ] Close PR with note
- [ ] Link to SKILL_PROFESSIONAL.md

**Status:** Ready to close

---

### PR #38: Update WARP.md with straight quotes

**Decision:** ADOPT

**Priority:** Low

**Rationale:**
- Documentation fix
- Replaces curly quotes with straight quotes
- Improves compatibility

**Action Items:**
- [ ] Review changes
- [ ] Merge if correct

**Status:** Pending review

---

### PR #36: Claude/cowork plugin conversion twf64

**Decision:** REJECT

**Priority:** Low

**Rationale:**
- Appears to be low-quality/spam
- Author has suspicious activity pattern
- No clear value add

**Action Items:**
- [ ] Close with polite explanation
- [ ] Note: "We already have Claude support via other adapters"

**Status:** Ready to close

---

### PR #33: docs: add AdaL installation instructions

**Decision:** ADOPT

**Priority:** Low

**Rationale:**
- Documentation improvement
- Helps users install via AdaL
- No downsides

**Action Items:**
- [ ] Review installation instructions
- [ ] Verify accuracy
- [ ] Merge if correct

**Status:** Pending review

---

### PR #26: feat: Add SOTA prompting improvements

**Decision:** REVIEW

**Priority:** Medium

**Rationale:**
- Overlap with tiered architecture (PR #30)
- Need to assess if redundant or complementary

**Action Items:**
- [ ] Fetch PR details
- [ ] Compare with PR #30
- [ ] Determine if redundant
- [ ] Adopt unique improvements

**Status:** Pending review

---

### PR #9: Add Russian language adaptation

**Decision:** DEFER

**Priority:** Low

**Rationale:**
- Language-specific adaptation
- No community request yet
- Can reopen if needed

**Action Items:**
- [ ] Close with note
- [ ] Note: "Happy to revisit if there's community demand"

**Status:** Ready to close

---

### PR #6: Add German language support with auto-detection

**Decision:** DEFER

**Priority:** Low

**Rationale:**
- Language-specific adaptation
- No community request yet
- Can reopen if needed

**Action Items:**
- [ ] Close with note
- [ ] Note: "Happy to revisit if there's community demand"

**Status:** Ready to close

---

### PR #4: Fix grammatical errors across documentation

**Decision:** REVIEW

**Priority:** Low

**Rationale:**
- Documentation quality improvement
- Need to assess quality of fixes

**Action Items:**
- [ ] Fetch PR details
- [ ] Review grammatical changes
- [ ] Merge if improvements

**Status:** Pending review

---

### PR #3: Fix YAML description: replace 'excessive conjunctive phrases'

**Decision:** ADOPT

**Priority:** Low

**Rationale:**
- Frontmatter correction
- Improves accuracy
- Simple fix

**Action Items:**
- [ ] Review change
- [ ] Merge if correct

**Status:** Pending review

---

## Action Summary

**Immediate Actions (Week 1):**
- [ ] Merge PR #49 (Claude compatibility)
- [ ] Merge PRs #5, #20, #14, #11, #9, #6 (already done/defer)
- [ ] Close PR #36 (reject)
- [ ] Review and merge PR #39 (patterns 25-27)

**High Priority (Week 1-2):**
- [ ] Security review of PR #44 (Wikipedia sync)
- [ ] Create ADR-001 for PR #30 (tiered architecture)
- [ ] Review and merge PR #16 (AI-signatures fix)
- [ ] Review and merge PR #17 (offline robustness)

**Medium Priority (Week 2):**
- [ ] Compare PR #47 with existing OpenCode adapter
- [ ] Review PR #28 (distribution)
- [ ] Review PR #26 (prompting improvements)
- [ ] Review documentation PRs (#38, #33, #4, #3)

**Track Closure (Week 3):**
- [ ] Verify all decisions implemented
- [ ] Update this log with final status
- [ ] Close track with summary

---

*Last Updated: 2026-03-03*
*Next Review: After Week 1 execution*
