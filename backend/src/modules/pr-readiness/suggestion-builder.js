/**
 * Suggestion Builder
 * Generates concrete remediation steps for any failing or warning PR checks.
 */
export const suggestionBuilder = {
  build(checks) {
    const suggestions = [];

    for (const check of checks) {
      if (check.status === 'PASS' || check.status === 'NOT_APPLICABLE') continue;

      switch (check.id) {
        case 'BRANCH_CONVENTION':
          suggestions.push({
            checkId: check.id,
            severity: check.status === 'FAIL' ? 'critical' : 'warning',
            title: 'Align branch naming with repository standards',
            action: 'Create a descriptive feature branch using standard prefixes like `feat/short-description` or `fix/issue-number`.',
          });
          break;

        case 'COMMIT_CONVENTIONS':
          suggestions.push({
            checkId: check.id,
            severity: 'warning',
            title: 'Reformat commit messages into Conventional Commits',
            action: 'Format commit messages as `type(scope): imperative description` (e.g. `feat(parser): add AST node visitors`). Consider squashing interactive fixups before maintainer review.',
          });
          break;

        case 'PR_TEMPLATE_COMPLIANCE':
          suggestions.push({
            checkId: check.id,
            severity: check.status === 'FAIL' ? 'critical' : 'warning',
            title: 'Complete PR description and checklist items',
            action: 'Explain the motivation for this PR and complete all checklist boxes [x] in the PR description.',
          });
          break;

        case 'TEST_COVERAGE_SIGNAL':
          suggestions.push({
            checkId: check.id,
            severity: 'warning',
            title: 'Add tests covering your code modifications',
            action: 'Repository workflows mandate automated tests. Add corresponding unit or integration test cases to prevent regressions.',
          });
          break;

        case 'DOCUMENTATION_SYNC':
          suggestions.push({
            checkId: check.id,
            severity: 'info',
            title: 'Update documentation if user-facing behavior changed',
            action: 'Verify if README or documentation files need updates to reflect new parameters or workflow instructions.',
          });
          break;

        default:
          suggestions.push({
            checkId: check.id,
            severity: 'info',
            title: check.name,
            action: check.message,
          });
      }
    }

    if (suggestions.length === 0) {
      suggestions.push({
        checkId: 'ALL_PASS',
        severity: 'success',
        title: 'PR is review-ready',
        action: 'All automated readiness standards passed. Ready for maintainer assignment.',
      });
    }

    return suggestions;
  },
};
