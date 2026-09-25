import { Router } from 'express';
import { riskController } from './risk.controller.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.middleware.js';

const router = Router();

// POST /api/v1/merge-risk/analyze
router.post('/analyze', apiRateLimiter, riskController.analyze);

export default router;
