import { rieService } from './rie.service.js';
import { buildSuccessResponse } from '../../shared/errors/error-response.js';
import { logger } from '../../config/logger.config.js';

export const rieController = {
  async analyze(req, res, next) {
    try {
      const { url, forceRefresh } = req.body;
      
      logger.info(`[Controller] Analyze request received for URL: ${url}`);
      
      const result = await rieService.processRepository(url, forceRefresh === true);
      
      res.status(200).json(buildSuccessResponse({
        repository: result.rio.metadata.fullName,
        source: result.source,
        cachedAt: result.cachedAt,
        rio: result.rio,
      }));
    } catch (error) {
      next(error); // Pass to global error handler
    }
  },
};
