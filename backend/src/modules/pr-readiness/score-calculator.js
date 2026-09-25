/**
 * Deterministic PR Readiness Score Calculator
 * Computes deterministic 0-100 score based on weighted check statuses.
 */
export const scoreCalculator = {
  calculate(checks) {
    if (!checks || checks.length === 0) return 0;

    let totalWeight = 0;
    let earnedWeight = 0;

    const weights = {
      BRANCH_CONVENTION: 20,
      COMMIT_CONVENTIONS: 25,
      PR_TEMPLATE_COMPLIANCE: 25,
      TEST_COVERAGE_SIGNAL: 20,
      DOCUMENTATION_SYNC: 10,
    };

    for (const check of checks) {
      if (check.status === 'NOT_APPLICABLE') continue;

      const weight = weights[check.id] || 15;
      totalWeight += weight;

      if (check.status === 'PASS') {
        earnedWeight += weight;
      } else if (check.status === 'WARNING') {
        earnedWeight += weight * 0.5;
      } else if (check.status === 'FAIL') {
        earnedWeight += 0;
      } else {
        // UNKNOWN
        earnedWeight += weight * 0.3;
      }
    }

    if (totalWeight === 0) return 100;
    return Math.round((earnedWeight / totalWeight) * 100);
  },
};
