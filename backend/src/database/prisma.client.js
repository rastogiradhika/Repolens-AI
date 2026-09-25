import { logger } from '../config/logger.config.js';

// Global in-memory user database singleton
const globalStore = globalThis;
if (!globalStore.__repolens_users) {
  globalStore.__repolens_users = new Map();
}
const users = globalStore.__repolens_users;

let nextId = users.size + 1;

export const prisma = {
  user: {
    findUnique: async ({ where }) => {
      if (where.email) {
        for (const u of users.values()) {
          if (u.email.toLowerCase() === where.email.toLowerCase()) return { ...u };
        }
      }
      if (where.id) {
        return users.get(where.id) ? { ...users.get(where.id) } : null;
      }
      return null;
    },
    create: async ({ data }) => {
      const id = String(nextId++);
      const newUser = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.set(id, newUser);
      return { ...newUser };
    },
    findMany: async () => Array.from(users.values()),
  },
  $connect: async () => {
    logger.info('[Database] Using global in-memory database');
  },
  $disconnect: async () => {},
};

export const connectToDatabase = async () => {
  logger.info('[Database] Global in-memory database ready');
};
