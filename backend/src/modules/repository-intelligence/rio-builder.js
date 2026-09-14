import { documentationExtractor } from './extractors/documentation.extractor.js';
import { rulesExtractor } from './extractors/rules.extractor.js';
import { techStackExtractor } from './extractors/tech-stack.extractor.js';
import { workflowsExtractor } from './extractors/workflows.extractor.js';

/**
 * RIO Builder
 * Orchestrates all extractors and structures the final Repository Intelligence Object.
 */
export const rioBuilder = {
  build(metadata, fetchedFiles, scannerResult) {
    const extractors = [
      documentationExtractor,
      rulesExtractor,
      techStackExtractor,
      workflowsExtractor,
    ];

    const intelligence = {};

    for (const extractor of extractors) {
      try {
        intelligence[extractor.name] = extractor.run(fetchedFiles, metadata);
      } catch (err) {
        // Fallback for individual extractor failures to not fail entire analysis
        intelligence[extractor.name] = { error: err.message };
      }
    }

    // Construct the final RIO
    return {
      metadata: {
        owner: metadata.owner,
        name: metadata.name,
        fullName: metadata.fullName,
        description: metadata.description,
        primaryLanguage: metadata.primaryLanguage,
        stars: metadata.stars,
        isFork: metadata.isFork,
        url: metadata.url,
      },
      analysisContext: {
        analyzedAt: new Date().toISOString(),
        totalTreeFiles: scannerResult.totalTreeSize,
        filesFetched: fetchedFiles.length,
        topLevelDirectories: scannerResult.topLevelDirectories,
      },
      intelligence,
    };
  }
};
