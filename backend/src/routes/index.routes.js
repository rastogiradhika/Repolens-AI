import { Router } from 'express';
import rieRoutes from '../modules/repository-intelligence/rie.routes.js';
import aiGuideRoutes from '../modules/ai-guide/ai-guide.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';

const router = Router();

// Base health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'repolens-backend' });
});

// Mount modules
router.use('/v1/auth', authRoutes);
router.use('/v1/rie', rieRoutes);
router.use('/v1/ai-guide', aiGuideRoutes);

export default router;
