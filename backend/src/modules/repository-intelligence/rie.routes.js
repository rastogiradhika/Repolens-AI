import { Router } from 'express';
import { rieController } from './rie.controller.js';
import { validateRioRequest } from '../../middleware/validation.middleware.js';
import { apiRateLimiter } from '../../middleware/rateLimiter.middleware.js';

const router = Router();

// POST /api/v1/rie/analyze
router.post(
  '/analyze',
  apiRateLimiter,       // Limit requests per IP
  validateRioRequest,   // Validate body (url)
  rieController.analyze // Handle request
);

export default router;
