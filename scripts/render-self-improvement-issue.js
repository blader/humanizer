import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const GITHUB_API = 'https://api.github.com';

function getGitHubHeaders() {
  return {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'humanizer-self-improvement-renderer',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
  };
}

async function fetchGitHubPullRequests(repoName, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(
        `${GITHUB_API}/repos/${repoName}/pulls?state=open&per_page=100`,
        {
          headers: getGitHubHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === retries - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  return [];
}

function dedupePullRequests(items) {
  return Array.from(new Map(items.map((item) => [item.number, item])).values());
}

function isDependencyBotAuthor(author) {
  return [
    'dependabot',
    'dependabot[bot]',
    'app/dependabot',
    'renovate[bot]',
    'renovate-bot',
  ].includes(author || '');
}

function normalizePullRequest(pr) {
  return {
    number: pr.number,
    title: pr.title,
    state: pr.state,
    draft: Boolean(pr.draft),
    author: pr.author || pr.user?.login || 'unknown',
    updated_at: pr.updated_at || null,
    is_dependency_bot:
      typeof pr.is_dependency_bot === 'boolean'
        ? pr.is_dependency_bot
        : isDependencyBotAuthor(pr.user?.login),
  };
}

function getOpenPullRequests(prs) {
  return dedupePullRequests(prs.map(normalizePullRequest))
    .filter((pr) => pr.state === 'open')
    .sort((left, right) => new Date(right.updated_at || 0) - new Date(left.updated_at || 0));
}

function getActionableDependencyPullRequests(prs) {
  return getOpenPullRequests(prs).filter((pr) => pr.is_dependency_bot);
}

async function resolveLocalPullRequests(repoName, fallbackPrs) {
  try {
    return getOpenPullRequests(await fetchGitHubPullRequests(repoName));
  } catch (error) {
    console.warn(`Falling back to snapshot data for ${repoName}: ${error.message}`);
    return getOpenPullRequests(fallbackPrs);
  }
}

function summarizeTopTitles(items, limit = 5) {
  if (items.length === 0) {
    return '- None';
  }

  return items
    .slice(0, limit)
    .map((item) => `- #${item.number} ${item.title}`)
    .join('\n');
}

function formatPullRequestUrl(repoName, number) {
  return `https://github.com/${repoName}/pull/${number}`;
}

function formatBlobUrl(repoName, branchName, filePath) {
  return `https://github.com/${repoName}/blob/${branchName}/${filePath}`;
}

function formatCandidateLinks(repoName, items) {
  if (items.length === 0) {
    return '- None';
  }

  return items
    .map(
      (item) => `- [#${item.number} ${item.title}](${formatPullRequestUrl(repoName, item.number)})`
    )
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
  return localPrs.slice(0, 10).map((pr) => classifyDecision(pr, 'local', LOCAL_DECISION_RULES));
}

function buildUpstreamDecisions(upstreamPrs) {
  return upstreamPrs
    .slice(0, 8)
    .map((pr) => classifyDecision(pr, 'upstream', UPSTREAM_DECISION_RULES));
}

async function main() {
  const inputPath =
    process.argv[2] ||
    path.join(REPO_ROOT, 'conductor', 'tracks', 'repo-self-improvement_20260303', 'repo-data.json');
  const outputPath =
    process.argv[3] || path.join(REPO_ROOT, '.github', 'generated', 'self-improvement-issue.md');
  const decisionsPath = outputPath.replace(
    /self-improvement-issue\.md$/,
    'self-improvement-decisions.md'
  );
  const prBodyPath = outputPath.replace(
    /self-improvement-issue\.md$/,
    'self-improvement-pr-body.md'
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
  const localPullRequests = await resolveLocalPullRequests(local.name, local.pull_requests.raw);
  const localCandidates = getActionableDependencyPullRequests(localPullRequests);
  const localDecisions = buildLocalDecisions(localCandidates);
  const upstreamDecisions = buildUpstreamDecisions(upstream.pull_requests.raw);
  const localBacklogAction =
    localCandidates.length > 0
      ? 'Review and merge the current automated dependency backlog if validation passes.'
      : 'No local automated dependency backlog is open this cycle; keep Renovate policy and required checks unchanged.';
  const decisionRecordBranch = 'automation/self-improvement-decision-record';
  const decisionRecordPath =
    'conductor/tracks/repo-self-improvement_20260303/upstream-decision-log.md';
  const planPath = 'conductor/tracks/repo-self-improvement_20260303/plan.md';
  const generatedIssuePath = '.github/generated/self-improvement-issue.md';
  const generatedDecisionsPath = '.github/generated/self-improvement-decisions.md';

  const body = `# Weekly Self-Improvement Report

Generated from \`scripts/gather-repo-data.js\` on ${data.gathered_at}.

## Local Repository

- Repository: \`${local.name}\`
- Open PRs: ${localPullRequests.length}
- Automated dependency PRs: ${localCandidates.length}
- Human-authored PRs: ${localPullRequests.filter((pr) => !pr.is_dependency_bot).length}
- Open issues: ${local.issues.analysis.total}
- Security policy detected by GitHub: ${localSecurityPolicy ? 'Yes' : 'No'}

### Top Local PRs

${summarizeTopTitles(localPullRequests)}

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

1. ${localBacklogAction}
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

  const prBody = `## Summary

- refresh the self-improvement decision record from the latest scheduled analysis
- keep the maintainer-facing Adopt / Reject / Defer state in version control
- preserve the supporting issue and generated artifacts for longer-form review

## Maintainer Checklist

- [ ] Review the refreshed [decision record](${formatBlobUrl(local.name, decisionRecordBranch, decisionRecordPath)})
- [ ] Confirm the current local dependency candidates still match repo policy
- [ ] Confirm upstream candidates still fit the evidence, overlap, and false-positive rubric
- [ ] Edit any final Adopt / Reject / Defer calls directly in the decision record before merging
- [ ] Merge only if the decision record reflects the maintainer's final call for this cycle

## Current Local Candidates

${formatCandidateLinks(local.name, localCandidates.slice(0, 10))}

## Current Upstream Candidates

${formatCandidateLinks(upstream.name, upstream.pull_requests.raw.slice(0, 8))}

## Supporting Files

- [Track decision record](${formatBlobUrl(local.name, decisionRecordBranch, decisionRecordPath)})
- [Track plan](${formatBlobUrl(local.name, decisionRecordBranch, planPath)})
- [Generated issue body](${formatBlobUrl(local.name, decisionRecordBranch, generatedIssuePath)})
- [Generated decision log](${formatBlobUrl(local.name, decisionRecordBranch, generatedDecisionsPath)})

## Notes

- repo intelligence artifacts remain attached to the workflow run
- this PR is intentionally draft-only for human review
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
  fs.writeFileSync(prBodyPath, prBody, 'utf8');
  fs.writeFileSync(trackDecisionLogPath, trackDecisionLogBody, 'utf8');
  console.log(`Wrote self-improvement issue body to ${outputPath}`);
  console.log(`Wrote self-improvement decision log to ${decisionsPath}`);
  console.log(`Wrote self-improvement PR body to ${prBodyPath}`);
  console.log(`Updated track decision record at ${trackDecisionLogPath}`);
}

main().catch((error) => {
  console.error('Failed to render self-improvement outputs.');
  console.error(`Input: ${process.argv[2] || 'default repo-data.json'}`);
  console.error(error);
  process.exit(1);
});
