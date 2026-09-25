const { GoogleGenAI } = require('@google/genai');

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello'
    });
    console.log('gemini-2.5-flash works!');
  } catch (e) {
    console.error('gemini-2.5-flash error:', e.message);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Hello'
    });
    console.log('gemini-1.5-flash works!');
  } catch (e) {
    console.error('gemini-1.5-flash error:', e.message);
  }
}

test();
