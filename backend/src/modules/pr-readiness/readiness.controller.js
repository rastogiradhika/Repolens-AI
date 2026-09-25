import { readinessService } from './readiness.service.js';
import { evaluateReadinessSchema } from './readiness.schema.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';

export const readinessController = {
  async evaluate(req, res, next) {
    try {
      const validation = evaluateReadinessSchema.safeParse(req.body);
      if (!validation.success) {
        const message = validation.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new AppError(ErrorCodes.VALIDATION_ERROR, `Validation failed: ${message}`, 400);
      }

      const { repoUrl, prNumber, forceRefresh } = validation.data;
      const result = await readinessService.evaluatePullRequest({ repoUrl, prNumber, forceRefresh });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async analyzeSemantic(req, res, next) {
    try {
      const validation = evaluateReadinessSchema.safeParse(req.body);
      if (!validation.success) {
        const message = validation.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new AppError(ErrorCodes.VALIDATION_ERROR, `Validation failed: ${message}`, 400);
      }

      const { repoUrl, prNumber } = validation.data;
      const result = await readinessService.analyzeSemantic({ repoUrl, prNumber });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
