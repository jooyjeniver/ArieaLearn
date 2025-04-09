const Module = require('../models/Module');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get user's overall progress
// @route   GET /api/progress
// @access  Private
const getOverallProgress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('progress');
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        success: true,
        data: user.progress
    });
});

// @desc    Update lesson progress
// @route   POST /api/progress/lesson
// @access  Private
const updateLessonProgress = asyncHandler(async (req, res) => {
    const { moduleId, lessonId, progress } = req.body;

    if (!moduleId || !lessonId || progress === undefined) {
        res.status(400);
        throw new Error('Please provide moduleId, lessonId, and progress');
    }

    const module = await Module.findById(moduleId);
    
    if (!module) {
        res.status(404);
        throw new Error('Module not found');
    }

    const lesson = module.lessons.id(lessonId);
    
    if (!lesson) {
        res.status(404);
        throw new Error('Lesson not found');
    }

    // Update lesson progress
    lesson.progress = progress;

    // Update user's progress
    const user = await User.findById(req.user.id);
    if (!user.progress) {
        user.progress = {};
    }
    if (!user.progress[moduleId]) {
        user.progress[moduleId] = {};
    }
    user.progress[moduleId][lessonId] = progress;

    await module.save();
    await user.save();

    res.status(200).json({
        success: true,
        data: {
            lessonProgress: lesson.progress,
            userProgress: user.progress[moduleId][lessonId]
        }
    });
});

// @desc    Add emotional data
// @route   POST /api/progress/emotional-data
// @access  Private
const addEmotionalData = asyncHandler(async (req, res) => {
    const { moduleId, lessonId, emotionalData } = req.body;

    if (!moduleId || !lessonId || !emotionalData) {
        res.status(400);
        throw new Error('Please provide moduleId, lessonId, and emotionalData');
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (!user.emotionalData) {
        user.emotionalData = {};
    }
    if (!user.emotionalData[moduleId]) {
        user.emotionalData[moduleId] = {};
    }
    if (!user.emotionalData[moduleId][lessonId]) {
        user.emotionalData[moduleId][lessonId] = [];
    }

    user.emotionalData[moduleId][lessonId].push({
        ...emotionalData,
        timestamp: Date.now()
    });

    await user.save();

    res.status(200).json({
        success: true,
        data: user.emotionalData[moduleId][lessonId]
    });
});

// @desc    Get emotional summary
// @route   GET /api/progress/emotional-summary
// @access  Private
const getEmotionalSummary = asyncHandler(async (req, res) => {
    const { moduleId, lessonId } = req.query;

    if (!moduleId || !lessonId) {
        res.status(400);
        throw new Error('Please provide moduleId and lessonId');
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const emotionalData = user.emotionalData?.[moduleId]?.[lessonId] || [];

    // Calculate emotional summary
    const summary = {
        totalEntries: emotionalData.length,
        averageEmotion: emotionalData.reduce((acc, curr) => acc + curr.emotion, 0) / emotionalData.length || 0,
        averageEngagement: emotionalData.reduce((acc, curr) => acc + curr.engagement, 0) / emotionalData.length || 0,
        averageFocus: emotionalData.reduce((acc, curr) => acc + curr.focus, 0) / emotionalData.length || 0,
        timeSpent: emotionalData.reduce((acc, curr) => acc + curr.duration, 0),
        lastUpdated: emotionalData.length > 0 ? emotionalData[emotionalData.length - 1].timestamp : null
    };

    res.status(200).json({
        success: true,
        data: summary
    });
});

module.exports = {
    getOverallProgress,
    updateLessonProgress,
    addEmotionalData,
    getEmotionalSummary
}; 