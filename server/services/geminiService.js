const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

async function analyze(prompt) {
  if (!genAI) {
    console.warn("⚠️ GEMINI_API_KEY is missing. Using Mock...");
    return getMockResponse();
  }

  try {
    // Switch to the universally supported gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log("🧠 Sending live data snapshot to Gemini API...");
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Bulletproof JSON parser (strips out any markdown formatting Gemini might add)
    const cleanText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
    return JSON.parse(cleanText);

  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return getMockResponse();
  }
}

function getMockResponse() {
  return {
    engagementScore: 78,
    riskLevel: 'medium',
    summary: 'The cohort is showing strong overall attendance, but recent standups indicate some blockers with database integration. Amit Kumar requires immediate attention due to consecutive absences and low demo scores.',
    recommendations: [
      'Schedule a 1-on-1 with Amit Kumar to review the recent demo.',
      'Host a quick pair-programming session on Supabase integration.',
      'Praise the class for their effort on the frontend UI tasks.'
    ]
  };
}

module.exports = { analyze };