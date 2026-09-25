import { Router } from 'express';
import rieRoutes from '../modules/repository-intelligence/rie.routes.js';
import aiGuideRoutes from '../modules/ai-guide/ai-guide.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import prReadinessRoutes from '../modules/pr-readiness/readiness.routes.js';
import mergeRiskRoutes from '../modules/merge-risk/risk.routes.js';

const router = Router();

// Base health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'repolens-backend' });
});

// Mount modules
router.use('/v1/auth', authRoutes);
router.use('/v1/rie', rieRoutes);
router.use('/v1/ai-guide', aiGuideRoutes);
router.use('/v1/pr-readiness', prReadinessRoutes);
router.use('/v1/merge-risk', mergeRiskRoutes);

export default router;


