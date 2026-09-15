import axios from 'axios';
import { env } from '../../config/env.config.js';
import { CONSTANTS } from '../../config/constants.config.js';
import { logger } from '../../config/logger.config.js';
import { AppError } from '../../shared/errors/app-error.js';
import { GitHubErrors } from './github.errors.js';

// Create axios instance with GitHub auth
const githubAxios = axios.create({
  baseURL: CONSTANTS.GITHUB_API_BASE,
  timeout: CONSTANTS.GITHUB_REQUEST_TIMEOUT_MS,
  headers: {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'RepoLens-AI/1.0.0',
  },
});

// Response interceptor to handle GitHub errors uniformly
githubAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    throw GitHubErrors.fromAxiosError(error);
  }
);

export const githubClient = {
  /**
   * Fetches repository metadata + default branch.
   */
  async getRepositoryMetadata(owner, repo) {
    logger.debug(`[GitHub] Fetching metadata for ${owner}/${repo}`);
    const { data } = await githubAxios.get(`/repos/${owner}/${repo}`);
    return {
      owner: data.owner.login,
      name: data.name,
      fullName: data.full_name,
      description: data.description || null,
      defaultBranch: data.default_branch,
      primaryLanguage: data.language || null,
      license: data.license?.spdx_id || null,
      stars: data.stargazers_count,
      isFork: data.fork,
      isArchived: data.archived,
      isPrivate: data.private,
      url: data.html_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  /**
   * Fetches the latest commit SHA for a branch.
   */
  async getLatestCommitSha(owner, repo, branch) {
    logger.debug(`[GitHub] Fetching latest commit SHA for ${owner}/${repo}@${branch}`);
    const { data } = await githubAxios.get(`/repos/${owner}/${repo}/commits/${branch}`, {
      params: { per_page: 1 },
    });
    return data.sha;
  },

  /**
   * Fetches the full repository file tree recursively.
   */
  async getRepositoryTree(owner, repo, commitSha) {
    logger.debug(`[GitHub] Fetching tree for ${owner}/${repo}@${commitSha}`);
    const { data } = await githubAxios.get(
      `/repos/${owner}/${repo}/git/trees/${commitSha}`,
      { params: { recursive: '1' } }
    );

    if (data.truncated) {
      logger.warn(`[GitHub] Tree truncated for ${owner}/${repo} — repository may be too large`);
      if (data.tree.length > CONSTANTS.MAX_TREE_SIZE) {
        throw AppError.treeTooLarge();
      }
    }

    // Return only file entries (not directories)
    return data.tree.filter((item) => item.type === 'blob').map((item) => ({
      path: item.path,
      size: item.size,
      sha: item.sha,
    }));
  },

  /**
   * Fetches the raw content of a single file by path.
   */
  async getFileContent(owner, repo, filePath, ref) {
    logger.debug(`[GitHub] Fetching file content: ${filePath}`);
    try {
      const { data } = await githubAxios.get(
        `/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`,
        { params: { ref } }
      );

      if (data.encoding === 'base64' && data.content) {
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return {
          path: filePath,
          content,
          size: data.size,
          truncated: data.size > CONSTANTS.MAX_FILE_SIZE_BYTES,
          source: 'github',
        };
      }

      return null;
    } catch (err) {
      if (err.statusCode === 404) return null;
      throw err;
    }
  },

  /**
   * Fetches pull request metadata required by readiness analysis.
   */
  async getPullRequest(owner, repo, pullRequestNumber) {
    logger.debug(`[GitHub] Fetching pull request ${owner}/${repo}#${pullRequestNumber}`);
    const { data } = await githubAxios.get(
      `/repos/${owner}/${repo}/pulls/${pullRequestNumber}`
    );

    if (
      !data ||
      !Number.isInteger(data.number) ||
      !data.html_url ||
      !data.state ||
      !data.base?.ref ||
      !data.base?.sha ||
      !data.head?.ref ||
      !data.head?.sha
    ) {
      throw new AppError(
        'GITHUB_RESPONSE_INVALID',
        'GitHub returned malformed pull request data.',
        502
      );
    }

    return {
      number: data.number,
      title: data.title || '',
      body: data.body || '',
      state: data.state,
      url: data.html_url,
      base: {
        ref: data.base.ref,
        sha: data.base.sha,
      },
      head: {
        ref: data.head.ref,
        sha: data.head.sha,
      },
    };
  },

  /**
   * Fetches all files changed by a pull request.
   */
  async getPullRequestFiles(owner, repo, pullRequestNumber) {
    return fetchPullRequestPages(
      owner,
      repo,
      pullRequestNumber,
      'files',
      (item) => ({
        filename: item.filename,
        status: item.status,
        additions: item.additions,
        deletions: item.deletions,
        changes: item.changes,
        patch: item.patch || null,
        previousFilename: item.previous_filename || null,
      })
    );
  },

  /**
   * Fetches all commits associated with a pull request.
   */
  async getPullRequestCommits(owner, repo, pullRequestNumber) {
    return fetchPullRequestPages(
      owner,
      repo,
      pullRequestNumber,
      'commits',
      (item) => ({
        sha: item.sha,
        message: item.commit?.message || '',
        author: item.author?.login || item.commit?.author?.name || null,
        committer: item.committer?.login || item.commit?.committer?.name || null,
      })
    );
  },
};

async function fetchPullRequestPages(owner, repo, pullRequestNumber, resource, mapItem) {
  const items = [];
  const perPage = 100;

  for (let page = 1; ; page += 1) {
    const { data } = await githubAxios.get(
      `/repos/${owner}/${repo}/pulls/${pullRequestNumber}/${resource}`,
      { params: { page, per_page: perPage } }
    );

    if (!Array.isArray(data)) {
      throw new AppError(
        'GITHUB_RESPONSE_INVALID',
        `GitHub returned malformed pull request ${resource} data.`,
        502
      );
    }

    const mappedItems = data.map(mapItem);
    if (mappedItems.some((item) => (
      resource === 'files' ? !item.filename : !item.sha
    ))) {
      throw new AppError(
        'GITHUB_RESPONSE_INVALID',
        `GitHub returned malformed pull request ${resource} data.`,
        502
      );
    }

    items.push(...mappedItems);
    if (data.length < perPage) return items;
  }
}
