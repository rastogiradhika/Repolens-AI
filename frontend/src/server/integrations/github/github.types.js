// GitHub API type definitions as JSDoc comments for IDE support

/**
 * @typedef {Object} GitHubRepoMetadata
 * @property {string} owner
 * @property {string} name
 * @property {string} fullName
 * @property {string|null} description
 * @property {string} defaultBranch
 * @property {string|null} primaryLanguage
 * @property {string|null} license
 * @property {number} stars
 * @property {boolean} isFork
 * @property {boolean} isArchived
 * @property {boolean} isPrivate
 * @property {string} url
 */

/**
 * @typedef {Object} GitHubTreeItem
 * @property {string} path
 * @property {number} size
 * @property {string} sha
 */

/**
 * @typedef {Object} GitHubFileContent
 * @property {string} path
 * @property {string} content
 * @property {number} size
 * @property {boolean} truncated
 * @property {string} source
 */

export {};
