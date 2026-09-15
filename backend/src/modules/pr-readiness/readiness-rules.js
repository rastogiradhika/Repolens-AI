const CONVENTIONAL_COMMIT_PATTERN =
  /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\([^)]+\))?!?: .+/i;

export function runReadinessChecks(rio, pullRequest) {
  const rules = rio?.intelligence?.rules || {};

  return [
    evaluateCommitFormat(rules, pullRequest.commits),
    evaluateBranchConvention(rules, pullRequest.head.ref),
    evaluatePullRequestTemplate(rules.pullRequestTemplate, pullRequest.body),
    evaluateUnsupportedRequirement(
      'tests',
      'Tests',
      'No structured repository test requirement is available in the current RIO.',
      ['intelligence.testing', 'intelligence.workflows']
    ),
    evaluateUnsupportedRequirement(
      'documentation',
      'Documentation',
      'No structured repository documentation requirement is available in the current RIO.',
      ['intelligence.documentation', 'intelligence.rules']
    ),
    evaluateUnsupportedRequirement(
      'required_files',
      'Required files or changes',
      'No structured required-file rule is available in the current RIO.',
      ['intelligence.rules.requiredFiles']
    ),
  ];
}

function evaluateCommitFormat(rules, commits) {
  const convention = rules.commitConvention;
  const base = {
    id: 'commit_format',
    label: 'Commit message format',
    weight: 1,
    source: {
      rioPaths: ['intelligence.rules.commitConvention'],
      prPaths: ['pullRequest.commits'],
    },
  };

  if (!convention) {
    return {
      ...base,
      status: 'NOT_APPLICABLE',
      scoreContribution: 0,
      message: 'The repository does not declare a supported commit message convention.',
      evidence: { commitCount: commits.length },
    };
  }

  if (convention.type !== 'conventional_commits') {
    return {
      ...base,
      status: 'UNKNOWN',
      scoreContribution: 0,
      message: 'Requires additional implementation/data to evaluate the repository commit convention.',
      evidence: { convention },
    };
  }

  const invalidCommits = commits
    .filter((commit) => !CONVENTIONAL_COMMIT_PATTERN.test(commit.message.trim()))
    .map((commit) => ({ sha: commit.sha, message: commit.message }));

  return {
    ...base,
    status: invalidCommits.length ? 'FAIL' : 'PASS',
    scoreContribution: invalidCommits.length ? 0 : base.weight,
    message: invalidCommits.length
      ? `${invalidCommits.length} commit message(s) do not follow Conventional Commits.`
      : 'All commits follow Conventional Commits.',
    evidence: {
      convention: 'conventional_commits',
      commitCount: commits.length,
      invalidCommits,
    },
  };
}

function evaluateBranchConvention(rules, branchName) {
  const convention = rules.branchConvention;
  const base = {
    id: 'branch_format',
    label: 'Branch naming convention',
    weight: 1,
    source: {
      rioPaths: ['intelligence.rules.branchConvention'],
      prPaths: ['pullRequest.head.ref'],
    },
  };

  if (!convention?.prefixes?.length) {
    return {
      ...base,
      status: 'NOT_APPLICABLE',
      scoreContribution: 0,
      message: 'The repository does not declare a supported branch naming convention.',
      evidence: { branchName },
    };
  }

  const passes = convention.prefixes.some((prefix) => branchName.toLowerCase().startsWith(prefix));
  return {
    ...base,
    status: passes ? 'PASS' : 'FAIL',
    scoreContribution: passes ? base.weight : 0,
    message: passes
      ? 'The PR branch follows the repository branch naming convention.'
      : `The PR branch must start with one of: ${convention.prefixes.join(', ')}.`,
    evidence: {
      branchName,
      allowedPrefixes: convention.prefixes,
    },
  };
}

function evaluatePullRequestTemplate(template, body) {
  const base = {
    id: 'pr_template',
    label: 'Pull request template',
    weight: 1,
    source: {
      rioPaths: ['intelligence.rules.pullRequestTemplate'],
      prPaths: ['pullRequest.body'],
    },
  };

  if (!template?.present) {
    return {
      ...base,
      status: 'NOT_APPLICABLE',
      scoreContribution: 0,
      message: 'The repository does not provide a pull request template.',
      evidence: {},
    };
  }

  const requiredSections = template.requiredSections || [];
  const requiredChecklistItems = template.requiredChecklistItems || [];
  if (!requiredSections.length && !requiredChecklistItems.length) {
    return {
      ...base,
      status: 'UNKNOWN',
      scoreContribution: 0,
      message: 'Requires additional implementation/data to interpret this pull request template.',
      evidence: { sourceFile: template.sourceFile },
    };
  }

  const lowerBody = body.toLowerCase();
  const missingSections = requiredSections.filter(
    (section) => !lowerBody.includes(section.toLowerCase())
  );
  const missingChecklistItems = requiredChecklistItems.filter(
    (item) => !lowerBody.includes(item.toLowerCase())
  );
  const missing = [...missingSections, ...missingChecklistItems];

  return {
    ...base,
    status: missing.length ? 'FAIL' : 'PASS',
    scoreContribution: missing.length ? 0 : base.weight,
    message: missing.length
      ? `The PR body is missing ${missing.length} required template item(s).`
      : 'The PR body satisfies the detected pull request template requirements.',
    evidence: {
      sourceFile: template.sourceFile,
      missingSections,
      missingChecklistItems,
    },
  };
}

function evaluateUnsupportedRequirement(id, label, message, rioPaths) {
  return {
    id,
    label,
    status: 'NOT_APPLICABLE',
    weight: 1,
    scoreContribution: 0,
    message,
    evidence: { reason: 'structured_rule_unavailable' },
    source: {
      rioPaths,
      prPaths: ['pullRequest.files'],
    },
  };
}