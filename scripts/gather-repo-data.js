#!/usr/bin/env node

/**
 * Repository Self-Improvement Data Gatherer
 *
 * Fetches live data from GitHub for repo self-improvement tracks.
 * Outputs structured JSON for track specification population.
 *
 * Usage: node scripts/gather-repo-data.js <local_repo> <upstream_repo>
 * Example: node scripts/gather-repo-data.js edithatogo/humanizer-next blader/humanizer
 */

import fs from 'fs';
import path from 'path';

const LOCAL_REPO = process.argv[2] || 'edithatogo/humanizer-next';
const UPSTREAM_REPO = process.argv[3] || 'blader/humanizer';
const OUTPUT_DIR = './conductor/tracks/repo-self-improvement_20260303';

// GitHub API base URL
const GITHUB_API = 'https://api.github.com';
const SECURITY_POLICY_CANDIDATES = ['SECURITY.md', '.github/SECURITY.md', 'docs/SECURITY.md'];

function getGitHubHeaders() {
  return {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'humanizer-self-improvement-bot',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
  };
}

/**
 * Fetch data from GitHub API with rate limit handling
 */
async function fetchGitHub(endpoint, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${GITHUB_API}${endpoint}`, {
        headers: getGitHubHeaders(),
      });

      if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
        const resetTime = new Date(response.headers.get('X-RateLimit-Reset') * 1000);
        console.log(`Rate limited. Reset at: ${resetTime}`);
        throw new Error('Rate limited');
      }

      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry ${i + 1}/${retries}...`);
      await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}

/**
 * Check whether a file exists in a repository.
 * @param {string} repo
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
async function repoFileExists(repo, filePath) {
  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetch(`${GITHUB_API}/repos/${repo}/contents/${filePath}`, {
        method: 'HEAD',
        headers: getGitHubHeaders(),
      });

      if (response.status === 404) {
        return false;
      }

      if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
        const resetTime = new Date(response.headers.get('X-RateLimit-Reset') * 1000);
        console.log(`Rate limited while checking ${filePath}. Reset at: ${resetTime}`);
        throw new Error('Rate limited');
      }

      if (!response.ok) {
        throw new Error(`Failed to check ${filePath} in ${repo}: ${response.status}`);
      }

      return true;
    } catch (error) {
      if (i === 2) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
}

/**
 * Detect whether a repository publishes a SECURITY.md policy in a standard location.
 * @param {string} repo
 * @returns {Promise<boolean>}
 */
async function hasPublishedSecurityPolicy(repo) {
  for (const candidate of SECURITY_POLICY_CANDIDATES) {
    if (await repoFileExists(repo, candidate)) {
      return true;
    }
  }

  return false;
}

/**
 * Fetch pull requests from a repository
 */
async function getPullRequests(repo, state = 'open') {
  console.log(`Fetching PRs from ${repo}...`);
  const prs = await fetchGitHub(`/repos/${repo}/pulls?state=${state}&per_page=100`);
  return prs.map((pr) => ({
    number: pr.number,
    title: pr.title,
    author: pr.user?.login || 'unknown',
    created_at: pr.created_at,
    updated_at: pr.updated_at,
    state: pr.state,
    draft: pr.draft,
    labels: pr.labels.map((l) => l.name),
    additions: pr.additions,
    deletions: pr.deletions,
    comments: pr.comments,
    review_comments: pr.review_comments,
    mergeable: pr.mergeable,
    mergeable_state: pr.mergeable_state,
    body: pr.body?.substring(0, 500) || '',
    is_dependabot: pr.user?.login === 'dependabot' || pr.user?.login === 'dependabot[bot]',
  }));
}

/**
 * Fetch issues from a repository
 */
async function getIssues(repo, state = 'open') {
  console.log(`Fetching issues from ${repo}...`);
  const issues = await fetchGitHub(`/repos/${repo}/issues?state=${state}&per_page=100`);
  return issues
    .filter((issue) => !issue.pull_request) // Exclude PRs
    .map((issue) => {
      const labels = issue.labels.map((label) => label.name);

      return {
        number: issue.number,
        title: issue.title,
        author: issue.user?.login || 'unknown',
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        state: issue.state,
        labels,
        comments: issue.comments,
        body: issue.body?.substring(0, 500) || '',
        is_bug: labels.includes('bug') || labels.includes('🐛 Bug'),
        is_enhancement: labels.includes('enhancement') || labels.includes('💡 Enhancement'),
        is_feature: labels.includes('feature') || labels.includes('✨ Feature Request'),
      };
    });
}

