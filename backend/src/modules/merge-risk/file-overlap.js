/**
 * File Overlap & Structural Coupling Analyzer
 * Identifies modified files, classifies architectural layers, and detects overlap with base/target branches.
 */
export const fileOverlapAnalyzer = {
  analyze({ files, targetBranch = 'main' }) {
    const classifiedFiles = (files || []).map((file) => {
      const filename = file.filename || '';
      const layer = classifyLayer(filename);
      const isCritical = isCriticalFile(filename);

      return {
        filename,
        status: file.status || 'modified',
        additions: file.additions || 0,
        deletions: file.deletions || 0,
        layer,
        isCritical,
      };
    });

    // Group files by architectural module
    const moduleMap = new Map();
    for (const file of classifiedFiles) {
      const mod = getModulePrefix(file.filename);
      if (!moduleMap.has(mod)) {
        moduleMap.set(mod, []);
      }
      moduleMap.get(mod).push(file);
    }

    const affectedModules = Array.from(moduleMap.entries()).map(([name, moduleFiles]) => ({
      name,
      fileCount: moduleFiles.length,
      layer: moduleFiles[0]?.layer || 'Application',
      hasCriticalChanges: moduleFiles.some((f) => f.isCritical),
      files: moduleFiles.map((f) => f.filename),
    }));

    return {
      totalFilesChanged: classifiedFiles.length,
      classifiedFiles,
      affectedModules,
    };
  },
};

function classifyLayer(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('config') || lower.startsWith('.env') || lower.endsWith('.json') || lower.endsWith('.yml') || lower.endsWith('.yaml')) {
    return 'Configuration & Infrastructure';
  }
  if (lower.includes('auth') || lower.includes('security') || lower.includes('middleware')) {
    return 'Core Security & Middleware';
  }
  if (lower.includes('db') || lower.includes('database') || lower.includes('prisma') || lower.includes('schema') || lower.includes('migration')) {
    return 'Data Layer & Schema';
  }
  if (lower.includes('api/') || lower.includes('routes/') || lower.includes('controllers/')) {
    return 'API & Routing';
  }
  if (lower.includes('components/') || lower.includes('pages/') || lower.includes('app/') || lower.includes('views/')) {
    return 'User Interface';
  }
  if (lower.includes('test') || lower.includes('spec')) {
    return 'Test Suites';
  }
  if (lower.endsWith('.md') || lower.includes('docs/')) {
    return 'Documentation';
  }
  return 'Application Logic';
}

function isCriticalFile(filename) {
  const lower = filename.toLowerCase();
  return (
    lower.includes('package.json') ||
    lower.includes('package-lock.json') ||
    lower.includes('pnpm-lock.yaml') ||
    lower.includes('schema.prisma') ||
    lower.includes('.env') ||
    lower.includes('tsconfig.json') ||
    lower.includes('next.config')
  );
}

function getModulePrefix(filename) {
  const parts = filename.split('/');
  if (parts.length === 1) return 'root';
  if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  return parts[0];
}
