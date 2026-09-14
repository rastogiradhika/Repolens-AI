import { parseGitHubUrl } from '../../shared/utilities/url-parser.js';
import { AppError } from '../../shared/errors/app-error.js';
import { logger } from '../../config/logger.config.js';
import { githubClient } from '../../integrations/github/github.client.js';

/**
 * Validates the repository URL and confirms the repo exists on GitHub.
 */
export async function validateRepository(rawUrl) {
  // Step 1: Parse and normalize URL
  const parsed = parseGitHubUrl(rawUrl);
  const { owner, repository } = parsed;

  logger.info(`[Validator] Validating repository: ${owner}/${repository}`);

  // Step 2: Confirm repo exists and is accessible on GitHub
  let metadata;
  try {
    metadata = await githubClient.getRepositoryMetadata(owner, repository);
  } catch (err) {
    if (err.code === 'REPOSITORY_NOT_FOUND') {
      throw AppError.repositoryNotFound(owner, repository);
    }
    throw err;
  }

  // Step 3: Reject private repositories
  if (metadata.isPrivate) {
    throw AppError.privateRepository(owner, repository);
  }

  // Step 4: Warn about archived repositories (still analyze, but warn)
  if (metadata.isArchived) {
    logger.warn(`[Validator] Repository ${owner}/${repository} is archived`);
  }

  return { parsed, metadata };
}
