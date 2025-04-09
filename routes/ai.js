const express = require('express');
const {
    analyzeEmotion,
    generateQuiz,
    getPersonalizedRecommendations,
    generateGameStrategy
} = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// AI routes
router.post('/analyze-emotion', analyzeEmotion);
router.post('/quiz', generateQuiz);
router.get('/recommendations', getPersonalizedRecommendations);
router.post('/game-strategy', generateGameStrategy);

module.exports = router; 