/**
 * Fetch repository metadata
 */
async function getRepoMetadata(repo) {
  console.log(`Fetching metadata for ${repo}...`);
  const [repoData, hasSecurityPolicy] = await Promise.all([
    fetchGitHub(`/repos/${repo}`),
    hasPublishedSecurityPolicy(repo),
  ]);

  return {
    name: repoData.name,
    full_name: repoData.full_name,
    description: repoData.description,
    homepage: repoData.homepage,
    language: repoData.language,
    stargazers_count: repoData.stargazers_count,
    forks_count: repoData.forks_count,
    open_issues_count: repoData.open_issues_count,
    default_branch: repoData.default_branch,
    has_security_policy: hasSecurityPolicy,
    has_vulnerability_alerts:
      repoData.security_and_analysis?.dependabot_security_updates?.status === 'enabled',
    created_at: repoData.created_at,
    updated_at: repoData.updated_at,
  };
}

/**
 * Check for security advisories
 */
async function getSecurityAdvisories(repo) {
  console.log(`Fetching security advisories for ${repo}...`);
  try {
    const advisories = await fetchGitHub(`/repos/${repo}/security-advisories?per_page=100`);
    return advisories || [];
  } catch {
    console.log(`No security advisories API access for ${repo}`);
    return [];
  }
}

/**
 * Analyze and categorize PRs
 */
function analyzePRs(prs) {
  const analysis = {
    total: prs.length,
    dependabot: prs.filter((pr) => pr.is_dependabot).length,
    human_authored: prs.filter((pr) => !pr.is_dependabot).length,
    drafts: prs.filter((pr) => pr.draft).length,
    mergeable: prs.filter((pr) => pr.mergeable === true).length,
    has_conflicts: prs.filter((pr) => pr.mergeable_state === 'dirty').length,
    by_category: {
      dependency_updates: prs.filter((pr) => pr.title.includes('deps') || pr.title.includes('bump'))
        .length,
      features: prs.filter((pr) => pr.labels.includes('feature') || pr.title.startsWith('feat:'))
        .length,
      bug_fixes: prs.filter((pr) => pr.labels.includes('bug') || pr.title.startsWith('fix:'))
        .length,
      documentation: prs.filter(
        (pr) => pr.labels.includes('documentation') || pr.title.startsWith('docs:')
      ).length,
      other: 0,
    },
  };

  analysis.by_category.other =
    analysis.total -
    analysis.by_category.dependency_updates -
    analysis.by_category.features -
    analysis.by_category.bug_fixes -
    analysis.by_category.documentation;

  return analysis;
}

/**
 * Analyze and categorize issues
 */
