const express = require('express');
const router = express.Router();
const {
  submitDemo,
  getMyDemos,
  getAllDemos,
  reviewDemo,
} = require('../controllers/demoController');
const { protect } = require('../middleware/authMiddleware');
const { role } = require('../middleware/roleMiddleware');

router.post('/', protect, submitDemo);
router.get('/my', protect, getMyDemos);
router.get('/all', protect, role('instructor'), getAllDemos);
router.put('/:id/review', protect, role('instructor'), reviewDemo);

module.exports = router;
