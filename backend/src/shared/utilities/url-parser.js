import { AppError } from '../errors/app-error.js';

/**
 * Parses and normalizes a GitHub repository URL.
 * Returns { owner, repository, normalizedUrl }
 */
export function parseGitHubUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw AppError.invalidUrl('URL must be a non-empty string.');
  }

  let url;
  try {
    const withProtocol = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    url = new URL(withProtocol);
  } catch {
    throw AppError.invalidUrl(`"${rawUrl}" is not a valid URL.`);
  }

  if (url.hostname !== 'github.com') {
    throw AppError.invalidUrl(
      `Only GitHub repositories are supported. Received host: ${url.hostname}`
    );
  }

  // Remove .git suffix, trailing slashes, query params, hash
  let pathname = url.pathname
    .replace(/\.git$/, '')
    .replace(/\/+$/, '');

  const parts = pathname.split('/').filter(Boolean);

  if (parts.length < 2) {
    throw AppError.invalidUrl(
      'URL must include both owner and repository name, e.g. https://github.com/owner/repository'
    );
  }

  const owner = parts[0];
  const repository = parts[1];

  const slugRegex = /^[a-zA-Z0-9_.-]+$/;
  if (!slugRegex.test(owner)) {
    throw AppError.invalidUrl(`Invalid owner name: "${owner}"`);
  }
  if (!slugRegex.test(repository)) {
    throw AppError.invalidUrl(`Invalid repository name: "${repository}"`);
  }

  return {
    owner,
    repository,
    normalizedUrl: `https://github.com/${owner}/${repository}`,
  };
}
