#!/usr/bin/env node

/**
 * Skill Compiler for Modular Architecture (ADR-001)
 *
 * Assembles SKILL.md and SKILL_PROFESSIONAL.md from modular source files.
 *
 * Usage: node scripts/compile-skill.js
 *
 * Phase Status:
 * - [x] Phase 1: Compile script structure
 * - [x] Phase 2: Extract SKILL_CORE_PATTERNS.md
 * - [x] Phase 3: Create specialized modules
 * - [x] Phase 4: Implement module assembly
 * - [x] Phase 5: Test compiled output
 * - [ ] Phase 6: Upstream PR adoption
 *
 * Module Structure:
 * - src/modules/SKILL_CORE_PATTERNS.md (required)
 * - src/modules/SKILL_TECHNICAL.md (optional)
 * - src/modules/SKILL_ACADEMIC.md (optional)
 * - src/modules/SKILL_GOVERNANCE.md (optional)
 * - src/modules/SKILL_REASONING.md (optional, already exists)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

/**
 * Module configuration
 */
const MODULES = {
  core: 'src/modules/SKILL_CORE_PATTERNS.md',
  technical: 'src/modules/SKILL_TECHNICAL.md',
  academic: 'src/modules/SKILL_ACADEMIC.md',
  governance: 'src/modules/SKILL_GOVERNANCE.md',
  reasoning: 'src/modules/SKILL_REASONING.md'
};

/**
 * Output files
 */
const OUTPUT = {
  skill: 'SKILL.md',
  skillPro: 'SKILL_PROFESSIONAL.md'
};

/**
 * Read module file with error handling
 */
function readModule(modulePath, required = false) {
  const fullPath = path.join(ROOT_DIR, modulePath);
  
  if (!fs.existsSync(fullPath)) {
    if (required) {
      throw new Error(`Required module not found: ${modulePath}`);
    }
    console.log(`⚠️  Module not found: ${modulePath} (optional)`);
    return null;
  }
  
  console.log(`✓ Reading module: ${modulePath}`);
  return fs.readFileSync(fullPath, 'utf-8');
}

/**
 * Find all adapter files dynamically
 */
function findAdapters() {
  const adapters = [];
  const adapterDirs = [
    '.agent/skills/humanizer',
    ...fs.readdirSync(path.join(ROOT_DIR, 'adapters'))
      .filter(d => fs.statSync(path.join(ROOT_DIR, 'adapters', d)).isDirectory())
      .map(d => `adapters/${d}`)
  ];
  
  for (const dir of adapterDirs) {
    const fullPath = path.join(ROOT_DIR, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(fullPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.includes('skill_version:') || content.includes('skill_name:')) {
          adapters.push(filePath);
        }
      }
    }
  }
  
  return adapters;
}

/**
 * Extract frontmatter from module
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  }
  
  return frontmatter;
}

/**
 * Compile Standard SKILL.md from modules
 * 
 * Assembles SKILL.md from:
 * - Core patterns module (required)
 * - Reasoning module (if available)
 */
function compileStandardSkill() {
  console.log('\n=== Compiling Standard Humanizer ===');
  
  // Read required core module
  const coreModule = readModule(MODULES.core, true); // required = true
  
  // Read optional reasoning module
  const reasoningModule = readModule(MODULES.reasoning);
  
  // Extract version from core module
  const coreFrontmatter = extractFrontmatter(coreModule);
  const version = coreFrontmatter?.version || '3.0.0';
  
  // Build standard skill frontmatter
  const frontmatter = `---
name: humanizer
version: ${version}
description: |
  Remove signs of AI-generated writing from text. Use when editing or reviewing
  text to make it sound more natural and human-written. Based on Wikipedia's
  comprehensive "Signs of AI writing" guide. Detects and fixes patterns including:
  inflated symbolism, promotional language, superficial -ing analyses, vague
  attributions, em dash overuse, rule of three, AI vocabulary words, negative
  parallelisms, and excessive conjunctive phrases. Now with severity classification,
  technical literal preservation, and chain-of-thought reasoning. Includes reasoning
  failure detection and remediation.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion

---

`;
  
  // Extract content without frontmatter from core module
  let coreContent = coreModule.replace(/^---\s*[\s\S]*?^---\s*/m, '');
  
  // Start with frontmatter + core content
  let content = frontmatter + coreContent;
  
  // Append reasoning module if available
  if (reasoningModule) {
    console.log('✓ Appending reasoning module');
    // Remove reasoning module frontmatter and append
    const reasoningContent = reasoningModule.replace(/^---\s*[\s\S]*?^---\s*/m, '');
    content += '\n\n---\n\n' + reasoningContent;
  }
  
  console.log('✓ Standard SKILL.md compiled from modules');
  return content;
}

