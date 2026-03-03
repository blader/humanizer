# Ralph Loop Configuration: Repository Self-Improvement

**Version:** 1.0

**Track:** `repo-self-improvement_20260303`

**Enabled Phases:** 2, 3, 6

---

## Overview

This configuration enables **Ralph Loop** for iterative self-improvement during the repository self-improvement track. Ralph Loop will run automated analysis and improvement cycles in designated phases.

---

## Ralph Loop Prompts by Phase

### Phase 2: Upstream PR Assessment & Adoption

**Goal:** Analyze skill files for improvement opportunities based on upstream changes

**Prompt:**
```
Analyze SKILL.md and SKILL_PROFESSIONAL.md for self-improvement opportunities.

Focus Areas:
1. **AI Writing Patterns in the Skill Itself:**
   - Scan the skill definition for the very patterns it's meant to detect
   - Flag any "stands as a testament to", "crucial", "pivotal", etc.
   - Identify sterile, voiceless sections

2. **Pattern Clarity:**
   - Are pattern descriptions clear and actionable?
   - Do examples effectively demonstrate before/after?
   - Are there redundant or overlapping patterns?

3. **Module Structure (SKILL_PROFESSIONAL.md):**
   - Are module references accurate?
   - Is routing logic clear?
   - Do modules have consistent structure?

4. **Missing Improvements:**
   - What patterns from upstream PR #39 (persuasive tropes, signposting, fragmented headers) should be added?
   - What severity classifications are missing?
   - What technical literal preservation rules need enhancement?

5. **Comparison with Upstream:**
   - Compare with blader/humanizer PR #44 (Wikipedia sync)
   - Compare with PR #30 (tiered architecture)
   - Identify gaps in current implementation

Run up to 5 iterations. After each iteration, ask: "Are there further improvements to make?"

Completion Criteria:
- No AI patterns found in skill definition itself
- All patterns have clear examples
- Module structure is consistent
- Upstream improvements are either adopted or explicitly rejected with rationale

Output Format:
- List of changes made per iteration
- Final summary of all improvements
- Recommendations for manual review
```

**Max Iterations:** 5

**Completion Promise:** "No further improvements identified"

**Output File:** `docs/ralph-loop-phase2-report.md`

---

### Phase 3: Architecture Evaluation & Modularization

**Goal:** Analyze code organization and suggest architectural improvements

**Prompt:**
```
Analyze the repository structure for self-improvement opportunities.

Focus Areas:
1. **Script Organization:**
   - Review scripts/ directory structure
   - Identify duplication or consolidation opportunities
   - Suggest improvements to sync-adapters.js, validate-adapters.js

2. **Test Coverage Gaps:**
   - Analyze test/ directory
   - Identify untested scripts
   - Suggest critical test cases to add

3. **CI/CD Pipeline Optimization:**
   - Review .github/workflows/ci.yml
   - Identify missing checks (file size, adapter sync validation)
   - Suggest workflow improvements

4. **Adapter Sync Logic:**
   - Review how adapters are synchronized
   - Identify drift risks
   - Suggest automation improvements

5. **Build Process:**
   - Review scripts/compile-skill.js
   - Identify simplification opportunities
   - Suggest performance improvements

6. **File Size Monitoring:**
   - Analyze SKILL.md, SKILL_PROFESSIONAL.md, QWEN.md
   - Recommend modularization thresholds
   - Suggest automated alerts

Run up to 5 iterations. After each iteration, ask: "Are there further improvements to make?"

Completion Criteria:
- All scripts reviewed
- Test gaps identified
- CI/CD improvements documented
- Adapter sync risks mitigated
- Build process optimized
- File size monitoring in place

Output Format:
- List of changes made per iteration
- Architecture decision recommendations
- Implementation priority ranking
```

**Max Iterations:** 5

**Completion Promise:** "Architecture analysis complete"

**Output File:** `docs/ralph-loop-phase3-report.md`

---

### Phase 6: Ralph Loop Integration & Self-Improvement

**Goal:** Meta-improvement - improve the Ralph Loop process itself

