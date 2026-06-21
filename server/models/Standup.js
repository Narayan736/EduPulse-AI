const mongoose = require('mongoose');

const standupSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: () => {
        const d = new Date();
        d.setUTCHours(0, 0, 0, 0);
        return d;
      },
    },
    yesterday: {
      type: String,
      required: [true, 'Yesterday update is required'],
      maxlength: 1000,
    },
    today: {
      type: String,
      required: [true, 'Today plan is required'],
      maxlength: 1000,
    },
    blockers: {
      type: String,
      default: 'None',
      maxlength: 1000,
    },
    mood: {
      type: String,
      enum: ['great', 'good', 'okay', 'struggling'],
      default: 'good',
    },
  },
  { timestamps: true }
);

// One standup per student per day
standupSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Standup', standupSchema);
