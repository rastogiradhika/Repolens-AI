import { logger } from '../../config/logger.config.js';

// MOCKED — in-memory cache, persists during active process
const store = new Map();

const mockRedis = {
  get: async (k) => store.get(k) ?? null,
  set: async (k, v) => { store.set(k, v); return 'OK'; },
  setex: async (k, ttlSeconds, v) => {
    store.set(k, v);
    return 'OK';
  },
  del: async (k) => { store.delete(k); return 1; },
  incr: async (k) => {
    const n = (store.get(k) || 0) + 1;
    store.set(k, n);
    return n;
  },
  quit: async () => 'OK',
  connect: async () => {},
  on: () => {},
};

export function getRedisClient() {
  return mockRedis;
}

export function isRedisConnected() {
  return true;
}

export async function connectRedis() {
  logger.info('[Redis] In-memory cache client initialized');
}

export async function disconnectRedis() {
  store.clear();
}
