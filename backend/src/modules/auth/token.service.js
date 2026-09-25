import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'repolens-jwt-secret-session';

export const tokenService = {
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
  },

  verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }
};
