import { Router } from 'express';
import { apiRateLimiter } from '../../middleware/rateLimiter.middleware.js';
import { readinessController } from './readiness.controller.js';
import { validateReadinessRequest } from './readiness.schema.js';

const router = Router();

router.post(
  '/analyze',
  apiRateLimiter,
  validateReadinessRequest,
  readinessController.analyze
);

export default router;