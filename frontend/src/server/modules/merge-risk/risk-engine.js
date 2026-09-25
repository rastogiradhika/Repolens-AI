/**
 * Semantic Merge Risk Engine
 * Distinguishes textual overlap from true semantic merge risk.
 * Outputs explainable risk levels with clear reasons and actionable recommendations.
 */
export const riskEngine = {
  calculateRisk({ overlapData, couplingData, pr }) {
    const reasons = [];
    const recommendations = [];
    let riskScore = 0;

    const { totalFilesChanged, classifiedFiles, affectedModules } = overlapData;
    const { criticalCouplings } = couplingData;

    // Signal 1: Core infrastructure / Manifest changes
    const manifestChanges = criticalCouplings.filter((c) => c.type === 'DEPENDENCY_MANIFEST_CHANGE');
    if (manifestChanges.length > 0) {
      riskScore += 35;
      reasons.push({
        level: 'HIGH',
        signal: 'Dependency Manifest Modified',
        description: 'Changes to package manifest can introduce lockfile conflicts and upstream version collisions.',
      });
      recommendations.push('Run lockfile deduplication and verify that dependencies match the target branch before merging.');
    }

    // Signal 2: Database Schema changes
    const schemaChanges = criticalCouplings.filter((c) => c.type === 'SCHEMA_MODIFICATION');
    if (schemaChanges.length > 0) {
      riskScore += 40;
      reasons.push({
        level: 'HIGH',
        signal: 'Database Schema Collision Risk',
        description: 'Altering database schemas concurrently with other open features can lead to migration rollback issues.',
      });
      recommendations.push('Coordinate migration sequence and execute schema drift check against staging database.');
    }

    // Signal 3: Core security / Auth changes
    const securityFiles = classifiedFiles.filter((f) => f.layer === 'Core Security & Middleware');
    if (securityFiles.length > 0) {
      riskScore += 25;
      reasons.push({
        level: 'MEDIUM',
        signal: 'Security & Middleware Changes',
        description: `${securityFiles.length} security/middleware file(s) touched. May alter request processing pipeline.`,
      });
      recommendations.push('Ensure existing auth/security regression test suite passes with 100% coverage.');
    }

    // Signal 4: Wide change surface (diff size)
    if (totalFilesChanged > 15) {
      riskScore += 20;
      reasons.push({
        level: 'MEDIUM',
        signal: 'Large Change Surface',
        description: `PR modifies ${totalFilesChanged} files across ${affectedModules.length} distinct modules.`,
      });
      recommendations.push('Consider breaking large PR into smaller atomic feature slices for faster, lower-risk merging.');
    }

    // Signal 5: Public API export surface
    const barrelChanges = criticalCouplings.filter((c) => c.type === 'BARREL_EXPORT_MODIFIED');
    if (barrelChanges.length > 0) {
      riskScore += 15;
      reasons.push({
        level: 'LOW',
        signal: 'Barrel/Index Export Modified',
        description: 'Module export index files were altered. Potential for circular dependency introduction.',
      });
      recommendations.push('Run linter check for circular references.');
    }

    riskScore = Math.min(100, Math.max(5, riskScore));

    let level = 'LOW';
    if (riskScore >= 65) {
      level = 'HIGH';
    } else if (riskScore >= 35) {
      level = 'MEDIUM';
    }

    if (reasons.length === 0) {
      reasons.push({
        level: 'LOW',
        signal: 'Clean Semantic Boundary',
        description: 'Changes are isolated to application layer without conflicting schema or manifest alterations.',
      });
      recommendations.push('Standard fast-forward or squash merge recommended.');
    }

    return {
      level,
      score: riskScore,
      reasons,
      recommendations,
      affectedModules,
      summary: `Evaluated ${totalFilesChanged} file(s) across ${affectedModules.length} module(s). Determined ${level} semantic merge risk.`,
    };
  },
};
