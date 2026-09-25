import { authService } from './auth.service.js';
import { authSchema } from './auth.schema.js';
import { buildSuccessResponse } from '../../shared/errors/error-response.js';

export const authController = {
  async register(req, res, next) {
    try {
      const validatedData = authSchema.register.parse(req.body);
      const result = await authService.register(
        validatedData.email,
        validatedData.password,
        validatedData.name
      );
      
      res.status(201).json(buildSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const validatedData = authSchema.login.parse(req.body);
      const result = await authService.login(
        validatedData.email,
        validatedData.password
      );
      
      res.status(200).json(buildSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }
};
