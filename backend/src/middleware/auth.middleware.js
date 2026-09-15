import { tokenService } from '../modules/auth/token.service.js';
import { AppError } from '../shared/errors/app-error.js';
import { prisma } from '../database/prisma.client.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('AUTH_MISSING_TOKEN', 'Authentication required. Please provide a Bearer token.', 401);
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = tokenService.verifyToken(token);
      
      // Verify user still exists in DB
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, isActive: true }
      });

      if (!user) {
        throw new AppError('AUTH_USER_NOT_FOUND', 'User no longer exists', 401);
      }
      
      if (!user.isActive) {
        throw new AppError('AUTH_USER_DISABLED', 'User account is disabled', 403);
      }

      req.user = user;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('AUTH_TOKEN_EXPIRED', 'Token has expired', 401);
      }
      throw new AppError('AUTH_INVALID_TOKEN', 'Invalid token', 401);
    }
  } catch (error) {
    next(error);
  }
};
