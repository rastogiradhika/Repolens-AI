import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.config.js';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Optional: Test connection function
export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('[Database] PostgreSQL connected via Prisma');
  } catch (error) {
    logger.error('[Database] Connection failed', error);
    process.exit(1);
  }
};
