import { riskService } from './risk.service.js';
import { evaluateRiskSchema } from './risk.schema.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';

export const riskController = {
  async analyze(req, res, next) {
    try {
      const validation = evaluateRiskSchema.safeParse(req.body);
      if (!validation.success) {
        const message = validation.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new AppError(ErrorCodes.VALIDATION_ERROR, `Validation failed: ${message}`, 400);
      }

      const { repoUrl, prNumber, targetBranch, forceRefresh } = validation.data;
      const result = await riskService.evaluateMergeRisk({ repoUrl, prNumber, targetBranch, forceRefresh });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
};
