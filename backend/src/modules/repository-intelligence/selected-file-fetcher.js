import { githubClient } from '../../integrations/github/github.client.js';
import { CONSTANTS } from '../../config/constants.config.js';
import { logger } from '../../config/logger.config.js';

/**
 * Fetches content for all scanner-selected files in parallel batches.
 */
export async function fetchSelectedFiles(owner, repository, selectedFiles, commitSha) {
  const BATCH_SIZE = 10;
  const results = [];
  const warnings = [];

  logger.info(`[Fetcher] Fetching ${selectedFiles.length} files for ${owner}/${repository}`);

  // Process in batches to avoid overwhelming GitHub API
  for (let i = 0; i < selectedFiles.length; i += BATCH_SIZE) {
    const batch = selectedFiles.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map((file) => fetchSingleFile(owner, repository, file, commitSha))
    );

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      const file = batch[j];

      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value);
      } else if (result.status === 'rejected') {
        logger.warn(`[Fetcher] Failed to fetch ${file.path}`, { message: result.reason?.message });
        warnings.push({
          path: file.path,
          reason: result.reason?.message || 'Unknown fetch error',
        });
      }
    }
  }

  logger.info(`[Fetcher] Successfully fetched ${results.length}/${selectedFiles.length} files`);

  return { files: results, fetchWarnings: warnings };
}

async function fetchSingleFile(owner, repository, fileInfo, commitSha) {
  const fileData = await githubClient.getFileContent(owner, repository, fileInfo.path, commitSha);

  if (!fileData) return null;

  // Truncate oversized files
  let content = fileData.content;
  let truncated = false;

  if (content.length > CONSTANTS.MAX_FILE_SIZE_BYTES) {
    content = content.slice(0, CONSTANTS.MAX_FILE_SIZE_BYTES);
    truncated = true;
    logger.debug(`[Fetcher] Truncated file: ${fileInfo.path}`);
  }

  return {
    path: fileInfo.path,
    category: fileInfo.category,
    content,
    size: fileData.size,
    truncated,
    source: 'github',
  };
}
