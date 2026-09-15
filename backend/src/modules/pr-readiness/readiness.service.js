import { githubClient } from '../../integrations/github/github.client.js';
import { cacheRepository } from '../../integrations/redis/cache.repository.js';
import { buildPrReadinessCacheKey } from '../../integrations/redis/cache.keys.js';
import { parseGitHubUrl } from '../../shared/utilities/url-parser.js';
import { AppError } from '../../shared/errors/app-error.js';
import { logger } from '../../config/logger.config.js';
import { rieService } from '../repository-intelligence/rie.service.js';
import { runReadinessChecks } from './readiness-rules.js';
import { calculateReadinessScore } from './score-calculator.js';
import { buildSuggestions } from './suggestion-builder.js';
import {
  parseReadinessResponse,
  parseReadinessResult,
} from './readiness.schema.js';

export const readinessService = {
  async analyze({ repositoryUrl, pullRequestNumber, forceRefresh = false }) {
    const { owner, repository } = parseGitHubUrl(repositoryUrl);
    const pullRequest = await fetchPullRequest(owner, repository, pullRequestNumber);
    const cacheKey = buildPrReadinessCacheKey(
      owner,
      repository,
      pullRequest.number,
      pullRequest.head.sha,
      pullRequest.base.sha
    );

    if (!forceRefresh) {
      const cached = await cacheRepository.get(cacheKey);
      if (cached?.rio) {
        const cachedResponse = parseReadinessResponse(cached.rio);
        logger.info(`[Readiness] Cache hit for ${owner}/${repository}#${pullRequest.number}@${pullRequest.head.sha}`);
        return {
          ...cachedResponse,
          cache: { source: 'cache', cachedAt: cached.cachedAt },
        };
      }
    }

    const [prFiles, commits, rioResult] = await Promise.all([
      githubClient.getPullRequestFiles(owner, repository, pullRequest.number),
      githubClient.getPullRequestCommits(owner, repository, pullRequest.number),
      rieService.processRepositoryAtCommit(repositoryUrl, pullRequest.base.sha),
    ]);

    if (!rioResult?.rio) {
      throw AppError.rioUnavailable();
    }

    const checks = runReadinessChecks(
      rioResult.rio,
      { ...pullRequest, files: prFiles, commits }
    );
    const score = calculateReadinessScore(checks);
    const readiness = parseReadinessResult({
      ...score,
      checks,
      suggestions: buildSuggestions(checks),
    });

    const response = parseReadinessResponse({
      repository: {
        owner,
        name: repository,
        fullName: `${owner}/${repository}`,
        url: `https://github.com/${owner}/${repository}`,
      },
      pullRequest,
      rio: {
        commitSha: pullRequest.base.sha,
        source: rioResult.source,
      },
      readiness,
      cache: {
        source: 'analysis',
        cachedAt: new Date().toISOString(),
      },
    });

    await cacheRepository.set(cacheKey, response);
    return response;
  },
};

async function fetchPullRequest(owner, repository, pullRequestNumber) {
  try {
    return await githubClient.getPullRequest(owner, repository, pullRequestNumber);
  } catch (error) {
    if (error.code === 'REPOSITORY_NOT_FOUND') {
      throw AppError.pullRequestNotFound(owner, repository, pullRequestNumber);
    }
    throw error;
  }
}