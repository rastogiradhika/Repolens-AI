import { fileRegistry } from './file-registry.js';
import { CONSTANTS } from '../../config/constants.config.js';
import { logger } from '../../config/logger.config.js';

/**
 * Repository Scanner — selects important files from the GitHub tree.
 * Extractors must NOT search the tree themselves.
 */
export function scanRepositoryTree(treeItems) {
  const selected = [];
  const topLevelDirs = new Set();

  for (const item of treeItems) {
    // Collect top-level directories
    const parts = item.path.split('/');
    if (parts.length > 1) {
      topLevelDirs.add(parts[0]);
    }

    // Classify the file via File Registry
    const classification = fileRegistry.classify(item.path);
    if (!classification) continue;

    // Apply size limit
    if (item.size && item.size > CONSTANTS.MAX_FILE_SIZE_BYTES) {
      logger.debug(`[Scanner] Skipping oversized file: ${item.path} (${item.size} bytes)`);
      continue;
    }

    selected.push({
      path: item.path,
      category: classification.category,
      priority: classification.priority,
      size: item.size || 0,
      sha: item.sha,
    });
  }

  // Sort by priority (lower number = higher priority), then by path
  selected.sort((a, b) => a.priority - b.priority || a.path.localeCompare(b.path));

  // Enforce maximum selected files
  const limited = selected.slice(0, CONSTANTS.MAX_SELECTED_FILES);

  logger.info(`[Scanner] Selected ${limited.length} files from ${treeItems.length} total`);

  return {
    selectedFiles: limited,
    topLevelDirectories: [...topLevelDirs].sort(),
    totalTreeSize: treeItems.length,
  };
}
