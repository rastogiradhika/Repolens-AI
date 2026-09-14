import Redis from 'ioredis';
import { env } from '../../config/env.config.js';
import { logger } from '../../config/logger.config.js';

let redisClient = null;
let isConnected = false;

export function getRedisClient() {
  if (redisClient) return redisClient;

  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 5000,
  });

  redisClient.on('connect', () => {
    isConnected = true;
    logger.info('[Redis] Connected successfully');
  });

  redisClient.on('error', (err) => {
    isConnected = false;
    logger.error('[Redis] Connection error', { message: err.message });
  });

  redisClient.on('close', () => {
    isConnected = false;
    logger.warn('[Redis] Connection closed');
  });

  return redisClient;
}

export function isRedisConnected() {
  return isConnected;
}

export async function connectRedis() {
  const client = getRedisClient();
  try {
    await client.connect();
  } catch (err) {
    logger.warn('[Redis] Could not connect — cache will be bypassed', { message: err.message });
  }
}

export async function disconnectRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    isConnected = false;
  }
}
