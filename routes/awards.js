const express = require('express');
const {
  getAwards,
  getAward,
  createAward,
  updateAward,
  deleteAward
} = require('../controllers/awardController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/', getAwards);
router.get('/:id', getAward);

// Admin-only routes
router.post('/', protect, authorize('admin'), createAward);
router.put('/:id', protect, authorize('admin'), updateAward);
router.delete('/:id', protect, authorize('admin'), deleteAward);

module.exports = router; 