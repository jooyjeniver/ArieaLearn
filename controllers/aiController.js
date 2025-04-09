const aiService = require('../services/aiService');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Module = require('../models/Module');

// @desc    Analyze emotion from text and optional image
// @route   POST /api/ai/analyze-emotion
// @access  Private
exports.analyzeEmotion = asyncHandler(async (req, res) => {
    const { text, imageUrl } = req.body;

    if (!text) {
        res.status(400);
        throw new Error('Please provide text to analyze');
    }

    const analysis = await aiService.analyzeEmotion(text, imageUrl);

    // If user is authenticated, store the emotional data
    if (req.user) {
        const user = await User.findById(req.user.id);
        if (user) {
            if (!user.emotionalHistory) {
                user.emotionalHistory = [];
            }
            user.emotionalHistory.push({
                timestamp: new Date(),
                text,
                imageUrl,
                analysis
            });
            await user.save();
        }
    }

    res.status(200).json({
        success: true,
        data: analysis
    });
});

// @desc    Generate a quiz for a specific topic
// @route   POST /api/ai/quiz
// @access  Private
exports.generateQuiz = asyncHandler(async (req, res) => {
    const { topic, difficulty, numberOfQuestions } = req.body;

    if (!topic || !difficulty) {
        res.status(400);
        throw new Error('Please provide topic and difficulty');
    }

    const quiz = await aiService.generateQuiz(topic, difficulty, numberOfQuestions);

    res.status(200).json({
        success: true,
        data: quiz
    });
});

// @desc    Get personalized recommendations
// @route   GET /api/ai/recommendations
// @access  Private
exports.getPersonalizedRecommendations = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate('progress')
        .select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Get user's learning history
    const learningHistory = await Module.find({
        '_id': { $in: Object.keys(user.progress || {}) }
    }).select('title description');

    const recommendations = await aiService.generatePersonalizedRecommendations(
        {
            id: user._id,
            preferences: user.preferences,
            skillLevel: user.skillLevel
        },
        learningHistory
    );

    res.status(200).json({
        success: true,
        data: recommendations
    });
});

// @desc    Generate game strategy
// @route   POST /api/ai/game-strategy
// @access  Private
exports.generateGameStrategy = asyncHandler(async (req, res) => {
    const { gameType } = req.body;

    if (!gameType) {
        res.status(400);
        throw new Error('Please provide gameType');
    }

    const user = await User.findById(req.user.id).select('skillLevel');
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const strategy = await aiService.generateGameStrategy(gameType, user.skillLevel);

    res.status(200).json({
        success: true,
        data: strategy
    });
}); 