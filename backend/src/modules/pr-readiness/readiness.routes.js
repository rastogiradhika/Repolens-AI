import { Router } from 'express';
import { readinessController } from './readiness.controller.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.middleware.js';

const router = Router();

// POST /api/v1/pr-readiness/check
router.post('/check', apiRateLimiter, readinessController.evaluate);

// POST /api/v1/pr-readiness/semantic
router.post('/semantic', apiRateLimiter, readinessController.analyzeSemantic);

export default router;
