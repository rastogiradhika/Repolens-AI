import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.config.js';
import { cacheRepository } from '../../integrations/redis/cache.repository.js';
import { buildRioCacheKey } from '../../integrations/redis/cache.keys.js';
import { parseGitHubUrl } from '../../shared/utilities/url-parser.js';
import { AppError } from '../../shared/errors/app-error.js';
import { logger } from '../../config/logger.config.js';
import { dashboardResponseSchema } from './ai-guide.schema.js';
import { rieService } from '../repository-intelligence/rie.service.js';

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
    metadata: rio.metadata || {},
    analysisContext: {
      topLevelDirectories: rio.analysisContext?.topLevelDirectories || [],
      totalTreeFiles: rio.analysisContext?.totalTreeFiles || 0,
      filesFetched: rio.analysisContext?.filesFetched || 0,
    },
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
  const tools = tech.tools || tech.dependencies || [];
  const docs = sanitizedRio.documentation || {};
  const rules = sanitizedRio.contributionRules || {};
  const topDirs = sanitizedRio.analysisContext?.topLevelDirectories || [];

  const overview = docs.summary || meta.description || `${repository} is an open source repository maintained by ${owner}.`;
  const primaryLanguage = meta.primaryLanguage || 'Not detected';

  const repositoryStructure = topDirs.length > 0
    ? topDirs.map((dir) => ({
        folder: dir,
        description: `Contains ${dir} module assets and implementation source files.`,
      }))
    : [
        { folder: 'root', description: 'Repository root with configuration and documentation.' }
      ];

  const importantFiles = ['README.md'];
  if (primaryLanguage === 'JavaScript' || primaryLanguage === 'TypeScript') {
    importantFiles.push('package.json');
  } else if (primaryLanguage === 'Python') {
    importantFiles.push('requirements.txt');
  } else if (primaryLanguage === 'Rust') {
    importantFiles.push('Cargo.toml');
  } else if (primaryLanguage === 'Go') {
    importantFiles.push('go.mod');
  }
  if (rules.prTemplate) {
    importantFiles.push('.github/PULL_REQUEST_TEMPLATE.md');
  }

  const gettingStarted = docs.setupInstructions && docs.setupInstructions.length > 0
    ? docs.setupInstructions
    : [
        `Clone repository locally: git clone https://github.com/${owner}/${repository}.git`,
        'Inspect README.md for environment requirements and setup commands.',
        primaryLanguage.includes('Script')
          ? 'Run `npm install` (or project package manager) to install dependencies.'
          : 'Install the project dependencies according to the repository documentation.',
        'Run the local test suite to verify the development environment.',
      ];

  return {
    overview,
    primaryRole: `${repository} provides software capabilities built in ${primaryLanguage}.`,
    techStack: {
      frameworks: frameworks.length > 0 ? frameworks : ['Not detected'],
      dependencies: tools.length > 0 ? tools.slice(0, 10) : ['Not detected'],
      primaryLanguage,
    },
    repositoryStructure,
    importantFiles: importantFiles.slice(0, 5),
    gettingStarted,
    rules: {
      branchRules: rules.branchRules || ['Use descriptive feature branches (e.g. feat/feature-name)'],
      commitRules: rules.commitRules || ['Use clear, imperative commit messages'],
      pullRequestRules: rules.pullRequestRules || ['Ensure tests pass and PR checklist is filled'],
    },
    contributionGuidance: rules.prTemplate || 'Check existing issues, open a feature branch, and submit a PR with clear motivation.',
    beginnerTips: [
      'Read README.md carefully before making code changes.',
      'Always create a new branch rather than committing directly to main or master.',
      'Run tests and linters locally before submitting your pull request.',
    ],
    commonMistakes: [
      'Committing directly to the default branch without branching.',
      'Submitting changes without running local tests or checking build status.',
      'Opening pull requests with empty or incomplete descriptions.',
    ],
    beforeSubmitChecks: [
      'All local tests pass without errors.',
      'Branch is rebased or up-to-date with upstream target branch.',
      'PR template questions and checklists are completely filled.',
    ],
  };
}

