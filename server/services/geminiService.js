const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API client using Render's environment variables
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

async function analyze(prompt) {
  // Safe fallback if you forgot to add the key to Render
  if (!genAI) {
    console.warn("⚠️ GEMINI_API_KEY is missing in environment variables. Using Emergency Mock AI Response...");
    return getMockResponse();
  }

  try {
    // Using gemini-1.5-flash for lightning-fast analysis
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // Force the model to output structured JSON so JSON.parse() doesn't fail
      generationConfig: { responseMimeType: "application/json" }
    });

    console.log("🧠 Sending live data snapshot to Gemini API...");
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the string from Gemini into a real JavaScript object
    return JSON.parse(responseText);

  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    console.warn("⚠️ Falling back to Emergency Mock AI Response to keep demo alive...");
    return getMockResponse();
  }
}

// Your original mock data kept safely as a fallback system
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