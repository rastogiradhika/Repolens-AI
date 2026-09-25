import { buildErrorResponse } from '../shared/errors/error-response.js';
import { logger } from '../config/logger.config.js';
import { ErrorCodes } from '../shared/errors/error-codes.js';

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || ErrorCodes.INTERNAL_ERROR;
  const message = err.isOperational ? err.message : 'An unexpected error occurred.';
  const details = err.details || null;

  if (!err.isOperational || statusCode >= 500) {
    logger.error('Unhandled/Server Error', {
      error: err.message,
      stack: err.stack,
      url: req.originalUrl,
      requestId: req.id,
    });
  } else {
    logger.warn('Operational Error', {
      error: err.message,
      code: err.code,
      url: req.originalUrl,
      requestId: req.id,
    });
  }

  res.status(statusCode).json(buildErrorResponse(code, message, details));
}
