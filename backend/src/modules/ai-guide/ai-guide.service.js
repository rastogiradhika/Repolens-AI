import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.config.js';
import { cacheRepository } from '../../integrations/redis/cache.repository.js';
import { buildRioCacheKey } from '../../integrations/redis/cache.keys.js';
import { parseGitHubUrl } from '../../shared/utilities/url-parser.js';
import { AppError } from '../../shared/errors/app-error.js';
import { logger } from '../../config/logger.config.js';
import { dashboardResponseSchema } from './ai-guide.schema.js';

let aiClient = null;

function getAiClient() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new AppError('AI_CONFIG_ERROR', 'Gemini API key is not configured', 500);
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

/**
 * Strips the RIO down to only what is necessary for Feature 1.
 * Prevents sending the entire repository to Gemini (Requirement 4).
 */
function sanitizeRioForAi(rio) {
  return {
    metadata: rio.metadata,
    techStack: rio.techStack,
    documentation: rio.documentation,
    contributionRules: rio.contributionRules,
    commands: rio.commands,
    // We intentionally omit raw file contents to save tokens
  };
}

function buildDashboardPrompt(sanitizedRio, validationError = null) {
  let prompt = `
You are RepoLens AI (Feature 1), an expert teacher for beginner developers.
Your task is to read the deterministic Repository Intelligence Object (RIO) below and explain it.
Do NOT invent commands or dependencies that are not in the RIO. Your job is explanation, not calculation.

RIO DATA:
\`\`\`json
${JSON.stringify(sanitizedRio, null, 2)}
\`\`\`

You MUST strictly return a JSON object with EXACTLY the following keys. Do NOT include Markdown formatting like \`\`\`json. Return ONLY raw, valid JSON.

{
  "overview": "A simple 2-3 sentence explanation of what this repository does.",
  "techStack": ["React", "Node.js"], // List of core technologies and what they are used for here.
  "projectStructure": "A quick map of the most important folders in the repo and what is inside them.",
  "beginnerTips": ["Tip 1", "Tip 2"], // 2-3 encouraging tips or 'gotchas' specifically for beginners looking at this code.
  "gettingStarted": "Step-by-step instructions on how a beginner should set this project up on their local machine.",
  "importantFiles": ["src/index.js", "README.md"], // A list of exactly 3-5 critical files the developer should look at first.
  "contributionGuidance": "The exact git workflow (branch naming, commit style) they should use to make a PR."
}
`;

  if (validationError) {
    prompt += `\n\nCRITICAL INSTRUCTION: Your previous response failed JSON validation with the following error:\n${validationError}\n\nYou MUST fix this error and ensure the output is strictly valid JSON matching the exact schema above. DO NOT wrap the output in markdown blocks.`;
  }

  return prompt;
}

export const aiGuideService = {
  /**
   * Generates a beginner-friendly dashboard JSON from the RIO.
   * Includes strict JSON validation and 1 Retry mechanism.
   */
  async generateDashboard(repoUrl, commitSha, isRetry = false) {
    const { owner, repository } = parseGitHubUrl(repoUrl);
    
    // 1. Fetch RIO from Cache
    const cacheKey = buildRioCacheKey(owner, repository, commitSha);
    const cached = await cacheRepository.get(cacheKey);
    
    if (!cached || !cached.rio) {
      throw new AppError(
        'RIO_NOT_FOUND', 
        'Repository has not been analyzed or cache expired. Please run RIE analysis first.',
        400
      );
    }
    
    // 2. Sanitize to prevent token bloat
    const sanitizedRio = sanitizeRioForAi(cached.rio);
    
    return await this._callGemini(owner, repository, sanitizedRio, false);
  },

  async _callGemini(owner, repository, sanitizedRio, isRetry = false, validationError = null) {
    const prompt = buildDashboardPrompt(sanitizedRio, validationError);
    
    try {
      const client = getAiClient();
      logger.info(`[Feature 1] Sending prompt to Gemini for ${owner}/${repository} (Retry: ${isRetry})`);
      
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      let rawText = response.text.trim();
      
      // Clean up potential markdown wrapping just in case
      if (rawText.startsWith('\`\`\`json')) {
        rawText = rawText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
      }
      
      // 3. Parse and Validate
      const parsedJson = JSON.parse(rawText);
      const validatedDashboard = dashboardResponseSchema.parse(parsedJson);
      
      return validatedDashboard;
      
    } catch (error) {
      if (!isRetry) {
        logger.warn(`[Feature 1] Validation/Generation failed. Initiating retry... Error: ${error.message}`);
        // Retry exactly once with stronger instructions
        return await this._callGemini(owner, repository, sanitizedRio, true, error.message);
      }
      
      logger.error('[Feature 1] Gemini API Error / Validation failed on Retry', { error: error.message });
      // Throw controlled backend error on second failure
      throw new AppError('AI_DASHBOARD_FAILED', 'Failed to generate a valid AI Dashboard after retries.', 502);
    }
  }
};
