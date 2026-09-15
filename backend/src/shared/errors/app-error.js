import { ErrorCodes } from './error-codes.js';

export class AppError extends Error {
  constructor(code, message, statusCode = 500, details = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static invalidUrl(message = 'Please provide a valid public GitHub repository URL.') {
    return new AppError(ErrorCodes.INVALID_REPOSITORY_URL, message, 400);
  }

  static repositoryNotFound(owner, repo) {
    return new AppError(
      ErrorCodes.REPOSITORY_NOT_FOUND,
      `Repository ${owner}/${repo} was not found or is not accessible.`,
      404
    );
  }

  static privateRepository(owner, repo) {
    return new AppError(
      ErrorCodes.PRIVATE_REPOSITORY,
      `Repository ${owner}/${repo} is private. RepoLens only supports public repositories.`,
      403
    );
  }

  static rateLimited() {
    return new AppError(
      ErrorCodes.GITHUB_RATE_LIMITED,
      'GitHub API rate limit exceeded. Please try again later.',
      429
    );
  }

  static analysisTimeout() {
    return new AppError(
      ErrorCodes.ANALYSIS_TIMEOUT,
      'Repository analysis timed out. The repository may be too large.',
      408
    );
  }

  static rioValidationFailed(details = null) {
    return new AppError(
      ErrorCodes.RIO_VALIDATION_FAILED,
      'Generated repository intelligence object failed validation.',
      500,
      details
    );
  }

  static treeTooLarge() {
    return new AppError(
      ErrorCodes.TREE_TOO_LARGE,
      'Repository file tree is too large to analyze.',
      422
    );
  }

  static pullRequestNotFound(owner, repo, number) {
    return new AppError(
      ErrorCodes.PULL_REQUEST_NOT_FOUND,
      `Pull request ${owner}/${repo}#${number} was not found or is not accessible.`,
      404
    );
  }

  static readinessValidationFailed(details = null) {
    return new AppError(
      ErrorCodes.READINESS_VALIDATION_FAILED,
      'Generated pull request readiness result failed validation.',
      500,
      details
    );
  }

  static rioUnavailable() {
    return new AppError(
      ErrorCodes.RIO_UNAVAILABLE,
      'Repository intelligence is unavailable for the pull request base commit.',
      422
    );
  }
}
