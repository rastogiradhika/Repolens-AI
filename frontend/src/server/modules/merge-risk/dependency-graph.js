/**
 * Dependency Graph & Semantic Coupling Analyzer
 * Traces import and interface dependencies among touched files.
 */
export const dependencyGraph = {
  analyze({ files, rio }) {
    const criticalCouplings = [];

    const changedPaths = (files || []).map((f) => f.filename);

    for (const file of changedPaths) {
      const lower = file.toLowerCase();

      // If package manifest changed, flags global dependency ripple
      if (lower.endsWith('package.json') || lower.endsWith('requirements.txt')) {
        criticalCouplings.push({
          source: file,
          target: 'Global Runtime Dependencies',
          type: 'DEPENDENCY_MANIFEST_CHANGE',
          severity: 'HIGH',
          description: 'Package dependencies modified; all modules relying on updated packages may be affected.',
        });
      }

      // If database schema changed
      if (lower.includes('schema.prisma') || lower.includes('migration') || lower.includes('schema.sql')) {
        criticalCouplings.push({
          source: file,
          target: 'Database Schema & Query Layer',
          type: 'SCHEMA_MODIFICATION',
          severity: 'HIGH',
          description: 'Database models changed; potential risk for existing query contracts.',
        });
      }

      // If shared index / barrel file changed
      if (lower.endsWith('index.js') || lower.endsWith('index.ts')) {
        criticalCouplings.push({
          source: file,
          target: 'Module Public API Exports',
          type: 'BARREL_EXPORT_MODIFIED',
          severity: 'MEDIUM',
          description: 'Export surface modified; downstream consumers should be verified for broken imports.',
        });
      }
    }

    return {
      totalCouplings: criticalCouplings.length,
      criticalCouplings,
    };
  },
};
