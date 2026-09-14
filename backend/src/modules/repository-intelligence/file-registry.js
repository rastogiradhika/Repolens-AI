import { normalizePath, matchesPattern } from '../../shared/utilities/path-normalizer.js';

// Binary file extensions to skip
const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'bmp', 'tiff',
  'mp4', 'mp3', 'wav', 'avi', 'mov', 'webm',
  'zip', 'tar', 'gz', 'rar', '7z', 'bz2',
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'exe', 'dll', 'so', 'dylib', 'bin', 'wasm',
  'ttf', 'woff', 'woff2', 'eot', 'otf',
  'pyc', 'class', 'jar',
]);

// Directories to always skip
const EXCLUDED_DIRECTORIES = [
  'node_modules/', 'dist/', 'build/', 'coverage/', 'vendor/',
  '.git/', 'out/', '.next/', '.nuxt/', '__pycache__/', '.cache/',
  'target/', 'pkg/', 'bin/',
];

// Exact filenames and patterns to include (categorized)
const FILE_REGISTRY = {
  documentation: {
    priority: 1,
    exact: [
      'readme.md', 'readme.txt', 'readme.rst', 'readme',
      'architecture.md', 'docs/architecture.md',
      'changelog.md', 'history.md',
    ],
    patterns: ['docs/**', 'documentation/**'],
  },

  contribution: {
    priority: 1,
    exact: [
      'contributing.md', '.github/contributing.md', 'docs/contributing.md',
      'code_of_conduct.md', '.github/code_of_conduct.md',
      'security.md', '.github/security.md',
      'support.md', '.github/support.md',
      '.github/pull_request_template.md',
    ],
    patterns: [
      '.github/issue_template/**',
      '.github/issue_template.md',
      '.github/pull_request_template/**',
    ],
  },

  build: {
    priority: 1,
    exact: [
      'package.json', 'package-lock.json', 'yarn.lock',
      'pnpm-lock.yaml', 'pnpm-workspace.yaml',
      'pyproject.toml', 'requirements.txt', 'requirements-dev.txt',
      'pipfile', 'pipfile.lock',
      'go.mod', 'go.sum',
      'cargo.toml', 'cargo.lock',
      'pom.xml', 'build.gradle', 'build.gradle.kts',
      'makefile', 'dockerfile', 'docker-compose.yml', 'docker-compose.yaml',
      'gemfile', 'gemfile.lock',
    ],
    patterns: [],
  },

  testing: {
    priority: 2,
    exact: [
      'jest.config.js', 'jest.config.ts', 'jest.config.cjs', 'jest.config.mjs',
      'vitest.config.js', 'vitest.config.ts', 'vitest.config.mts',
      'pytest.ini', 'setup.cfg', 'tox.ini',
      '.mocharc.js', '.mocharc.yml', '.mocharc.json',
      'cypress.config.js', 'cypress.config.ts',
      'playwright.config.js', 'playwright.config.ts',
    ],
    patterns: [],
  },

  techStack: {
    priority: 2,
    exact: [
      'tsconfig.json', 'tsconfig.base.json',
      '.babelrc', 'babel.config.js', 'babel.config.json',
      '.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml',
      'eslint.config.js', 'eslint.config.mjs',
      '.prettierrc', '.prettierrc.js', '.prettierrc.json',
      '.env.example', '.env.sample',
    ],
    patterns: [
      'vite.config.*',
      'next.config.*',
      'nuxt.config.*',
      'angular.json',
      'svelte.config.*',
      'webpack.config.*',
    ],
  },

  workflows: {
    priority: 1,
    exact: [
      '.gitlab-ci.yml',
      '.circleci/config.yml',
      '.travis.yml',
    ],
    patterns: ['.github/workflows/**'],
  },
};

/**
 * File Registry — determines which files from the GitHub tree are important.
 */
export const fileRegistry = {
  /**
   * Given a file path from the GitHub tree, returns its category and priority,
   * or null if the file should be ignored.
   */
  classify(filePath) {
    const normalized = normalizePath(filePath);

    // Skip excluded directories
    for (const dir of EXCLUDED_DIRECTORIES) {
      if (normalized.startsWith(dir) || normalized.includes('/' + dir)) {
        return null;
      }
    }

    // Skip binary files by extension
    const ext = normalized.split('.').pop();
    if (BINARY_EXTENSIONS.has(ext)) return null;

    // Skip .env files (but allow .env.example)
    if (/^\.env$/.test(normalized) || /\/\.env$/.test(normalized)) return null;
    if (/\.env\.[^e]/.test(normalized)) return null; // .env.local, .env.production etc.

    const fileName = normalized.split('/').pop();

    // Check each category
    for (const [category, config] of Object.entries(FILE_REGISTRY)) {
      // Check exact matches (case-insensitive via normalization)
      if (config.exact.includes(normalized) || config.exact.includes(fileName)) {
        return { category, priority: config.priority };
      }

      // Check glob patterns
      for (const pattern of config.patterns) {
        if (matchesPattern(normalized, pattern)) {
          return { category, priority: config.priority };
        }
      }
    }

    return null;
  },

  getCategories() {
    return Object.keys(FILE_REGISTRY);
  },
};
