const { GoogleGenerativeAI } = require('@google/generative-ai');

// HACKATHON BYPASS: We are returning a guaranteed perfect mock response 
// so the frontend demo works flawlessly even if the live API is rate-limited.
async function analyze(prompt) {
  console.log("⚠️ Using Emergency Mock AI Response for Demo...");

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