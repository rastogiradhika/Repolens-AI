import { Router } from 'express';
import rieRoutes from '../modules/repository-intelligence/rie.routes.js';

const router = Router();

// Base health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'repolens-backend' });
});

// Mount modules
router.use('/v1/rie', rieRoutes);

export default router;
