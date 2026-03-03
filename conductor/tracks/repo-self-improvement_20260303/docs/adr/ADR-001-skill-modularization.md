# ADR-001: Skill Modularization Architecture

**Date:** 2026-03-03

**Track:** `repo-self-improvement_20260303`

**Phase:** 3 - Architecture Evaluation & Modularization

**Status:** Proposed → Decision Pending

---

## Context and Problem Statement

### Current State

Our skill files have grown significantly:
- `SKILL.md`: 941 lines (⚠️ approaching maintainability limit)
- `SKILL_PROFESSIONAL.md`: 963 lines (⚠️ approaching maintainability limit)
- `QWEN.md`: 2000+ lines (❌ exceeds recommended size)

**Structural Gap:**
`SKILL_PROFESSIONAL.md` references modules that don't exist as files:
- `modules/SKILL_CORE.md` ❌ Missing
- `modules/SKILL_TECHNICAL.md` ❌ Missing
- `modules/SKILL_ACADEMIC.md` ❌ Missing
- `modules/SKILL_GOVERNANCE.md` ❌ Missing
- `modules/SKILL_REASONING.md` ❌ Missing

**Upstream Pressure:**
PR #30 from `blader/humanizer` implements a full tiered architecture (v3.0.0) with:
- Router-Retriever pattern
- Modular compiler
- 84 commits of changes
- Breaking changes to adapter sync

### Problem

How do we balance:
1. **Maintainability** - Large files are hard to maintain
2. **Compatibility** - 12 adapters depend on current structure
3. **Innovation** - Upstream has better architecture
4. **Simplicity** - Don't over-engineer if not needed

---

## Decision Drivers

### Driver 1: Maintainability
**Weight:** High

Large files (>1000 lines) become difficult to:
- Navigate and understand
- Test comprehensively
- Update without breaking changes
- Onboard new contributors

**Current Status:** Approaching threshold

---

### Driver 2: Adapter Compatibility
**Weight:** High

We have 12 adapter platforms:
- amp, antigravity-rules-workflows, antigravity-skill
- claude, cline, codex, copilot
- gemini-extension, kilo, opencode
- qwen-cli, vscode

**Requirement:** Any architecture change must either:
- Maintain backward compatibility, OR
- Provide clear migration path with minimal effort

---

### Driver 3: Upstream Alignment
**Weight:** Medium

Upstream PR #30 implements:
- Router-Retriever pattern
- Modular architecture
- Severity classification
- Technical literal preservation
- Chain-of-thought reasoning

**Question:** Adopt full implementation, hybrid approach, or maintain current?

---

### Driver 4: Implementation Complexity
**Weight:** Medium

Full modularization requires:
- Creating module files
- Updating compile scripts
- Testing all adapters
- Documentation updates
- Potential version bump (v3.0.0)

**Estimated Effort:** 3-5 days

---

## Options Considered

### Option A: Maintain Monolithic (Status Quo)

**Description:** Keep current structure, don't modularize

**Pros:**
- ✅ No breaking changes
- ✅ Zero migration effort
- ✅ All adapters continue working
- ✅ Simple to understand

**Cons:**
- ❌ Files continue growing
- ❌ Harder to maintain over time
- ❌ Missing module files remain gap
- ❌ Can't adopt upstream improvements easily
- ❌ No separation of concerns

**Impact:**
- Short-term: No disruption
- Long-term: Technical debt accumulates

---

### Option B: Full Modularization (Upstream PR #30)

**Description:** Adopt full tiered architecture from upstream

**Structure:**
```
src/
├── modules/
│   ├── SKILL_CORE.md
│   ├── SKILL_TECHNICAL.md
│   ├── SKILL_ACADEMIC.md
│   ├── SKILL_GOVERNANCE.md
│   └── SKILL_REASONING.md
├── router/
│   └── SKILL_ROUTER.md
└── compile/
    └── compile-skill.js
```

**Pros:**
- ✅ Best maintainability
- ✅ Clear separation of concerns
- ✅ Easy to adopt upstream improvements
- ✅ Enables advanced features (severity, routing)
- ✅ Individual modules testable

