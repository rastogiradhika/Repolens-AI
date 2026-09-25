import 'dotenv/config';

export const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  REDIS_URL: process.env.REDIS_URL || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '1b1b08a7a17f51e55fb3913974b426f7e279e15149ba3eec2c65d3e88ee9b45c',
  SESSION_SECRET: process.env.SESSION_SECRET || '0b39f9f79d16b9a7b94478a8e57ed47518d800cd3bc4e8fa1d0d0a3996ae1560',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
};
