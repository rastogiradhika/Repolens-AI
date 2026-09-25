import { githubClient } from '../../integrations/github/github.client.js';
import { cacheRepository } from '../../integrations/redis/cache.repository.js';
import { rieService } from '../repository-intelligence/rie.service.js';
import { readinessRules } from './readiness-rules.js';
import { scoreCalculator } from './score-calculator.js';
import { suggestionBuilder } from './suggestion-builder.js';
import { logger } from '../../config/logger.config.js';

export const readinessService = {
  async evaluatePullRequest({ repoUrl, prNumber, forceRefresh = false }) {
    const parsed = parseRepoUrl(repoUrl);
    const { owner, repo } = parsed;

    logger.info(`[PR Readiness] Evaluating PR #${prNumber} for ${owner}/${repo}`);

    const pr = await githubClient.getPullRequest(owner, repo, prNumber);
    const cacheKey = `repolens:readiness:${owner}:${repo}:${prNumber}:${pr.headSha || 'latest'}`;

    if (!forceRefresh) {
      const cached = await cacheRepository.get(cacheKey);
      if (cached) {
        logger.info(`[PR Readiness] Cache hit for PR #${prNumber}`);
        return { ...cached, source: 'cache' };
      }
    }

    const [files, commits, rieResult] = await Promise.all([
      githubClient.getPullRequestFiles(owner, repo, prNumber),
      githubClient.getPullRequestCommits(owner, repo, prNumber),
      rieService.processRepository(`https://github.com/${owner}/${repo}`, forceRefresh),
    ]);

    const rio = rieResult?.rio;

    const checks = readinessRules.evaluateAll({ pr, files, commits, rio });
    const score = scoreCalculator.calculate(checks);
    const suggestions = suggestionBuilder.build(checks);

    const hasApplicableChecks = checks.some((c) => c.status !== 'NOT_APPLICABLE');
    const verdict = !hasApplicableChecks
      ? 'NEEDS_REVIEW'
      : score >= 80
      ? 'READY'
      : score >= 50
      ? 'NEEDS_ATTENTION'
      : 'NOT_READY';

    const result = {
      pr: {
        number: pr.number,
        title: pr.title,
        body: pr.body,
        state: pr.state,
        author: pr.author,
        baseBranch: pr.baseBranch,
        headBranch: pr.headBranch,
        baseSha: pr.baseSha,
        headSha: pr.headSha,
        additions: pr.additions,
        deletions: pr.deletions,
        changedFilesCount: files.length,
        url: pr.url,
      },
      repository: {
        owner,
        name: repo,
        url: `https://github.com/${owner}/${repo}`,
      },
      score,
      verdict,
      checks,
      suggestions,
      changedFiles: files.map((f) => ({
        filename: f.filename,
        status: f.status,
        changes: f.changes,
      })),
      evaluatedAt: new Date().toISOString(),
    };

    await cacheRepository.set(cacheKey, result, 3600);

    return { ...result, source: 'evaluation' };
  },
};

function parseRepoUrl(url) {
  try {
    const cleaned = url.replace(/\.git$/, '').trim();
    const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    const parts = cleaned.split('/');
    if (parts.length >= 2) {
      return { owner: parts[parts.length - 2], repo: parts[parts.length - 1] };
    }
    throw new Error('Invalid GitHub URL');
  } catch (err) {
    throw new Error('Please provide a valid GitHub repository URL (e.g. https://github.com/owner/repo)');
  }
}
