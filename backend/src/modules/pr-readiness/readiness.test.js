import { runReadinessChecks } from './readiness-rules.js';
import { calculateReadinessScore } from './score-calculator.js';
import { buildSuggestions } from './suggestion-builder.js';
import { readinessRequestSchema } from './readiness.schema.js';
import { buildPrReadinessCacheKey } from '../../integrations/redis/cache.keys.js';

const pullRequest = {
  body: '## Summary\nImplemented the change.',
  head: { ref: 'feature/readiness' },
  files: [{ filename: 'src/example.js' }],
  commits: [
    {
      sha: 'abc123',
      message: 'feat: add readiness checks',
    },
  ],
};

describe('PR readiness rules', () => {
  test('returns PASS for supported commit and branch conventions', () => {
    const checks = runReadinessChecks({
      intelligence: {
        rules: {
          commitConvention: { type: 'conventional_commits' },
          branchConvention: { prefixes: ['feature/'] },
        },
      },
    }, pullRequest);

    const score = calculateReadinessScore(checks);
    const commitCheck = checks.find((check) => check.id === 'commit_format');
    const branchCheck = checks.find((check) => check.id === 'branch_format');

    expect(commitCheck.status).toBe('PASS');
    expect(branchCheck.status).toBe('PASS');
    expect(score.score).toBe(100);
    expect(score.status).toBe('READY');
    expect(buildSuggestions(checks)).toEqual([]);
  });

  test('returns FAIL and a suggestion for an invalid commit', () => {
    const checks = runReadinessChecks({
      intelligence: {
        rules: {
          commitConvention: { type: 'conventional_commits' },
        },
      },
    }, {
      ...pullRequest,
      commits: [{ sha: 'bad123', message: 'update code' }],
    });

    const score = calculateReadinessScore(checks);
    const suggestions = buildSuggestions(checks);

    expect(checks.find((check) => check.id === 'commit_format').status).toBe('FAIL');
    expect(score.score).toBe(0);
    expect(score.status).toBe('NOT_READY');
    expect(suggestions[0].checkId).toBe('commit_format');
    expect(suggestions[0].priority).toBe('HIGH');
  });

  test('does not fail when repository rules are unavailable', () => {
    const checks = runReadinessChecks({ intelligence: { rules: {} } }, pullRequest);
    const score = calculateReadinessScore(checks);

    expect(checks.every((check) => check.status === 'NOT_APPLICABLE')).toBe(true);
    expect(score.score).toBe(0);
    expect(score.status).toBe('NEEDS_REVIEW');
  });

  test('changes the cache key when the PR head changes', () => {
    const first = buildPrReadinessCacheKey('owner', 'repo', 12, 'head-a', 'base-a');
    const second = buildPrReadinessCacheKey('owner', 'repo', 12, 'head-b', 'base-a');

    expect(first).not.toBe(second);
  });

  test('rejects invalid readiness requests', () => {
    expect(() => readinessRequestSchema.parse({
      repositoryUrl: 'not-a-url',
      pullRequestNumber: 0,
    })).toThrow();
  });
});
