import { z } from 'zod';
import { AppError } from '../shared/errors/app-error.js';
import { ErrorCodes } from '../shared/errors/error-codes.js';

const analyzeRequestSchema = z.object({
  url: z.string().url('Must be a valid URL').includes('github.com', { message: 'Must be a GitHub URL' }),
  forceRefresh: z.boolean().optional(),
});

export function validateRioRequest(req, res, next) {
  try {
    const validated = analyzeRequestSchema.parse(req.body);
    req.body = validated; // replace with sanitized/parsed values
    next();
  } catch (err) {
    const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    next(new AppError(ErrorCodes.VALIDATION_ERROR, `Validation failed: ${message}`, 400));
  }
}
