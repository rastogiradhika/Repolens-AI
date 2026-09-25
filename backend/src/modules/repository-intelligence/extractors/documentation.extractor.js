/**
 * Documentation Extractor
 * Extracts: README summary, setup instructions, architecture notes, project purpose.
 * Source: README.md and other documentation files.
 * No AI calls — pure deterministic text parsing.
 */
export const documentationExtractor = {
  name: 'documentation',

  run(files) {
    const docFiles = files.filter((f) => f.category === 'documentation');
    const readmeFile = docFiles.find((f) => /^readme/i.test(f.path.split('/').pop()));

    if (!docFiles.length) {
      return {
        readmePresent: false,
        summary: null,
        documentationFiles: [],
        setupInstructions: [],
        architectureNotes: [],
      };
    }

    const result = {
      readmePresent: !!readmeFile,
      summary: null,
      documentationFiles: docFiles.map((f) => f.path),
      setupInstructions: [],
      architectureNotes: [],
    };

    if (readmeFile) {
      const content = readmeFile.content || '';
      result.summary = extractReadmeSummary(content);
      result.setupInstructions = extractSetupInstructions(content);
      result.architectureNotes = extractArchitectureNotes(content);
    }

    return result;
  },
};

function extractReadmeSummary(content) {
  const lines = content.split('\n');
  const summaryLines = [];

  // Skip the first h1 heading, take the next non-empty paragraph
  let foundH1 = false;
  let inSummary = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!foundH1 && /^#{1,2}\s/.test(trimmed)) {
      foundH1 = true;
      continue;
    }

    if (foundH1 && trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('!')) {
      // Avoid TOC list items
      if (trimmed.toLowerCase().includes('table of contents') || /^[-*•]\s*\[.*\]\(#.*\)/.test(trimmed) || /^\d+\.\s*\[.*\]\(#.*\)/.test(trimmed)) {
        continue;
      }
      inSummary = true;
    }

    if (inSummary) {
      if (!trimmed || trimmed.startsWith('#')) break; // Stop at next heading or empty line (end of paragraph)
      summaryLines.push(trimmed);
    }
  }

  const summary = summaryLines.join(' ').slice(0, 500).trim();
  return summary || null;
}

function extractSetupInstructions(content) {
  const instructions = [];
  const lines = content.split('\n');
  const setupKeywords = /^#{1,4}\s.*(install|setup|getting started|quick start|usage|how to)/i;

  let inSetupSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (setupKeywords.test(trimmed)) {
      inSetupSection = true;
      continue;
    }

    if (inSetupSection) {
      if (/^#{1,3}\s/.test(trimmed) && !setupKeywords.test(trimmed)) {
        inSetupSection = false;
        continue;
      }
      // Extract code blocks and list items as instructions
      if (trimmed.startsWith('```') || trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\./.test(trimmed)) {
        const cleaned = trimmed.replace(/^```\w*|^[-*]\s+|^\d+\.\s+/, '').trim();
        if (cleaned && cleaned !== '```') {
          instructions.push(cleaned);
        }
      }
    }
  }

  return instructions.slice(0, 10);
}

function extractArchitectureNotes(content) {
  const notes = [];
  const lines = content.split('\n');
  const archKeywords = /^#{1,4}\s.*(architect|structure|overview|design|how it works|folder)/i;

  let inArchSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (archKeywords.test(trimmed)) {
      inArchSection = true;
      continue;
    }

    if (inArchSection) {
      if (/^#{1,3}\s/.test(trimmed) && !archKeywords.test(trimmed)) {
        inArchSection = false;
        continue;
      }
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('!')) {
        notes.push(trimmed);
      }
    }
  }

  return notes.slice(0, 8);
}