function analyzeIssues(issues) {
  const analysis = {
    total: issues.length,
    by_type: {
      bugs: issues.filter((i) => i.is_bug).length,
      enhancements: issues.filter((i) => i.is_enhancement).length,
      features: issues.filter((i) => i.is_feature).length,
      other: issues.filter((i) => !i.is_bug && !i.is_enhancement && !i.is_feature).length,
    },
    avg_comments: issues.reduce((sum, i) => sum + i.comments, 0) / issues.length || 0,
    recent: issues.filter((i) => {
      const date = new Date(i.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date > thirtyDaysAgo;
    }).length,
  };

  return analysis;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Repository Self-Improvement Data Gatherer\n');
  console.log(`Local Repository: ${LOCAL_REPO}`);
  console.log(`Upstream Repository: ${UPSTREAM_REPO}`);
  console.log(`Output Directory: ${OUTPUT_DIR}\n`);

  const timestamp = new Date().toISOString();

  try {
    // Fetch local repo data
    console.log('=== Fetching Local Repository Data ===\n');
    const [localPRs, localIssues, localMetadata, localSecurity] = await Promise.all([
      getPullRequests(LOCAL_REPO),
      getIssues(LOCAL_REPO),
      getRepoMetadata(LOCAL_REPO),
      getSecurityAdvisories(LOCAL_REPO),
    ]);

    // Fetch upstream repo data
    console.log('\n=== Fetching Upstream Repository Data ===\n');
    const [upstreamPRs, upstreamIssues, upstreamMetadata] = await Promise.all([
      getPullRequests(UPSTREAM_REPO),
      getIssues(UPSTREAM_REPO),
      getRepoMetadata(UPSTREAM_REPO),
    ]);

    // Analyze data
    const localPRAnalysis = analyzePRs(localPRs);
    const localIssueAnalysis = analyzeIssues(localIssues);
    const upstreamPRAnalysis = analyzePRs(upstreamPRs);
    const upstreamIssueAnalysis = analyzeIssues(upstreamIssues);

    // Compile report
    const report = {
      gathered_at: timestamp,
      local_repository: {
        name: LOCAL_REPO,
        metadata: localMetadata,
        pull_requests: {
          raw: localPRs,
          analysis: localPRAnalysis,
        },
        issues: {
          raw: localIssues,
          analysis: localIssueAnalysis,
        },
        security: {
          advisories: localSecurity,
          has_security_policy: localMetadata.has_security_policy,
          has_vulnerability_alerts: localMetadata.has_vulnerability_alerts,
        },
      },
      upstream_repository: {
        name: UPSTREAM_REPO,
        metadata: upstreamMetadata,
        pull_requests: {
          raw: upstreamPRs,
          analysis: upstreamPRAnalysis,
        },
        issues: {
          raw: upstreamIssues,
          analysis: upstreamIssueAnalysis,
        },
      },
      recommendations: {
        immediate_actions: [],
        high_priority: [],
        medium_priority: [],
        low_priority: [],
      },
    };

    // Generate recommendations
    if (localPRAnalysis.dependabot > 0) {
      report.recommendations.immediate_actions.push(
        `Review and merge ${localPRAnalysis.dependabot} Dependabot PR(s)`
      );
    }

    if (!localMetadata.has_security_policy) {
      report.recommendations.high_priority.push(
        'Create SECURITY.md with vulnerability reporting process'
      );
    }

    if (upstreamPRAnalysis.total > 0) {
      report.recommendations.high_priority.push(
        `Assess ${upstreamPRAnalysis.total} upstream PR(s) for adoption`
      );
    }

    // Write output
    const outputPath = path.join(OUTPUT_DIR, 'repo-data.json');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

    console.log('\n✅ Data gathering complete!\n');
    console.log('=== Summary ===\n');
    console.log(`Local Repository (${LOCAL_REPO}):`);
    console.log(
      `  - Open PRs: ${localPRAnalysis.total} (${localPRAnalysis.dependabot} Dependabot, ${localPRAnalysis.human_authored} human)`
    );
    console.log(
      `  - Open Issues: ${localIssueAnalysis.total} (${localIssueAnalysis.by_type.bugs} bugs, ${localIssueAnalysis.by_type.enhancements} enhancements)`
    );
    console.log(`  - Security Policy: ${localMetadata.has_security_policy ? 'Yes' : 'No'}`);

    console.log(`\nUpstream Repository (${UPSTREAM_REPO}):`);
    console.log(
      `  - Open PRs: ${upstreamPRAnalysis.total} (${upstreamPRAnalysis.dependabot} Dependabot, ${upstreamPRAnalysis.human_authored} human)`
    );
    console.log(
      `  - Open Issues: ${upstreamIssueAnalysis.total} (${upstreamIssueAnalysis.by_type.bugs} bugs, ${upstreamIssueAnalysis.by_type.enhancements} enhancements)`
    );

    console.log(`\n📄 Report saved to: ${outputPath}`);
    console.log('\n=== Recommendations ===\n');

    if (report.recommendations.immediate_actions.length > 0) {
      console.log('Immediate Actions:');
      report.recommendations.immediate_actions.forEach((r) => console.log(`  - ${r}`));
    }

    if (report.recommendations.high_priority.length > 0) {
      console.log('\nHigh Priority:');
      report.recommendations.high_priority.forEach((r) => console.log(`  - ${r}`));
    }
  } catch (error) {
    console.error('\n❌ Error gathering data:', error.message);
    process.exit(1);
  }
}

// Run main function
main();
