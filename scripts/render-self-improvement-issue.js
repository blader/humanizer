import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

function summarizeTopTitles(items, limit = 5) {
  return items
    .slice(0, limit)
    .map((item) => `- #${item.number} ${item.title}`)
    .join('\n');
}

function formatDecisionItems(items) {
  if (items.length === 0) {
    return '- None';
  }

  return items
    .map(
      (item) =>
        `- ${item.scope} #${item.number}: ${item.title}\n  Decision: ${item.decision.toUpperCase()}\n  Why: ${item.reason}`
    )
    .join('\n');
}

const LOCAL_DECISION_RULES = [
  {
    keywords: ['@changesets/cli'],
    decision: 'reject',
    reason:
      'Changesets is no longer part of the repo release model. This skill-source repo ships artifacts through GitHub, not package releases.',
  },
  {
    keywords: ['actions/upload-artifact', 'create-issue-from-file'],
    decision: 'adopt',
    reason:
      'Workflow dependency updates match the current automation direction and should be merged after the scheduled job passes.',
  },
  {
    keywords: ['@types/node', 'lint-staged', 'eslint'],
    decision: 'adopt',
    reason:
      'Maintainer-tooling updates fit the repo contract and should be taken when the local lint, validate, and test gates remain green.',
  },
];

const UPSTREAM_DECISION_RULES = [
  {
    keywords: ['opencode support'],
    decision: 'reject',
    reason:
      'OpenCode support is already implemented locally through the adapter distribution path, so this is not a missing capability in humanizer-next.',
  },
  {
    keywords: ['wikipedia sync'],
    decision: 'reject',
    reason:
      'Live upstream fetches add runtime dependencies and instability to a skill-source repo that should stay deterministic and artifact-driven.',
  },
  {
    keywords: ['claude compatibility'],
    decision: 'reject',
    reason:
      'Compatibility fixes should be evaluated against the local adapter architecture, not cherry-picked blindly from the upstream single-skill format.',
  },
  {
    keywords: ['license file'],
    decision: 'defer',
    reason:
      'Reasonable repo hygiene improvement, but lower priority than dependency maintenance and evidence-backed skill changes.',
  },
  {
    keywords: ['pattern', 'hyphenated', 'rewrite', 'review score'],
    decision: 'defer',
    reason:
      'Potentially useful, but it needs evidence review against the repo rubric: evidence quality, overlap with existing patterns, false-positive risk, and adapter impact.',
  },
];

function classifyDecision(pr, scope, rules) {
  const lowerTitle = pr.title.toLowerCase();
  const matchedRule = rules.find((rule) =>
    rule.keywords.some((keyword) => lowerTitle.includes(keyword))
  );

  if (!matchedRule) {
    return {
      scope,
      number: pr.number,
      title: pr.title,
      decision: 'defer',
      reason:
        scope === 'local'
          ? 'No repo-specific automation rule exists for this PR yet. Review manually.'
          : 'No automation rule matched. Review manually.',
    };
  }

  return {
    scope,
    number: pr.number,
    title: pr.title,
    decision: matchedRule.decision,
    reason: matchedRule.reason,
  };
}

function buildLocalDecisions(localPrs) {
  return localPrs
    .filter((pr) => pr.is_dependabot)
    .slice(0, 10)
    .map((pr) => classifyDecision(pr, 'local', LOCAL_DECISION_RULES));
}

function buildUpstreamDecisions(upstreamPrs) {
  return upstreamPrs
    .slice(0, 8)
    .map((pr) => classifyDecision(pr, 'upstream', UPSTREAM_DECISION_RULES));
}