/**
 * Compile Professional SKILL_PROFESSIONAL.md from modules
 * 
 * Assembles from:
 * - Frontmatter (version, description, allowed-tools)
 * - Introduction & routing logic
 * - Core patterns module (always included)
 * - Specialized modules (technical, academic, governance, reasoning)
 */
function compileProfessionalSkill() {
  console.log('\n=== Compiling Humanizer Pro ===');
  
  // Read all modules (core is required, others optional)
  const modules = {
    core: readModule(MODULES.core, true),
    technical: readModule(MODULES.technical),
    academic: readModule(MODULES.academic),
    governance: readModule(MODULES.governance),
    reasoning: readModule(MODULES.reasoning)
  };
  
  // Check which modules are available
  const availableModules = Object.entries(modules)
    .filter(([_, content]) => content !== null)
    .map(([key, _]) => key);
  
  console.log(`✓ Available modules: ${availableModules.join(', ')}`);
  
  // Build professional skill from template
  let content = buildProfessionalTemplate(modules);
  
  return content;
}

/**
 * Build SKILL_PROFESSIONAL.md from modules
 */
function buildProfessionalTemplate(modules) {
  // Extract version from core module
  const coreFrontmatter = extractFrontmatter(modules.core);
  const version = coreFrontmatter?.version || '3.0.0';
  
  // Build frontmatter
  const frontmatter = `---
name: humanizer-pro
version: ${version}
description: |
  Remove signs of AI-generated writing from text. Use when editing or reviewing
  text to make it sound more natural, human-written, and professional. Based on Wikipedia's
  comprehensive "Signs of AI writing" guide. Detects and fixes patterns including:
  inflated symbolism, promotional language, superficial -ing analyses, vague
  attributions, em dash overuse, rule of three, AI vocabulary words, negative
  parallelisms, and excessive conjunctive phrases. Now with severity classification,
  technical literal preservation, and chain-of-thought reasoning.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion

---
`;

  // Build introduction
  const introduction = `
# Humanizer: Remove AI Writing Patterns

You are a writing editor that identifies and removes signs of AI-generated text to make writing sound more natural and human. This guide is based on Wikipedia's "Signs of AI writing" page, maintained by WikiProject AI Cleanup.

## Humanizer Pro: Context-Aware Analyst (Professional)

This professional variant supports module-aware routing and bundled distribution workflows.

## Modules

- [Core Patterns](modules/SKILL_CORE_PATTERNS.md) - ALWAYS apply these patterns.
- [Technical Module](modules/SKILL_TECHNICAL.md) - Apply for code and technical documentation.
- [Academic Module](modules/SKILL_ACADEMIC.md) - Apply for papers, essays, and formal research prose.
- [Governance Module](modules/SKILL_GOVERNANCE.md) - Apply for policy, risk, and compliance writing.
- [Reasoning Module](modules/SKILL_REASONING.md) - Apply for identifying and addressing LLM reasoning failures.

## ROUTING LOGIC

1. Analyze input context:
   - Is it code? → Apply Core + Technical
   - Is it a paper? → Apply Core + Academic
   - Is it policy/risk? → Apply Core + Governance
   - Otherwise → Apply Core only

2. Apply module combinations:
   - General writing: Core Patterns
   - Code and technical docs: Core + Technical
   - Academic writing: Core + Academic
   - Governance/compliance docs: Core + Governance

## Your Task

When given text to humanize:

1. **Identify AI patterns** - Scan for the patterns listed below
2. **Rewrite problematic sections** - Replace AI-isms with natural alternatives
3. **Preserve meaning** - Keep the core message intact
4. **Maintain voice** - Match the intended tone (formal, casual, technical, etc.)
5. **Refine voice** - Ensure writing is alive, specific, and professional

---

## VOICE AND CRAFT

Removing AI patterns is necessary but not sufficient. What remains needs to actually read well.

The goal isn't "casual" or "formal"—it's **alive**. Writing that sounds like someone wrote it, considered it, meant it. The register should match the context (a technical spec sounds different from a newsletter), but in any register, good writing has shape.

### Signs the writing is still flat

- Every sentence lands the same way—same length, same structure, same rhythm
- Nothing is concrete; everything is "significant" or "notable" without saying why
- No perspective, just information arranged in order
- Reads like it could be about anything—no sense that the writer knows this particular subject

### What to aim for

Vary sentence rhythm by mixing short and long lines. Use specific details instead of vague assertions. Ensure the writing reflects a clear point of view and earned emphasis through detail. Always read it aloud to check for natural flow.

---

**Clarity over filler.** Use simple active verbs (\`is\`, \`has\`, \`shows\`) instead of filler phrases (\`stands as a testament to\`).

### Technical Nuance

**Expertise isn't slop.** In professional contexts, "crucial" or "pivotal" are sometimes the exact right words for a technical requirement. The Pro variant targets _lazy_ patterns, not technical precision. If a word is required for accuracy, keep it. If it's there to add fake "gravitas," cut it.

---

`;

  // Build module sections
  let moduleSections = '';
  
  // Core patterns (always included)
  if (modules.core) {
    moduleSections += '\n## CORE PATTERNS MODULE\n\n';
    moduleSections += modules.core;
    moduleSections += '\n\n---\n';
  }
  
  // Technical module
  if (modules.technical) {
    moduleSections += '\n## TECHNICAL MODULE\n\n';
    moduleSections += modules.technical;
    moduleSections += '\n\n---\n';
  }
  
  // Academic module
  if (modules.academic) {
    moduleSections += '\n## ACADEMIC MODULE\n\n';
    moduleSections += modules.academic;
    moduleSections += '\n\n---\n';
  }
  
  // Governance module
  if (modules.governance) {
    moduleSections += '\n## GOVERNANCE MODULE\n\n';
    moduleSections += modules.governance;
    moduleSections += '\n\n---\n';
  }
  
  // Reasoning module
  if (modules.reasoning) {
    moduleSections += '\n## REASONING MODULE\n\n';
    moduleSections += modules.reasoning;
  }
  
  // Assemble final content
  return frontmatter + introduction + moduleSections;
}

