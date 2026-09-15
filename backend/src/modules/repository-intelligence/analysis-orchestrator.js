import { validateRepository } from './repository-validator.js';
import { githubClient } from '../../integrations/github/github.client.js';
import { scanRepositoryTree } from './repository-scanner.js';
import { fetchSelectedFiles } from './selected-file-fetcher.js';
import { rioBuilder } from './rio-builder.js';
import { logger } from '../../config/logger.config.js';
import { withTimeout } from '../../shared/utilities/async-timeout.js';
import { CONSTANTS } from '../../config/constants.config.js';

/**
 * Orchestrates the full analysis pipeline.
 */
export async function analyzeRepository(repositoryUrl, requestedCommitSha = null) {
  return withTimeout(
    executePipeline(repositoryUrl, requestedCommitSha),
    CONSTANTS.ANALYSIS_TIMEOUT_MS
  );
}

async function executePipeline(repositoryUrl, requestedCommitSha) {
  // Step 1: Validate & Fetch Metadata
  const { parsed, metadata } = await validateRepository(repositoryUrl);
  const { owner, repository } = parsed;

  logger.info(`[Orchestrator] Starting analysis pipeline for ${owner}/${repository}`);

  // Step 2: Get Latest Commit SHA
  const commitSha = requestedCommitSha || await githubClient.getLatestCommitSha(
    owner,
    repository,
    metadata.defaultBranch
  );

  // Step 3: Fetch Repository Tree
  const treeItems = await githubClient.getRepositoryTree(owner, repository, commitSha);

  // Step 4: Scan and Filter Tree
  const scannerResult = scanRepositoryTree(treeItems);

  // Step 5: Fetch Selected Files
  const { files } = await fetchSelectedFiles(owner, repository, scannerResult.selectedFiles, commitSha);

  // Step 6: Build RIO
  const rio = rioBuilder.build(metadata, files, scannerResult);
  
  // Attach the commit SHA for reference
  rio.analysisContext.commitSha = commitSha;

  logger.info(`[Orchestrator] Successfully completed analysis for ${owner}/${repository}`);
  
  return rio;
}
