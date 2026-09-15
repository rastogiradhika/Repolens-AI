import { buildSuccessResponse } from '../../shared/errors/error-response.js';
import { readinessService } from './readiness.service.js';

export const readinessController = {
  async analyze(req, res, next) {
    try {
      const result = await readinessService.analyze(req.body);
      res.status(200).json(buildSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  },
};