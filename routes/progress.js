const express = require('express');
const {
    getOverallProgress,
    updateLessonProgress,
    addEmotionalData,
    getEmotionalSummary,
    getUserProgress,
    getUserAwards,
    getQuizHistory,
    getLeaderboard
} = require('../controllers/progressController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get overall progress
router.get('/', getOverallProgress);

// Update lesson progress
router.put('/lesson/:id', updateLessonProgress);

// Emotional data routes
router.post('/emotional', addEmotionalData);
router.get('/emotional/summary', getEmotionalSummary);

// Quiz-related progress routes
router.get('/quiz', getUserProgress);
router.get('/awards', getUserAwards);
router.get('/quiz-history', getQuizHistory);

// Leaderboard route (doesn't require authentication)
router.get('/leaderboard', getLeaderboard);

module.exports = router; 