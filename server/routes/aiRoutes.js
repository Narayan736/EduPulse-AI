const express = require('express');
const router = express.Router();
const {
  generateReport,
  generateBatchReport,
  getReports,
  getReport,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { role } = require('../middleware/roleMiddleware');

// IMPORTANT: /report/batch must come BEFORE /report/:studentId
// to prevent Express from capturing "batch" as a studentId param.
router.post('/report/batch', protect, role('instructor'), generateBatchReport);
router.post('/report/:studentId', protect, role('instructor'), generateReport);
router.get('/reports', protect, role('instructor'), getReports);
router.get('/reports/:reportId', protect, role('instructor'), getReport);

module.exports = router;
