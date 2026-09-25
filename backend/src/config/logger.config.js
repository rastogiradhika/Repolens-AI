import { env } from './env.config.js';

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = env.isDevelopment ? LEVELS.debug : LEVELS.info;

function formatMessage(level, message, meta = null) {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] ${message}`;
  if (meta && env.isDevelopment) {
    return `${base} ${JSON.stringify(meta, null, 0)}`;
  }
  return base;
}

export const logger = {
  error(message, meta = null) {
    if (currentLevel >= LEVELS.error) {
      // Never log token or password values
      const safeMeta = sanitizeMeta(meta);
      console.error(formatMessage('error', message, safeMeta));
    }
  },
  warn(message, meta = null) {
    if (currentLevel >= LEVELS.warn) {
      console.warn(formatMessage('warn', message, sanitizeMeta(meta)));
    }
  },
  info(message, meta = null) {
    if (currentLevel >= LEVELS.info) {
      console.info(formatMessage('info', message, sanitizeMeta(meta)));
    }
  },
  debug(message, meta = null) {
    if (currentLevel >= LEVELS.debug) {
      console.log(formatMessage('debug', message, sanitizeMeta(meta)));
    }
  },
};

function sanitizeMeta(meta) {
  if (!meta || typeof meta !== 'object') return meta;
  const FORBIDDEN_KEYS = ['token', 'password', 'secret', 'authorization', 'key', 'GITHUB_TOKEN'];
  const sanitized = { ...meta };
  for (const key of FORBIDDEN_KEYS) {
    if (key in sanitized) {
      sanitized[key] = '[REDACTED]';
    }
  }
  return sanitized;
}
