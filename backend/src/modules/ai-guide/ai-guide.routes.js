import { Router } from 'express';
import { aiGuideController } from './ai-guide.controller.js';

const router = Router();

// POST /api/v1/ai-guide/generate
// Body: { repoUrl: "...", commitSha: "..." }
router.post('/generate', aiGuideController.generate);

export default router;
