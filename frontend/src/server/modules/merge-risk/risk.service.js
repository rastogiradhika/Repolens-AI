import { githubClient } from '../../integrations/github/github.client.js';
import { cacheRepository } from '../../integrations/redis/cache.repository.js';
import { rieService } from '../repository-intelligence/rie.service.js';
import { fileOverlapAnalyzer } from './file-overlap.js';
import { dependencyGraph } from './dependency-graph.js';
import { riskEngine } from './risk-engine.js';
import { logger } from '../../config/logger.config.js';

export const riskService = {
  async evaluateMergeRisk({ repoUrl, prNumber, targetBranch = 'main', forceRefresh = false }) {
    const parsed = parseRepoUrl(repoUrl);
    const { owner, repo } = parsed;

    logger.info(`[Merge Risk] Evaluating merge risk for ${owner}/${repo} PR #${prNumber} -> ${targetBranch}`);

    const pr = await githubClient.getPullRequest(owner, repo, prNumber);
    const cacheKey = `repolens:mergerisk:${owner}:${repo}:${prNumber}:${targetBranch}:${pr.headSha || 'latest'}`;

    if (!forceRefresh) {
      const cached = await cacheRepository.get(cacheKey);
      if (cached) {
        return { ...cached, source: 'cache' };
      }
    }

    const [files, rieResult, openPrs] = await Promise.all([
      githubClient.getPullRequestFiles(owner, repo, prNumber),
      rieService.processRepository(`https://github.com/${owner}/${repo}`, forceRefresh),
      githubClient.getOpenPullRequests(owner, repo),
    ]);

    const overlapData = fileOverlapAnalyzer.analyze({ files, targetBranch });
    const couplingData = dependencyGraph.analyze({ files, rio: rieResult?.rio });
    const riskAssessment = riskEngine.calculateRisk({ overlapData, couplingData, pr });

    const otherOpenPrs = (openPrs || []).filter((p) => p.number !== parseInt(prNumber, 10));

    const result = {
      repository: {
        owner,
        name: repo,
        url: `https://github.com/${owner}/${repo}`,
      },
      pullRequest: {
        number: pr.number,
        title: pr.title,
        baseBranch: pr.baseBranch,
        headBranch: pr.headBranch,
        headSha: pr.headSha,
        author: pr.author,
      },
      targetBranch,
      riskLevel: riskAssessment.level,
      riskScore: riskAssessment.score,
      summary: riskAssessment.summary,
      reasons: riskAssessment.reasons,
      recommendations: riskAssessment.recommendations,
      affectedModules: riskAssessment.affectedModules,
      concurrentOpenPrsCount: otherOpenPrs.length,
      concurrentOpenPrs: otherOpenPrs.slice(0, 5),
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