**Prompt:**
```
Analyze and improve the Ralph Loop self-improvement workflow.

Focus Areas:
1. **Workflow Effectiveness:**
   - Review Phase 2 and Phase 3 Ralph Loop reports
   - Assess quality of suggested improvements
   - Identify patterns in accepted vs. rejected changes

2. **Prompt Optimization:**
   - Review Ralph Loop prompts used
   - Identify ambiguity or confusion
   - Suggest prompt refinements

3. **Completion Criteria:**
   - Were completion criteria appropriate?
   - Did Ralph Loop stop at the right time?
   - Should max iterations be adjusted?

4. **Integration with Conductor:**
   - How well does Ralph Loop integrate with conductor workflow?
   - Are there friction points?
   - Suggest workflow improvements

5. **Automation Opportunities:**
   - What manual steps can be automated?
   - Should Ralph Loop run on a schedule (weekly/monthly)?
   - Should PRs be auto-created for improvements?

6. **Guardrails:**
   - Are there sufficient safeguards?
   - Should certain changes require human review?
   - What should never be auto-changed?

Run up to 5 iterations. After each iteration, ask: "Is the workflow improved?"

Completion Criteria:
- Workflow improvements documented
- Prompts optimized
- Automation plan created
- Guardrails defined
- Schedule recommendations made

Output Format:
- Ralph Loop v2.0 configuration
- Automated workflow proposal
- Guardrails documentation
```

**Max Iterations:** 5

**Completion Promise:** "Self-improvement workflow optimized"

**Output File:** `docs/ralph-loop-phase6-report.md`

---

## Ralph Loop Execution Protocol

### Pre-Execution Checklist

- [ ] Verify Ralph Loop extension is installed
- [ ] Confirm track is marked as `[~]` In Progress
- [ ] Review phase goals and completion criteria
- [ ] Create output directory if needed

### Execution Steps

1. **Start Ralph Loop:**
   ```bash
   /ralph-loop "<prompt from above>"
   ```

2. **Monitor Progress:**
   - Watch for iteration count
   - Review changes after each iteration
   - Intervene if going off-track

3. **Completion:**
   - Verify completion promise is TRUE
   - Review final report
   - Accept/reject changes with rationale

4. **Documentation:**
   - Save report to docs/
   - Update track plan with findings
   - Commit changes with proper message

### Post-Execution

- [ ] Review all accepted changes
- [ ] Run validation suite (`npm run lint:all`, `npm test`)
- [ ] Update adapter sync if skill changed
- [ ] Document learnings in track notes

---

## Guardrails

### Never Auto-Change

1. **YAML Frontmatter:**
   - `version:` field requires manual review
   - `allowed-tools:` changes need security review

2. **Module References:**
   - Adding/removing modules requires ADR
   - Module routing logic needs human approval

3. **Pattern Definitions:**
   - Core patterns (1-24) need manual review
   - New patterns require examples and testing

4. **Adapter Files:**
   - Never modify adapters/ without sync script
   - Adapter changes require validation

5. **CI/CD Configuration:**
   - `.github/workflows/` changes need testing
   - Pre-commit hooks require validation

### Always Require Human Review

1. Security-related changes
2. Breaking changes to skill interface
3. New external dependencies
4. Major architectural changes
5. Release version bumps

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Improvements Accepted | >50% | Changes merged / Changes suggested |
| False Positives | <10% | Rejected changes / Total changes |
| Iterations to Completion | 3-5 | Average iterations per phase |
| Time Saved | >5 hours | Manual effort vs. Ralph Loop |
| Quality Score | >8/10 | Human review rating |

---

## Troubleshooting

### Ralph Loop Stuck in Infinite Cycle

**Symptom:** Keeps finding "improvements" beyond 5 iterations

**Fix:**
1. Cancel loop: `/cancel-ralph`
2. Review prompt - may be too open-ended
3. Tighten completion criteria
4. Reduce max iterations to 3

### Low Acceptance Rate (<30%)

**Symptom:** Most suggested changes are rejected

**Fix:**
1. Review prompt specificity
2. Add more context about goals
3. Include examples of acceptable changes
4. Adjust focus areas

### Ralph Loop Misses Critical Issues

**Symptom:** Obvious problems not identified

**Fix:**
1. Add explicit check for issue to prompt
2. Run targeted Ralph Loop on specific file
3. Combine with manual review
4. Update prompt with detection criteria

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-03 | Initial configuration for repo-self-improvement_20260303 |

---

*Configuration Status: Ready for Execution*
*Next Review: After Phase 2 completion*
