const mongoose = require('mongoose');

const aiReportSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The instructor who triggered the report
      required: true,
    },
    reportType: {
      type: String,
      enum: ['individual', 'batch', 'overall'],
      default: 'individual',
    },

    // ── AI-generated content ──
    engagementScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    summary: {
      type: String,
      required: true,
    },
    recommendations: {
      type: [String],
      default: [],
    },
    rawPrompt: {
      type: String, // The prompt sent to Gemini (audit trail)
    },
    rawResponse: {
      type: String, // Full Gemini response (audit trail)
    },

    // ── Data snapshot used for AI analysis ──
    dataSnapshot: {
      attendanceRate: Number,
      standupCount: Number,
      standupConsistency: Number,
      demoSubmissions: Number,
      avgMood: String,
      recentBlockers: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AIReport', aiReportSchema);
