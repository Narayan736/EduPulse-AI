const mongoose = require('mongoose');

const demoSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000,
    },
    repoUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\//, 'Must be a valid URL'],
    },
    deployedUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'in-review', 'reviewed', 'approved', 'needs-revision'],
      default: 'submitted',
    },
    feedback: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Demo', demoSchema);
