import { AppError } from '../errors/app-error.js';

/**
 * Wraps a promise with a timeout.
 * Rejects with AppError.analysisTimeout() if promise doesn't resolve in time.
 */
export function withTimeout(promise, ms, errorFactory = null) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => {
      reject(errorFactory ? errorFactory() : AppError.analysisTimeout());
    }, ms)
  );
  return Promise.race([promise, timeout]);
}
