export function buildSuggestions(checks) {
  return checks
    .filter((check) => check.status === 'FAIL' || check.status === 'WARNING')
    .map((check) => ({
      checkId: check.id,
      priority: check.status === 'FAIL' ? 'HIGH' : 'MEDIUM',
      message: check.message,
      action: actionForCheck(check),
    }));
}

function actionForCheck(check) {
  switch (check.id) {
    case 'commit_format':
      return 'Rewrite the failing commit messages to match the repository convention.';
    case 'branch_format':
      return 'Rename the branch to use one of the repository-approved prefixes.';
    case 'pr_template':
      return 'Add the missing sections or checklist items to the pull request description.';
    case 'tests':
      return 'Add or update the required tests once the repository test requirement is structured in RIO.';
    case 'documentation':
      return 'Update the required documentation for the changed behavior.';
    case 'required_files':
      return 'Add the repository-required files or changes.';
    default:
      return 'Review this readiness check and address the reported requirement.';
  }
}