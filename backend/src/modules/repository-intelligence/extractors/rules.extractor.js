/**
 * Rules Extractor
 * Extracts contribution rules from CONTRIBUTING.md, CODE_OF_CONDUCT.md, PR templates.
 * Deterministic text parsing only.
 */
export const rulesExtractor = {
  name: 'rules',

  run(files) {
    const contributionFiles = files.filter((f) => f.category === 'contribution');

    const result = {
      sourceFiles: contributionFiles.map((f) => f.path),
      declaredRules: [],
      branchRules: [],
      commitRules: [],
      pullRequestRules: [],
      reviewRules: [],
    };

    for (const file of contributionFiles) {
      const content = file.content || '';
      const lower = content.toLowerCase();

      // Branch rules
      result.branchRules.push(...extractRuleLines(content, [
        'branch', 'feature/', 'fix/', 'hotfix/', 'chore/', 'docs/',
      ]));

      // Commit rules
      result.commitRules.push(...extractRuleLines(content, [
        'commit message', 'conventional commit', 'feat:', 'fix:', 'chore:',
        'commit format', 'commit convention',
      ]));

      // PR rules
      result.pullRequestRules.push(...extractRuleLines(content, [
        'pull request', 'pr title', 'pr description', 'pr size',
        'pull_request', 'draft pr',
      ]));

      // Review rules
      result.reviewRules.push(...extractRuleLines(content, [
        'review', 'reviewer', 'approval', 'lgtm', 'sign-off',
      ]));

      // General declared rules (list items in CONTRIBUTING)
      if (/contributing/i.test(file.path)) {
        result.declaredRules.push(...extractListItems(content));
      }
    }

    // Deduplicate
    result.branchRules = deduplicate(result.branchRules).slice(0, 5);
    result.commitRules = deduplicate(result.commitRules).slice(0, 5);
    result.pullRequestRules = deduplicate(result.pullRequestRules).slice(0, 5);
    result.reviewRules = deduplicate(result.reviewRules).slice(0, 5);
    result.declaredRules = deduplicate(result.declaredRules).slice(0, 10);

    return result;
  },
};

function extractRuleLines(content, keywords) {
  const lines = content.split('\n');
  const rules = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    const hasKeyword = keywords.some((kw) => lower.includes(kw.toLowerCase()));
    if (!hasKeyword) continue;

    const trimmed = line.trim();
    if (trimmed.length < 10 || trimmed.length > 300) continue;
    if (/^#{1,6}\s/.test(trimmed)) continue; // skip headings

    rules.push(trimmed.replace(/^[-*]\s+/, '').trim());
  }

  return rules;
}

function extractListItems(content) {
  const lines = content.split('\n');
  const items = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-*•]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const cleaned = trimmed.replace(/^[-*•]\s+|^\d+\.\s+/, '').trim();
      if (cleaned.length > 10 && cleaned.length < 200) {
        items.push(cleaned);
      }
    }
  }

  return items;
}

function deduplicate(arr) {
  return [...new Set(arr.map((s) => s.toLowerCase()))].map((lower) =>
    arr.find((s) => s.toLowerCase() === lower)
  );
}
