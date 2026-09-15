import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('[FATAL] JWT_SECRET environment variable is not set. Add it to your .env file.');
}

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