**Cons:**
- ❌ Breaking changes to adapter sync
- ❌ 3-5 days implementation effort
- ❌ Requires adapter updates
- ❌ Increased complexity
- ❌ Router overhead for simple tasks

**Impact:**
- Short-term: Disruption, migration work
- Long-term: Better maintainability

---

### Option C: Hybrid Approach (Modular Source, Compiled Output) ⭐ RECOMMENDED

**Description:** Modular source files compiled into monolithic distribution

**Structure:**
```
src/
├── modules/
│   ├── SKILL_CORE_PATTERNS.md
│   ├── SKILL_TECHNICAL.md
│   ├── SKILL_ACADEMIC.md
│   ├── SKILL_GOVERNANCE.md
│   └── SKILL_REASONING.md
└── compile/
    └── compile-skill.js

SKILL.md (compiled from src/modules/)
SKILL_PROFESSIONAL.md (compiled from src/modules/ + router)
```

**Pros:**
- ✅ Modular maintainability
- ✅ Backward compatible (adapters unchanged)
- ✅ Can adopt upstream improvements gradually
- ✅ Separation of concerns in source
- ✅ Single distribution file (simple for users)
- ✅ Can migrate adapters to modular format later (optional)

**Cons:**
- ⚠️ Build step required (compile before distribution)
- ⚠️ Version tracking complexity (source vs. compiled)
- ⚠️ 2-3 days implementation effort

**Impact:**
- Short-term: Moderate effort, no adapter breaking changes
- Long-term: Best of both worlds

---

## Decision

**Selected Option:** **Option C - Hybrid Approach**

**Rationale:**

1. **Balances Innovation and Stability**
   - Gets maintainability benefits of modularity
   - Maintains adapter compatibility
   - No breaking changes to existing workflows

2. **Enables Gradual Adoption**
   - Can adopt upstream improvements incrementally
   - Can migrate adapters to modular format over time
   - No "big bang" migration risk

3. **Addresses Current Pain Points**
   - Large files become maintainable (modular source)
   - Missing module gap filled
   - Better separation of concerns

4. **Future-Proof**
   - Can evolve to full modularization if needed
   - Distribution format remains simple
   - Compatible with current user expectations

---

## Implementation Plan

### Phase 1: Create Module Structure (Day 1-2)

**Tasks:**
1. Create `src/modules/` directory
2. Extract modules from `SKILL_PROFESSIONAL.md`:
   - `SKILL_CORE_PATTERNS.md` - Core patterns (always applied)
   - `SKILL_TECHNICAL.md` - Code/technical docs module
   - `SKILL_ACADEMIC.md` - Academic writing module
   - `SKILL_GOVERNANCE.md` - Policy/compliance module
   - `SKILL_REASONING.md` - Reasoning failures module
3. Update `scripts/compile-skill.js` to assemble modules
4. Test compiled output matches current behavior

**Acceptance Criteria:**
- All modules extracted
- Compile script functional
- Compiled output matches current SKILL.md
- All tests passing

---

### Phase 2: Update Adapter Sync (Day 2-3)

**Tasks:**
1. Update `scripts/sync-adapters.js` to handle modular source
2. Add module validation to CI
3. Update adapter frontmatter to reference new structure
4. Test all 12 adapters with compiled output

**Acceptance Criteria:**
- All adapters sync successfully
- Validation passes
- No adapter breaking changes

---

### Phase 3: Documentation (Day 3)

**Tasks:**
1. Document module system in docs/
2. Update README.md with architecture overview
3. Add contributor guide for module development
4. Create migration guide (for future modular adapter adoption)

**Acceptance Criteria:**
- Documentation complete
- Examples provided
- Contributor onboarding clear

---

### Phase 4: Version Bump (Day 3)

**Tasks:**
1. Bump version to 3.0.0 (breaking change in architecture, not API)
2. Update changelog
3. Create release notes
4. Announce to users

**Acceptance Criteria:**
- Version bumped
- Changelog updated
- Release published

---

## Technical Specification

### Module Interface

Each module follows this structure:

