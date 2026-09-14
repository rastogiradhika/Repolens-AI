import 'dotenv/config';
import { AppError } from '../shared/errors/app-error.js';

const REQUIRED_VARS = ['GITHUB_TOKEN'];

// Validate required environment variables on startup
for (const varName of REQUIRED_VARS) {
  if (!process.env[varName]) {
    console.error(`[Config] FATAL: Missing required environment variable: ${varName}`);
    console.error('[Config] Please create a .env file based on .env.example');
    process.exit(1);
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
};
