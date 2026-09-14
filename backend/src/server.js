import { env } from './config/env.config.js';
import { logger } from './config/logger.config.js';
import { connectRedis, disconnectRedis } from './integrations/redis/redis.client.js';
import app from './app.js';

let server;

async function startServer() {
  try {
    // 1. Connect to Redis (non-blocking if it fails, handles gracefully)
    await connectRedis();

    // 2. Start Express
    server = app.listen(env.PORT, () => {
      logger.info(`[Server] RepoLens Backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // 3. Handle graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`\n[Server] Received ${signal}. Shutting down gracefully...`);
      if (server) {
        server.close(async () => {
          logger.info('[Server] HTTP server closed');
          await disconnectRedis();
          process.exit(0);
        });
      } else {
        await disconnectRedis();
        process.exit(0);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (err) {
    logger.error('[Server] Failed to start', { message: err.message, stack: err.stack });
    process.exit(1);
  }
}

startServer();