```markdown
---
module_id: core_patterns
version: 3.0.0
description: Core AI writing pattern detection (always applied)
patterns: 27
severity_levels:
  - Critical
  - High
  - Medium
  - Low
---

# Module: Core Patterns

## Description
Always-applied patterns for general writing.

## Patterns
[Pattern definitions...]

## Examples
[Before/after examples...]

## Severity Guidelines
[When to apply each severity level...]
```

### Compile Script Interface

```javascript
// scripts/compile-skill.js

const modules = [
  'src/modules/SKILL_CORE_PATTERNS.md',
  'src/modules/SKILL_TECHNICAL.md',
  'src/modules/SKILL_ACADEMIC.md',
  'src/modules/SKILL_GOVERNANCE.md',
  'src/modules/SKILL_REASONING.md'
];

const router = 'src/router/ROUTER_LOGIC.md';

compile({
  modules,
  router,
  output: 'SKILL_PROFESSIONAL.md',
  version: '3.0.0'
});
```

### Adapter Frontmatter Update

```yaml
---
adapter_metadata:
  skill_name: humanizer
  skill_version: 3.0.0
  source_type: compiled  # New field: 'compiled' or 'modular'
  modules:
    - SKILL_CORE_PATTERNS.md
    - SKILL_TECHNICAL.md
    - SKILL_ACADEMIC.md
    - SKILL_GOVERNANCE.md
    - SKILL_REASONING.md
---
```

---

## Consequences

### Positive Consequences

1. **Maintainability Improved**
   - Modules are 200-400 lines each (vs. 941-2000+ monolithic)
   - Easier to navigate and understand
   - Individual modules testable

2. **Adapter Compatibility Maintained**
   - No breaking changes to existing adapters
   - Compiled output same as before
   - Migration path clear for future modular adoption

3. **Upstream Alignment Easier**
   - Can adopt upstream module improvements
   - Can merge specific modules without full adoption
   - Better interoperability

4. **Better Separation of Concerns**
   - Core patterns separate from specialized modules
   - Clear boundaries between concerns
   - Easier to reason about

### Negative Consequences

1. **Build Step Required**
   - Must compile before distribution
   - Adds complexity to release process
   - Potential for compile errors

2. **Version Tracking**
   - Must track source version and compiled version
   - Must ensure compiled output committed
   - Potential for drift if not careful

3. **Implementation Effort**
   - 2-3 days to implement
   - Testing all adapters
   - Documentation updates

### Neutral Consequences

1. **File Count Increases**
   - From 3 skill files to 8+ (modules + compiled)
   - More files to manage
   - Better organized

---

## Validation

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Module files created | 5/5 | All modules exist |
| Compile script functional | Yes | Produces valid output |
| Adapter compatibility | 12/12 | All adapters sync |
| Test pass rate | 100% | All tests passing |
| Documentation complete | Yes | All docs updated |
| Version bumped | 3.0.0 | Changelog updated |

### Validation Steps

1. **Module Integrity:**
   ```bash
   node scripts/validate-modules.js
   ```

2. **Compile Validation:**
   ```bash
   node scripts/compile-skill.js
   node scripts/validate-adapters.js
   ```

3. **Adapter Sync:**
   ```bash
   npm run sync
   npm run validate
   ```

4. **Full Test Suite:**
   ```bash
   npm test
   ```

---

## Notes

### Future Considerations

1. **Full Modular Adoption:**
   - Adapters could optionally use modular source directly
   - Would require adapter updates
   - Can be done incrementally

2. **Module Marketplace:**
   - Community could create custom modules
   - Plugin architecture possible
   - Out of scope for now

3. **Runtime Module Loading:**
   - Could load modules dynamically
   - Would enable runtime customization
   - Significant engineering effort

### Related Decisions

- **ADR-002:** Severity Classification Adoption (pending)
- **ADR-003:** Technical Literal Preservation Rules (pending)
- **ADR-004:** Wikipedia Sync Implementation (pending)

---

## Approval

**Proposed By:** Repository Self-Improvement Track

**Approved By:** [Pending Maintainer Approval]

**Approval Date:** [Pending]

**Implementation Owner:** [TBD]

**Target Completion:** 2026-03-17 (2 weeks from proposal)

---

*ADR Version: 1.0*
*Status: Proposed → Pending Approval*
