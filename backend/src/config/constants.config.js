export const CONSTANTS = {
  // Analysis
  ANALYSIS_TIMEOUT_MS: 60_000,        // 60 seconds max analysis time
  GITHUB_REQUEST_TIMEOUT_MS: 15_000,  // 15 seconds per GitHub API call
  MAX_TREE_SIZE: 5000,                // Max files in repo tree
  MAX_FILE_SIZE_BYTES: 500_000,       // 500 KB max per file
  MAX_SELECTED_FILES: 50,             // Max files to fetch content for
  SCANNER_VERSION: '1.0.0',

  // Cache
  CACHE_TTL_SECONDS: 86_400,          // 24 hours

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 60_000,       // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 10,        // 10 analyze requests per minute per IP

  // GitHub API base
  GITHUB_API_BASE: 'https://api.github.com',
};
