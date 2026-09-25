import { githubClient } from '../../integrations/github/github.client.js';
import { GoogleGenAI } from '@google/genai';
import { cacheRepository } from '../../integrations/redis/cache.repository.js';
import { rieService } from '../repository-intelligence/rie.service.js';
import { readinessRules } from './readiness-rules.js';
import { scoreCalculator } from './score-calculator.js';
import { suggestionBuilder } from './suggestion-builder.js';
import { logger } from '../../config/logger.config.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCodes } from '../../shared/errors/error-codes.js';

export const readinessService = {
  async evaluatePullRequest({ repoUrl, prNumber, forceRefresh = false }) {
    const parsed = parseRepoUrl(repoUrl);
    const { owner, repo } = parsed;

    logger.info(`[PR Readiness] Evaluating PR #${prNumber} for ${owner}/${repo}`);

    // Fetch PR metadata first to get headSha for cache key
    const pr = await githubClient.getPullRequest(owner, repo, prNumber);
    const cacheKey = `repolens:readiness:${owner}:${repo}:${prNumber}:${pr.headSha || 'latest'}`;

    if (!forceRefresh) {
      const cached = await cacheRepository.get(cacheKey);
      if (cached) {
        logger.info(`[PR Readiness] Cache hit for PR #${prNumber}`);
        return { ...cached, source: 'cache' };
      }
    }

    // Fetch changed files, commits, and repository RIO concurrently
    const [files, commits, rieResult] = await Promise.all([
      githubClient.getPullRequestFiles(owner, repo, prNumber),
      githubClient.getPullRequestCommits(owner, repo, prNumber),
      rieService.processRepository(`https://github.com/${owner}/${repo}`, forceRefresh),
    ]);

    const rio = rieResult?.rio;

    // Run deterministic rules
    const checks = readinessRules.evaluateAll({ pr, files, commits, rio });
    const score = scoreCalculator.calculate(checks);
    const suggestions = suggestionBuilder.build(checks);

      const applicableChecks = checks.filter((c) => c.status !== 'NOT_APPLICABLE');
      const isNeedsReview = applicableChecks.length === 0;
      const verdict = isNeedsReview
        ? 'NEEDS_REVIEW'
        : score >= 80
        ? 'READY'
        : score >= 50
        ? 'NEEDS_ATTENTION'
        : 'NOT_READY';

      const result = {
        pr: {
          number: pr.number,
          title: pr.title,
          body: pr.body,
          state: pr.state,
          author: pr.author,
          baseBranch: pr.baseBranch,
          headBranch: pr.headBranch,
          baseSha: pr.baseSha,
          headSha: pr.headSha,
          additions: pr.additions,
          deletions: pr.deletions,
          changedFilesCount: files.length,
          url: pr.url,
        },
        repository: {
          owner,
          name: repo,
          url: `https://github.com/${owner}/${repo}`,
        },
        score: isNeedsReview ? 0 : score,
        verdict,
        checks,
        suggestions,
        changedFiles: files.map((f) => ({
          filename: f.filename,
          status: f.status,
          changes: f.changes,
        })),
        evaluatedAt: new Date().toISOString(),
      };

    // Cache result
    await cacheRepository.set(cacheKey, result, 3600);

    return { ...result, source: 'evaluation' };
  },

  async analyzeSemantic({ repoUrl, prNumber }) {
    const parsed = parseRepoUrl(repoUrl);
    const { owner, repo } = parsed;

    logger.info(`[PR Readiness] Semantic Analysis for PR #${prNumber} of ${owner}/${repo}`);

    const [pr, files, commits] = await Promise.all([
      githubClient.getPullRequest(owner, repo, prNumber),
      githubClient.getPullRequestFiles(owner, repo, prNumber),
      githubClient.getPullRequestCommits(owner, repo, prNumber),
    ]);

    const apiKey = process.env.GEMINI_API_KEY;
       if (!apiKey) {
      throw new AppError(
        ErrorCodes.ANALYSIS_FAILED,
        'Semantic analysis is unavailable: GEMINI_API_KEY is not configured on the server.',
        503
      );
    }

    const aiClient = new GoogleGenAI({ apiKey });
    const prompt = `
You are an expert Senior Software Engineer performing a semantic review of a Pull Request.
Analyze the following Pull Request details and provide a semantic readiness assessment.
Respond EXACTLY in JSON format matching this schema:
{
  "changeIntent": "string (Short badge like 'Feature', 'Bugfix', 'Refactor', 'Chore')",
  "behavioralImpact": "string (1-2 sentences summarizing what this actually changes functionally)",
  "riskSignals": ["string", "string"],
  "reviewFocus": ["string", "string"]
}

PR Title: ${pr.title}
PR Body: ${pr.body || 'No description provided'}
Changed Files: ${files.map(f => f.filename).join(', ')}
Commits: ${commits.map(c => c.message).join(' | ')}
    `;

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      let rawText = response.text.trim();
      if (rawText.startsWith('\`\`\`json')) {
        rawText = rawText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
      }
      return JSON.parse(rawText);
    } catch (error) {
           logger.error(`[PR Readiness] Semantic analysis failed: ${error?.message || 'unknown error'}`);
      throw new AppError(
        ErrorCodes.ANALYSIS_FAILED,
        'Semantic analysis is currently unavailable. The AI provider request failed.',
        502
      );
    }
  },
};

function parseRepoUrl(url) {
  try {
    const cleaned = url.replace(/\.git$/, '').trim();
    const match = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    const parts = cleaned.split('/');
    if (parts.length >= 2) {
      return { owner: parts[parts.length - 2], repo: parts[parts.length - 1] };
    }
    throw new Error('Invalid GitHub URL');
  } catch (err) {
    throw new Error('Please provide a valid GitHub repository URL (e.g. https://github.com/owner/repo)');
  }
}
