import rateLimit from 'express-rate-limit';
import { CONSTANTS } from '../config/constants.config.js';
import { AppError } from '../shared/errors/app-error.js';
import { ErrorCodes } from '../shared/errors/error-codes.js';

export const apiRateLimiter = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT_WINDOW_MS,
  max: CONSTANTS.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError(
      ErrorCodes.RATE_LIMITED,
      'Too many analysis requests from this IP, please try again after a minute.',
      429
    ));
  },
});
