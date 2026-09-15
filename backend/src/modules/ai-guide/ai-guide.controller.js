import { aiGuideService } from './ai-guide.service.js';
import { buildSuccessResponse } from '../../shared/errors/error-response.js';

export const aiGuideController = {
  async generate(req, res, next) {
    try {
      const { repoUrl, commitSha } = req.body;
      
      // Attempt to generate the AI Dashboard JSON (Feature 1)
      const dashboardJson = await aiGuideService.generateDashboard(repoUrl, commitSha);
      
      res.status(200).json(buildSuccessResponse({
        source: 'ai_dashboard',
        dashboard: dashboardJson
      }));
        
    } catch (error) {
      // Any error, including AI_DASHBOARD_FAILED from retries, 
      // will be caught here and sent to the global error handler.
      // We no longer return the raw RIO as a fallback to the frontend.
      next(error);
    }
  }
};
