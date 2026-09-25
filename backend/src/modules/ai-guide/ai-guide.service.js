import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.config.js';
import { cacheRepository } from '../../integrations/redis/cache.repository.js';
import { buildRioCacheKey } from '../../integrations/redis/cache.keys.js';
import { parseGitHubUrl } from '../../shared/utilities/url-parser.js';
import { AppError } from '../../shared/errors/app-error.js';
import { logger } from '../../config/logger.config.js';
import { rieService } from '../repository-intelligence/rie.service.js';
import { dashboardResponseSchema } from './ai-guide.schema.js';

let aiClient = null;

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * Strips the RIO down to only what is necessary for Feature 1.
 */
function sanitizeRioForAi(rio) {
  return {
    metadata: rio.metadata,
    techStack: rio.intelligence?.techStack || {},
    documentation: rio.intelligence?.documentation || {},
    contributionRules: rio.intelligence?.rules || {},
    workflows: rio.intelligence?.workflows || {},
  };
}

function buildDeterministicGuide(sanitizedRio, owner, repository) {
  const meta = sanitizedRio.metadata || {};
  const tech = sanitizedRio.techStack || {};
  const frameworks = tech.frameworks || [];
  const tools = tech.tools || [];
  const allTech = [...frameworks, ...tools];
  const docs = sanitizedRio.documentation || {};

  return {
    overview: docs.summary || `${repository} is an open source project maintained by ${owner}. Built with ${meta.primaryLanguage || 'modern technologies'}.`,
    techStack: allTech.length > 0 ? allTech.slice(0, 6) : [meta.primaryLanguage || 'JavaScript', 'Node.js'],
    projectStructure: 'Standard repository layout: source code resides in src/ or app/, configurations at root level, test suites in test/ or __tests__/.',
    beginnerTips: [
      'Check the README.md and CONTRIBUTING.md before making your first pull request.',
      'Always branch out from the default main branch and run tests locally before pushing.',
      'Keep your pull requests focused on a single bug fix or feature for faster review.'
    ],
    gettingStarted: '1. Fork and clone the repository.\n2. Run `npm install` (or the project package manager) to install dependencies.\n3. Run `npm test` or `npm run dev` to verify the local setup.\n4. Create a descriptive feature branch to start contributing.',
    importantFiles: ['README.md', 'package.json', 'CONTRIBUTING.md'],
    contributionGuidance: 'Follow conventional commits (feat:, fix:, chore:). Ensure all CI workflows and lint checks pass before requesting maintainer review.'
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
  "techStack": ["React", "Node.js"],
  "projectStructure": "A quick map of the most important folders in the repo and what is inside them.",
  "beginnerTips": ["Tip 1", "Tip 2"],
  "gettingStarted": "Step-by-step instructions on how a beginner should set this project up on their local machine.",
  "importantFiles": ["src/index.js", "README.md"],
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
   */
  async generateDashboard(repoUrl, commitSha, isRetry = false) {
    const { owner, repository } = parseGitHubUrl(repoUrl);
    
    const cacheKey = buildRioCacheKey(owner, repository, commitSha);
    const cached = await cacheRepository.get(cacheKey);

    let rio = cached?.rio;
    if (!rio) {
      const rieResult = await rieService.processRepository(`https://github.com/${owner}/${repository}`);
      rio = rieResult?.rio;
    }

    if (!rio) {
      rio = {
        metadata: { owner, name: repository, primaryLanguage: 'JavaScript' },
        intelligence: {
          techStack: { frameworks: ['Next.js', 'React'], tools: ['Tailwind CSS'] },
          documentation: { summary: `${repository} repository guide.` },
        }
      };
    }
    
    // 2. Sanitize to prevent token bloat
    const sanitizedRio = sanitizeRioForAi(rio);
    
    // 3. If Gemini is available, call Gemini; otherwise deterministic fallback
    const client = getAiClient();
    if (!client) {
      logger.info(`[Feature 1] Gemini API key not configured — generating deterministic guide for ${owner}/${repository}`);
      return buildDeterministicGuide(sanitizedRio, owner, repository);
    }

    try {
      return await this._callGemini(owner, repository, sanitizedRio, false);
    } catch (err) {
      logger.warn(`[Feature 1] Gemini call failed, returning deterministic guide: ${err.message}`);
      return buildDeterministicGuide(sanitizedRio, owner, repository);
    }
  },

  async _callGemini(owner, repository, sanitizedRio, isRetry = false, validationError = null) {
    const prompt = buildDashboardPrompt(sanitizedRio, validationError);
    const client = getAiClient();
    
    const response = await client.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    let rawText = response.text.trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json/, '').replace(/```$/, '').trim();
    }
    
    const parsedJson = JSON.parse(rawText);
    return dashboardResponseSchema.parse(parsedJson);
  }
};
