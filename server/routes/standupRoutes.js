const express = require('express');
const router = express.Router();
const {
  submitStandup,
  getMyStandups,
  getAllStandups,
} = require('../controllers/standupController');
const { protect } = require('../middleware/authMiddleware');
const { role } = require('../middleware/roleMiddleware');

router.post('/', protect, submitStandup);
router.get('/my', protect, getMyStandups);
router.get('/all', protect, role('instructor'), getAllStandups);

module.exports = router;