/**
 * Update adapter frontmatter with new version
 */
function updateAdapterMetadata(version) {
  console.log('\n=== Updating Adapter Metadata ===');
  
  const adapters = findAdapters();
  console.log(`✓ Found ${adapters.length} adapter files`);
  
  let updated = 0;
  for (const adapterPath of adapters) {
    let content = fs.readFileSync(adapterPath, 'utf-8');
    const oldVersion = content.match(/skill_version: ([\d.]+)/);
    
    if (oldVersion && oldVersion[1] !== version) {
      content = content.replace(/skill_version: [\d.]+/, `skill_version: ${version}`);
      fs.writeFileSync(adapterPath, content, 'utf-8');
      console.log(`✓ Updated ${adapterPath}: ${oldVersion[1]} → ${version}`);
      updated++;
    }
  }
  
  if (updated === 0) {
    console.log('✓ All adapters up to date');
  }
}

/**
 * Main compilation process
 */
function compile() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  Humanizer Skill Compiler (ADR-001)   ║');
  console.log('╚════════════════════════════════════════╝');

  try {
    // Compile Standard SKILL.md
    console.log('\n=== Phase 4: Assembling from Modules ===');
    const skillContent = compileStandardSkill();
    
    // Write SKILL.md
    const skillPath = path.join(ROOT_DIR, OUTPUT.skill);
    fs.writeFileSync(skillPath, skillContent, 'utf-8');
    console.log(`✓ Written: ${OUTPUT.skill}`);

    // Compile Professional SKILL_PROFESSIONAL.md
    const proContent = compileProfessionalSkill();
    
    // Write SKILL_PROFESSIONAL.md
    const proPath = path.join(ROOT_DIR, OUTPUT.skillPro);
    fs.writeFileSync(proPath, proContent, 'utf-8');
    console.log(`✓ Written: ${OUTPUT.skillPro}`);

    // Extract version for adapter updates
    const versionMatch = proContent.match(/version: ([\d.]+)/);
    const version = versionMatch ? versionMatch[1] : '3.0.0';

    // Update adapter metadata
    updateAdapterMetadata(version);

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  ✓ Compilation Complete              ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`\nVersion: ${version}`);
    console.log('Status: Phase 4 - Assembled from Modules');
    console.log('Next: Test compiled output and run validation');

  } catch (error) {
    console.error('\n❌ Compilation failed:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run compilation
compile();