function main() {
  const inputPath =
    process.argv[2] ||
    path.join(REPO_ROOT, 'conductor', 'tracks', 'repo-self-improvement_20260303', 'repo-data.json');
  const outputPath =
    process.argv[3] || path.join(REPO_ROOT, '.github', 'generated', 'self-improvement-issue.md');
  const decisionsPath = outputPath.replace(
    /self-improvement-issue\.md$/,
    'self-improvement-decisions.md'
  );
  const trackDecisionLogPath = path.join(
    REPO_ROOT,
    'conductor',
    'tracks',
    'repo-self-improvement_20260303',
    'upstream-decision-log.md'
  );

  const raw = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(raw);

  const local = data.local_repository;
  const upstream = data.upstream_repository;
  const localSecurityPolicy = local.security?.has_security_policy ?? false;
  const upstreamSecurityPolicy = upstream.security?.has_security_policy ?? false;
  const localDecisions = buildLocalDecisions(local.pull_requests.raw);
  const upstreamDecisions = buildUpstreamDecisions(upstream.pull_requests.raw);

  const body = `# Weekly Self-Improvement Report

Generated from \`scripts/gather-repo-data.js\` on ${data.gathered_at}.

## Local Repository

- Repository: \`${local.name}\`
- Open PRs: ${local.pull_requests.analysis.total}
- Dependabot PRs: ${local.pull_requests.analysis.dependabot}
- Human-authored PRs: ${local.pull_requests.analysis.human_authored}
- Open issues: ${local.issues.analysis.total}
- Security policy detected by GitHub: ${localSecurityPolicy ? 'Yes' : 'No'}

### Top Local PRs

${summarizeTopTitles(local.pull_requests.raw)}

## Upstream Repository

- Repository: \`${upstream.name}\`
- Open PRs: ${upstream.pull_requests.analysis.total}
- Open issues: ${upstream.issues.analysis.total}
- Security policy detected by GitHub: ${upstreamSecurityPolicy ? 'Yes' : 'No'}

### Top Upstream PRs

${summarizeTopTitles(upstream.pull_requests.raw)}

## Decision Rubric

- Evidence quality: prefer changes grounded in reproducible examples or clear user pain, not vibes.
- Pattern overlap: avoid adding new rules that duplicate existing Humanizer patterns without meaningfully improving coverage.
- False-positive risk: reject changes that are likely to flatten legitimate human style or technical writing.
- Adapter impact: prefer improvements that do not increase sync complexity or runtime dependencies across supported adapters.

## Local Decision Support

${formatDecisionItems(localDecisions)}

## Upstream Decision Support

${formatDecisionItems(upstreamDecisions)}

## Recommended Actions

1. Review and merge the current Dependabot backlog if validation passes.
2. Convert the automated Adopt / Reject / Defer suggestions above into explicit maintainer decisions on the active conductor track.
3. Keep the repo skill-focused: validate adapter sync and distribution first, not npm publishing.
4. Keep experimental subsystems outside the maintained skill surface; the citation manager now lives under \`experiments/citation_ref_manager/\`.
`;

  const decisionsBody = `# Self-Improvement Decision Log

Generated from \`scripts/gather-repo-data.js\` on ${data.gathered_at}.

## Local Decisions

${formatDecisionItems(localDecisions)}

## Upstream Decisions

${formatDecisionItems(upstreamDecisions)}
`;

  const trackDecisionLogBody = `# Self-Improvement Decision Record

**Track:** \`repo-self-improvement_20260303\`

**Generated:** ${data.gathered_at}

**Local Repository:** ${local.name}

**Upstream Repository:** ${upstream.name}

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

${formatDecisionItems(localDecisions)}

## Upstream Repository Decisions

${formatDecisionItems(upstreamDecisions)}
`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, body, 'utf8');
  fs.writeFileSync(decisionsPath, decisionsBody, 'utf8');
  fs.writeFileSync(trackDecisionLogPath, trackDecisionLogBody, 'utf8');
  console.log(`Wrote self-improvement issue body to ${outputPath}`);
  console.log(`Wrote self-improvement decision log to ${decisionsPath}`);
  console.log(`Updated track decision record at ${trackDecisionLogPath}`);
}

main();