function buildDashboardPrompt(sanitizedRio, validationError = null) {
  let prompt = `
You are RepoLens AI (Feature 1), an expert teacher and onboarding guide for beginner developers.
Your task is to analyze the actual Repository Intelligence Object (RIO) below and generate an onboarding guide in beginner-friendly language.

CRITICAL CONSTRAINTS:
1. Base your explanation STRICTLY on the supplied RIO data.
2. Do NOT invent libraries, frameworks, dependencies, folders, or rules that do not exist in the RIO.
3. If a section or rule is not detected in the RIO, clearly state "Not detected" or "Insufficient data".
4. Do NOT output Markdown code blocks. Return ONLY a single raw JSON object matching this schema:

{
  "overview": "A simple 2-3 sentence explanation of what this repository does in beginner terms.",
  "primaryRole": "A high-level explanation of how the project is structured and what its core architecture does.",
  "techStack": {
    "frameworks": ["React", "Express"],
    "dependencies": ["lodash", "axios"],
    "primaryLanguage": "JavaScript"
  },
  "repositoryStructure": [
    {
      "folder": "src",
      "description": "Contains core source code and application logic."
    }
  ],
  "importantFiles": ["README.md", "package.json"],
  "gettingStarted": [
    "Step 1: Clone the repository",
    "Step 2: Install dependencies",
    "Step 3: Run the development server"
  ],
  "rules": {
    "branchRules": ["feat/..., fix/..."],
    "commitRules": ["Conventional Commits format"],
    "pullRequestRules": ["Fill PR template"]
  },
  "contributionGuidance": "The exact git workflow and review expectations.",
  "beginnerTips": ["Tip 1", "Tip 2", "Tip 3"],
  "commonMistakes": ["Mistake 1", "Mistake 2", "Mistake 3"],
  "beforeSubmitChecks": ["Check 1", "Check 2"]
}

RIO DATA:
\`\`\`json
${JSON.stringify(sanitizedRio, null, 2)}
\`\`\`
`;

  if (validationError) {
    prompt += `\n\nCRITICAL FIX: Your previous response failed validation with: ${validationError}. Return valid JSON now!`;
  }

  return prompt;
}

export const aiGuideService = {
  /**
   * Generates a beginner-friendly dashboard JSON from real RIO.
   */
  async generateDashboard(repoUrl, commitSha, isRetry = false) {
    const { owner, repository } = parseGitHubUrl(repoUrl);

    logger.info(`[Feature 1] Processing repository intelligence for ${owner}/${repository}`);

    // 1. Process or retrieve RIO from Repository Intelligence Engine
    const rieResult = await rieService.processRepository(repoUrl, false);
    const rio = rieResult?.rio;

    if (!rio) {
      throw new AppError('Unable to generate repository intelligence for this repository.', 502);
    }

    // 2. Sanitize to prevent token bloat
    const sanitizedRio = sanitizeRioForAi(rio);

    // 3. If Gemini is available, call Gemini; otherwise deterministic fallback
    const client = getAiClient();
    if (!client) {
      logger.info(`[Feature 1] Gemini API key not configured — generating deterministic guide from RIO for ${owner}/${repository}`);
      return buildDeterministicGuide(sanitizedRio, owner, repository);
    }

    try {
      return await this._callGemini(owner, repository, sanitizedRio, false);
    } catch (err) {
      logger.warn(`[Feature 1] Gemini call failed, returning deterministic guide from RIO: ${err.message}`);
      return buildDeterministicGuide(sanitizedRio, owner, repository);
    }
  },

  async _callGemini(owner, repository, sanitizedRio, isRetry = false, validationError = null) {
    const prompt = buildDashboardPrompt(sanitizedRio, validationError);
    const client = getAiClient();

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let rawText = response.text.trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    try {
      const parsedJson = JSON.parse(rawText);
      return dashboardResponseSchema.parse(parsedJson);
    } catch (parseErr) {
      if (!isRetry) {
        logger.warn(`[Feature 1] Retrying Gemini output repair: ${parseErr.message}`);
        return this._callGemini(owner, repository, sanitizedRio, true, parseErr.message);
      }
      return buildDeterministicGuide(sanitizedRio, owner, repository);
    }
  },
};
