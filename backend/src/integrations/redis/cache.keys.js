/**
 * Builds the Redis cache key for a repository analysis.
 * Format: owner/repository@commitSHA
 * Example: facebook/react@abc123
 */
export function buildRioCacheKey(owner, repository, commitSha) {
  return `rio:v1:${owner}/${repository}@${commitSha}`;
}

/**
 * Builds a key to store repo metadata (for quick SHA lookups).
 * Format: meta:owner/repository
 */
export function buildMetaCacheKey(owner, repository) {
  return `meta:${owner}/${repository}`;
}

/**
 * Builds a readiness cache key for one exact PR version and repository snapshot.
 */
export function buildPrReadinessCacheKey(owner, repository, pullRequestNumber, headSha, baseSha) {
  return `pr-readiness:v1:${owner}/${repository}:pr-${pullRequestNumber}:head-${headSha}:base-${baseSha}`;
}
