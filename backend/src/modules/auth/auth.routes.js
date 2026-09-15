import { Router } from 'express';
import { authController } from './auth.controller.js';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', authController.register);

// POST /api/v1/auth/login
router.post('/login', authController.login);

export default router;
