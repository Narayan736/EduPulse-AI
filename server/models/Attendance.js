const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
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
        // Normalize to midnight UTC for clean date grouping
        const d = new Date();
        d.setUTCHours(0, 0, 0, 0);
        return d;
      },
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present',
    },
    markedBy: {
      type: String,
      enum: ['self', 'instructor'],
      default: 'self',
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance for the same student on the same day
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
