require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
  const pr = { title: 'Update README', body: 'Fixed typos' };
  const files = [{ filename: 'README.md' }];
  const commits = [{ message: 'fix typo' }];

  const prompt = `
You are an expert Senior Software Engineer performing a semantic review of a Pull Request.
Analyze the following Pull Request details and provide a semantic readiness assessment.
Respond EXACTLY in JSON format matching this schema:
{
  "changeIntent": "string (Short badge like 'Feature', 'Bugfix', 'Refactor', 'Chore')",
  "behavioralImpact": "string (1-2 sentences summarizing what this actually changes functionally)",
  "riskSignals": ["string", "string"],
  "reviewFocus": ["string", "string"]
}

PR Title: ${pr.title}
PR Body: ${pr.body}
Changed Files: ${files.map(f => f.filename).join(', ')}
Commits: ${commits.map(c => c.message).join(' | ')}
    `;

  try {
    const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    let rawText = response.text.trim();
    console.log('Raw text:', rawText);
    if (rawText.startsWith('\`\`\`json')) {
      rawText = rawText.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    }
    console.log('Parsed:', JSON.parse(rawText));
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
