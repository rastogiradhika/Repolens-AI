import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';

export const GitHubErrors = {
  fromAxiosError(error) {
    if (!error.response) {
      // Network error or timeout
      return new AppError(
        ErrorCodes.GITHUB_UNAVAILABLE,
        'Could not reach the GitHub API. Please check your connection.',
        503
      );
    }

    const { status, data } = error.response;
    const message = data?.message || '';

    switch (status) {
      case 401:
        return new AppError(
          ErrorCodes.GITHUB_API_ERROR,
          'GitHub token is invalid or missing. Please check GITHUB_TOKEN in your .env file.',
          401
        );
      case 403:
        if (message.toLowerCase().includes('rate limit')) {
          return AppError.rateLimited();
        }
        return AppError.privateRepository('unknown', 'unknown');

      case 404:
        return new AppError(
          ErrorCodes.REPOSITORY_NOT_FOUND,
          'Repository not found or is private.',
          404
        );

      case 422:
        return AppError.treeTooLarge();

      case 429:
        return AppError.rateLimited();

      default:
        return new AppError(
          ErrorCodes.GITHUB_API_ERROR,
          `GitHub API returned status ${status}: ${message}`,
          502
        );
    }
  },
};
