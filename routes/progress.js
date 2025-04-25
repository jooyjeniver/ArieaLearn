const express = require('express');
const {
    getOverallProgress,
    updateLessonProgress,
    addEmotionalData,
    getEmotionalSummary
} = require('../controllers/progressController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get overall progress
router.get('/', getOverallProgress);

// Update lesson progress
router.post('/lesson', updateLessonProgress);

// Emotional data routes
router.post('/emotional-data', addEmotionalData);
router.get('/emotional-summary', getEmotionalSummary);

module.exports = router; 