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

function main() {
  const inputPath =
    process.argv[2] ||
    path.join(REPO_ROOT, 'conductor', 'tracks', 'repo-self-improvement_20260303', 'repo-data.json');
  const outputPath =
    process.argv[3] || path.join(REPO_ROOT, '.github', 'generated', 'self-improvement-issue.md');

  const raw = fs.readFileSync(inputPath, 'utf8');
  const data = JSON.parse(raw);

  const local = data.local_repository;
  const upstream = data.upstream_repository;
  const localSecurityPolicy = local.security?.has_security_policy ?? false;
  const upstreamSecurityPolicy = upstream.security?.has_security_policy ?? false;

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

## Recommended Actions

1. Review and merge the current Dependabot backlog if validation passes.
2. Record explicit Adopt / Reject / Defer decisions for the highest-signal upstream PRs.
3. Keep the repo skill-focused: validate adapter sync and distribution first, not npm publishing.
4. Keep experimental subsystems outside the maintained skill surface; the citation manager now lives under \`experiments/citation_ref_manager/\`.
`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, body, 'utf8');
  console.log(`Wrote self-improvement issue body to ${outputPath}`);
}

main();
