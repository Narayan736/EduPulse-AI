const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
  bulkMark,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { role } = require('../middleware/roleMiddleware');

router.post('/mark', protect, markAttendance);
router.get('/my', protect, getMyAttendance);
router.get('/all', protect, role('instructor'), getAllAttendance);
router.post('/bulk', protect, role('instructor'), bulkMark);

module.exports = router;
