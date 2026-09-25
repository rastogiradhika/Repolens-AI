/**
 * Builds the Redis cache key for a repository analysis.
 * Format: owner/repository@commitSHA
 * Example: facebook/react@abc123
 */
export function buildRioCacheKey(owner, repository, commitSha) {
  return `${owner}/${repository}@${commitSha}`;
}

/**
 * Builds a key to store repo metadata (for quick SHA lookups).
 * Format: meta:owner/repository
 */
export function buildMetaCacheKey(owner, repository) {
  return `meta:${owner}/${repository}`;
}
