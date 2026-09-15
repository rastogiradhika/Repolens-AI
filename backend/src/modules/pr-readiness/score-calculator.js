/**
 * Calculates score from applicable checks only.
 * PASS earns the full weight, WARNING earns half weight, FAIL earns zero.
 * NOT_APPLICABLE and UNKNOWN do not enter the denominator.
 */
export function calculateReadinessScore(checks) {
  const applicableChecks = checks.filter(
    (check) => check.status !== 'NOT_APPLICABLE' && check.status !== 'UNKNOWN'
  );
  const totalWeight = applicableChecks.reduce((sum, check) => sum + check.weight, 0);
  const earnedWeight = applicableChecks.reduce((sum, check) => {
    if (check.status === 'PASS') return sum + check.weight;
    if (check.status === 'WARNING') return sum + check.weight / 2;
    return sum;
  }, 0);

  const score = totalWeight === 0
    ? 0
    : Math.round((earnedWeight / totalWeight) * 100);

  const summary = checks.reduce((counts, check) => {
    const key = {
      PASS: 'pass',
      FAIL: 'fail',
      WARNING: 'warning',
      NOT_APPLICABLE: 'notApplicable',
      UNKNOWN: 'unknown',
    }[check.status];
    counts[key] += 1;
    return counts;
  }, { pass: 0, fail: 0, warning: 0, notApplicable: 0, unknown: 0 });

  let status = totalWeight === 0 ? 'NEEDS_REVIEW' : 'READY';
  if (summary.fail > 0) status = 'NOT_READY';
  else if (summary.unknown > 0) status = 'NEEDS_REVIEW';
  else if (summary.warning > 0) status = 'READY_WITH_WARNINGS';

  return { score, status, summary };
}