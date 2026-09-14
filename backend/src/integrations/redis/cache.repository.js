import { getRedisClient, isRedisConnected } from './redis.client.js';
import { CONSTANTS } from '../../config/constants.config.js';
import { logger } from '../../config/logger.config.js';

export const cacheRepository = {
  async get(key) {
    if (!isRedisConnected()) {
      logger.warn('[Cache] Redis not connected — skipping cache read');
      return null;
    }
    try {
      const client = getRedisClient();
      const raw = await client.get(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      logger.error('[Cache] Failed to read from cache', { key, message: err.message });
      return null;
    }
  },

  async set(key, value, ttlSeconds = CONSTANTS.CACHE_TTL_SECONDS) {
    if (!isRedisConnected()) {
      logger.warn('[Cache] Redis not connected — skipping cache write');
      return false;
    }
    try {
      const client = getRedisClient();
      const payload = JSON.stringify({
        rio: value,
        cachedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
      });
      await client.setex(key, ttlSeconds, payload);
      logger.debug('[Cache] Stored RIO in cache', { key, ttlSeconds });
      return true;
    } catch (err) {
      logger.error('[Cache] Failed to write to cache', { key, message: err.message });
      return false;
    }
  },

  async delete(key) {
    if (!isRedisConnected()) return false;
    try {
      const client = getRedisClient();
      await client.del(key);
      return true;
    } catch (err) {
      logger.error('[Cache] Failed to delete key', { key, message: err.message });
      return false;
    }
  },
};
