/**
 * Rules Extractor
 * Extracts contribution rules from CONTRIBUTING.md, CODE_OF_CONDUCT.md, PR templates.
 * Deterministic text parsing only.
 * Strips raw markdown navigation/anchors so rules are structured and clean.
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

      // Branch rules
      result.branchRules.push(...extractRuleLines(content, [
        'branch', 'feature/', 'fix/', 'hotfix/', 'chore/', 'docs/', 'main', 'master',
      ]));

      // Commit rules
      result.commitRules.push(...extractRuleLines(content, [
        'commit message', 'conventional commit', 'feat:', 'fix:', 'chore:',
        'commit format', 'commit convention', 'git commit',
      ]));

      // PR rules
      result.pullRequestRules.push(...extractRuleLines(content, [
        'pull request', 'pr title', 'pr description', 'pr size',
        'pull_request', 'draft pr', 'pr template',
      ]));

      // Review rules
      result.reviewRules.push(...extractRuleLines(content, [
        'review', 'reviewer', 'approval', 'lgtm', 'sign-off', 'maintainer',
      ]));

      // General declared rules (list items in CONTRIBUTING)
      if (/contributing/i.test(file.path)) {
        result.declaredRules.push(...extractListItems(content));
      }
    }

    // Deduplicate and filter out navigation noise
    result.branchRules = cleanAndDeduplicate(result.branchRules).slice(0, 5);
    result.commitRules = cleanAndDeduplicate(result.commitRules).slice(0, 5);
    result.pullRequestRules = cleanAndDeduplicate(result.pullRequestRules).slice(0, 5);
    result.reviewRules = cleanAndDeduplicate(result.reviewRules).slice(0, 5);
    result.declaredRules = cleanAndDeduplicate(result.declaredRules).slice(0, 10);

    return result;
  },
};

/**
 * Strips raw markdown link syntax [Label](#anchor) or [Label](url),
 * removes badges, bold/italic markers, and filters out TOC items.
 */
function cleanMarkdownLine(line) {
  let cleaned = line.trim();

  // Remove markdown list bullets or numbering
  cleaned = cleaned.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '').trim();

  // If line is purely a markdown anchor or badge, ignore it
  if (/^\[!\[.*\]\(.*\)\]\(.*\)$/.test(cleaned)) return '';
  if (/^\[.*?\]\(#.*?\)$/.test(cleaned)) return ''; // TOC anchor link like [Table of Contents](#toc)
  if (/^\[.*?\]\(.*\.md.*?\)$/i.test(cleaned)) return ''; // Links to other markdown files in TOC
  if (/^table of contents/i.test(cleaned)) return '';

  // Clean markdown links [Title](url) -> Title (preserve label, remove URL syntax)
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove bold / italics
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // Strip html tags
  cleaned = cleaned.replace(/<[^>]+>/g, '').trim();

  return cleaned;
}

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

    const cleaned = cleanMarkdownLine(trimmed);
    if (cleaned.length >= 10 && !isNavNoise(cleaned)) {
      rules.push(cleaned);
    }
  }

  return rules;
}

function extractListItems(content) {
  const lines = content.split('\n');
  const items = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-*•]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const cleaned = cleanMarkdownLine(trimmed);
      if (cleaned.length > 10 && cleaned.length < 250 && !isNavNoise(cleaned)) {
        items.push(cleaned);
      }
    }
  }

  return items;
}

function isNavNoise(text) {
  const lower = text.toLowerCase();
  return (
    lower === 'table of contents' ||
    lower.startsWith('about') ||
    lower.startsWith('features') ||
    lower.includes('badge') ||
    lower.includes('license')
  );
}

function cleanAndDeduplicate(arr) {
  const seen = new Set();
  const output = [];
  for (const s of arr) {
    const normalized = s.toLowerCase().trim();
    if (!seen.has(normalized) && normalized.length > 8) {
      seen.add(normalized);
      output.push(s.trim());
    }
  }
  return output;
}
