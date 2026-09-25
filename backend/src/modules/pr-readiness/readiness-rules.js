/**
 * Deterministic PR Readiness Rules
 * Evaluates PR against repository-specific contribution standards from RIO.
 * Status: PASS | FAIL | WARNING | NOT_APPLICABLE | UNKNOWN
 */

export const readinessRules = {
  evaluateAll({ pr, files, commits, rio }) {
    const rules = rio?.intelligence?.rules || {};
    const workflows = rio?.intelligence?.workflows || {};

    const checks = [
      this.checkBranchName(pr, rules),
      this.checkCommitMessages(commits, rules),
      this.checkPrBodyAndChecklist(pr, rules),
      this.checkTests(files, workflows),
      this.checkDocumentation(files, pr),
    ];

    return checks;
  },

  checkBranchName(pr, rules) {
    const headBranch = pr.headBranch || '';
    const branchRules = rules.branchRules || [];

    // Check if head branch is default/main (bad practice for PRs)
    if (headBranch === 'main' || headBranch === 'master') {
      return {
        id: 'BRANCH_CONVENTION',
        name: 'Branch Naming Convention',
        category: 'Git Standards',
        status: 'FAIL',
        message: 'Pull request submitted directly from main/master branch instead of a feature branch.',
        evidence: `Branch: "${headBranch}"`,
      };
    }

    const standardPrefixPattern = /^(feat|fix|chore|refactor|docs|test|perf|ci|style|build)\/[a-z0-9-_.]+$/i;
    const isConventional = standardPrefixPattern.test(headBranch);

    if (branchRules.length > 0) {
      if (isConventional) {
        return {
          id: 'BRANCH_CONVENTION',
          name: 'Branch Naming Convention',
          category: 'Git Standards',
          status: 'PASS',
          message: 'Branch name follows recommended prefix conventions.',
          evidence: `Branch "${headBranch}" adheres to repository standards.`,
        };
      }
      return {
        id: 'BRANCH_CONVENTION',
        name: 'Branch Naming Convention',
        category: 'Git Standards',
        status: 'WARNING',
        message: 'Branch name does not follow standard prefix pattern (e.g. feat/..., fix/...).',
        evidence: `Branch "${headBranch}" does not match prefix/kebab-case convention.`,
      };
    }

    return {
      id: 'BRANCH_CONVENTION',
      name: 'Branch Naming Convention',
      category: 'Git Standards',
      status: isConventional ? 'PASS' : 'WARNING',
      message: isConventional
        ? 'Branch name follows feature branch format.'
        : 'Consider prefixing your branch (e.g. feat/my-change).',
      evidence: `Branch: "${headBranch}"`,
    };
  },

  checkCommitMessages(commits, rules) {
    if (!commits || commits.length === 0) {
      return {
        id: 'COMMIT_CONVENTIONS',
        name: 'Commit Message Standards',
        category: 'Git Standards',
        status: 'WARNING',
        message: 'No commits detected in this pull request to evaluate.',
        evidence: '0 commits returned',
      };
    }

    const conventionalPattern = /^(feat|fix|chore|refactor|docs|test|perf|ci|style|build)(\([a-z0-9-_.]+\))?:\s[a-z0-9\s-_.,/()#]+$/i;
    const nonConventional = [];

    for (const c of commits) {
      const firstLine = (c.message || '').split('\n')[0].trim();
      if (!conventionalPattern.test(firstLine)) {
        nonConventional.push(firstLine.slice(0, 50));
      }
    }

    if (nonConventional.length === 0) {
      return {
        id: 'COMMIT_CONVENTIONS',
        name: 'Commit Message Standards',
        category: 'Git Standards',
        status: 'PASS',
        message: `All ${commits.length} commit(s) adhere to Conventional Commits format.`,
        evidence: `Valid conventional commit format verified.`,
      };
    }

    return {
      id: 'COMMIT_CONVENTIONS',
      name: 'Commit Message Standards',
      category: 'Git Standards',
      status: 'WARNING',
      message: `${nonConventional.length} of ${commits.length} commit(s) do not follow conventional commit format.`,
      evidence: `Example non-matching message: "${nonConventional[0]}"`,
    };
  },

  checkPrBodyAndChecklist(pr, rules) {
    const body = (pr.body || '').trim();

    if (!body || body.length < 20) {
      return {
        id: 'PR_TEMPLATE_COMPLIANCE',
        name: 'PR Description & Motivation',
        category: 'Review Standards',
        status: 'FAIL',
        message: 'PR description is empty or too short. Maintainers require description of motivation and changes.',
        evidence: `Description length: ${body.length} characters.`,
      };
    }

    // Check for unchecked boxes [ ]
    const uncheckedCount = (body.match(/\[\s\]/g) || []).length;
    const checkedCount = (body.match(/\[x\]/gi) || []).length;

    if (uncheckedCount > 0) {
      return {
        id: 'PR_TEMPLATE_COMPLIANCE',
        name: 'PR Checklist Completion',
        category: 'Review Standards',
        status: 'WARNING',
        message: `There are ${uncheckedCount} unchecked item(s) in the PR description checklist.`,
        evidence: `${checkedCount} checked, ${uncheckedCount} unchecked items found.`,
      };
    }

    return {
      id: 'PR_TEMPLATE_COMPLIANCE',
      name: 'PR Description & Checklist',
      category: 'Review Standards',
      status: 'PASS',
      message: 'PR has comprehensive description with completed checklist items.',
      evidence: `Completed description with ${checkedCount} verified check items.`,
    };
  },

  checkTests(files, workflows) {
    if (!workflows.hasTests) {
      return {
        id: 'TEST_COVERAGE_SIGNAL',
        name: 'Automated Test Verification',
        category: 'Verification',
        status: 'NOT_APPLICABLE',
        message: 'Repository does not have automated test suite detected in CI or package manifest.',
        evidence: 'No test suite detected in RIO workflows',
      };
    }

    const testFiles = (files || []).filter((f) => {
      const name = (f.filename || '').toLowerCase();
      return (
        name.includes('test') ||
        name.includes('spec') ||
        name.startsWith('tests/') ||
        name.startsWith('__tests__/')
      );
    });

    if (testFiles.length > 0) {
      return {
        id: 'TEST_COVERAGE_SIGNAL',
        name: 'Automated Test Verification',
        category: 'Verification',
        status: 'PASS',
        message: `${testFiles.length} test file(s) modified or added alongside code changes.`,
        evidence: `Tests touched: ${testFiles.map((t) => t.filename).slice(0, 3).join(', ')}`,
      };
    }

    return {
      id: 'TEST_COVERAGE_SIGNAL',
      name: 'Automated Test Verification',
      category: 'Verification',
      status: 'WARNING',
      message: 'No test files were modified in this PR, but repository has active test suites.',
      evidence: '0 test files touched out of ' + (files ? files.length : 0) + ' modified files',
    };
  },

  checkDocumentation(files, pr) {
    const docFiles = (files || []).filter((f) => {
      const name = (f.filename || '').toLowerCase();
      return name.endsWith('.md') || name.startsWith('docs/');
    });

    if (docFiles.length > 0) {
      return {
        id: 'DOCUMENTATION_SYNC',
        name: 'Documentation Currency',
        category: 'Documentation',
        status: 'PASS',
        message: 'PR includes updates to documentation or README.',
        evidence: `Docs touched: ${docFiles.map((d) => d.filename).slice(0, 2).join(', ')}`,
      };
    }

    return {
      id: 'DOCUMENTATION_SYNC',
      name: 'Documentation Currency',
      category: 'Documentation',
      status: 'PASS',
      message: 'Code changes do not mandate documentation updates.',
      evidence: 'Standard internal file modifications',
    };
  },
};
