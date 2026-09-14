/**
 * Workflows Extractor
 * Identifies CI/CD pipelines and deployment strategies.
 */
export const workflowsExtractor = {
  name: 'workflows',

  run(files) {
    const workflowFiles = files.filter((f) => f.category === 'workflows');
    const result = {
      ciTools: [],
      hasDocker: false,
      hasTests: false,
      hasLinting: false,
    };

    const buildFiles = files.filter((f) => f.category === 'build');
    if (buildFiles.some((f) => /dockerfile|docker-compose/i.test(f.path))) {
      result.hasDocker = true;
    }

    for (const file of workflowFiles) {
      if (file.path.includes('.github/workflows')) {
        result.ciTools.push('GitHub Actions');
      } else if (file.path.includes('.gitlab-ci.yml')) {
        result.ciTools.push('GitLab CI');
      } else if (file.path.includes('.circleci')) {
        result.ciTools.push('CircleCI');
      } else if (file.path.includes('.travis.yml')) {
        result.ciTools.push('Travis CI');
      }

      if (file.content) {
        const lower = file.content.toLowerCase();
        if (lower.includes('test') || lower.includes('jest') || lower.includes('pytest')) {
          result.hasTests = true;
        }
        if (lower.includes('lint') || lower.includes('eslint') || lower.includes('flake8')) {
          result.hasLinting = true;
        }
      }
    }

    result.ciTools = [...new Set(result.ciTools)];
    return result;
  },
};
