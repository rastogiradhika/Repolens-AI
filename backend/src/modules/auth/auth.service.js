import { prisma } from '../../database/prisma.client.js';
import { passwordService } from './password.service.js';
import { tokenService } from './token.service.js';
import { AppError } from '../../shared/errors/app-error.js';

export const authService = {
  async register(email, password, name) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('AUTH_EMAIL_EXISTS', 'Email is already registered', 400);
    }

    // Hash password
    const hashedPassword = await passwordService.hash(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // Generate token
    const token = tokenService.generateToken(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  },

  async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new AppError('AUTH_INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const isPasswordValid = await passwordService.verify(password, user.password);
    
    if (!isPasswordValid) {
      throw new AppError('AUTH_INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const token = tokenService.generateToken(user);
    
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }
};
