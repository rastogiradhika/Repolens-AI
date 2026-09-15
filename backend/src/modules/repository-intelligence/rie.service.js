import { analyzeRepository } from './analysis-orchestrator.js';
import { cacheRepository } from '../../integrations/redis/cache.repository.js';
import { buildRioCacheKey } from '../../integrations/redis/cache.keys.js';
import { githubClient } from '../../integrations/github/github.client.js';
import { parseGitHubUrl } from '../../shared/utilities/url-parser.js';
import { logger } from '../../config/logger.config.js';

export const rieService = {
  /**
   * Main entry point for RIE analysis request.
   * Handles caching layer on top of orchestrator.
   */
  async processRepository(rawUrl, forceRefresh = false) {
    // Parse URL first to get owner/repo
    const { owner, repository } = parseGitHubUrl(rawUrl);
    
    let metadata;
    let commitSha;

    // Fetch basic metadata to get the latest commit SHA
    metadata = await githubClient.getRepositoryMetadata(owner, repository);
    commitSha = await githubClient.getLatestCommitSha(owner, repository, metadata.defaultBranch);

    const cacheKey = buildRioCacheKey(owner, repository, commitSha);

    // Check Cache (unless forceRefresh is true)
    if (!forceRefresh) {
      const cached = await cacheRepository.get(cacheKey);
      if (cached) {
        logger.info(`[Service] Cache hit for ${owner}/${repository}@${commitSha}`);
        return {
          rio: cached.rio,
          source: 'cache',
          cachedAt: cached.cachedAt,
        };
      }
    }

    logger.info(`[Service] Cache miss/force refresh for ${owner}/${repository} — starting analysis`);

    // Run Full Analysis
    const rio = await analyzeRepository(rawUrl);

    // Save to Cache
    await cacheRepository.set(cacheKey, rio);

    return {
      rio,
      source: 'analysis',
      cachedAt: new Date().toISOString(),
    };
  },

  /**
   * Loads or builds RIO for an exact repository commit.
   * Readiness must use the pull request base commit, not an arbitrary branch HEAD.
   */
  async processRepositoryAtCommit(rawUrl, commitSha, forceRefresh = false) {
    const { owner, repository } = parseGitHubUrl(rawUrl);
    const metadata = await githubClient.getRepositoryMetadata(owner, repository);
    const cacheKey = buildRioCacheKey(owner, repository, commitSha);

    if (!forceRefresh) {
      const cached = await cacheRepository.get(cacheKey);
      if (cached) {
        logger.info(`[Service] Cache hit for ${owner}/${repository}@${commitSha}`);
        return {
          rio: cached.rio,
          source: 'cache',
          cachedAt: cached.cachedAt,
        };
      }
    }

    const rio = await analyzeRepository(rawUrl, commitSha);
    await cacheRepository.set(cacheKey, rio);

    return {
      rio,
      source: 'analysis',
      cachedAt: new Date().toISOString(),
    };
  },
};
