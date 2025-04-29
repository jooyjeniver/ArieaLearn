const Module = require('../models/Module');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const QuizResult = require('../models/QuizResult');
const Award = require('../models/Award');

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

// @desc    Get user's quiz progress and stats
// @route   GET /api/user/progress
// @access  Private
const getUserProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'progress.completedQuizzes',
        select: 'title category description'
      })
      .populate({
        path: 'awards.award',
        select: 'name type description imageUrl category rarity pointsValue'
      });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Get additional stats from quiz results
    const quizStats = await QuizResult.getProgressStats(req.user.id);
    
    // Get recent quiz results
    const recentResults = await QuizResult.find({ user: req.user.id })
      .populate({
        path: 'quiz',
        select: 'title category'
      })
      .sort('-completedAt')
      .limit(5);
    
    // Format the response data
    const progressData = {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      },
      stats: {
        totalPoints: user.points.total,
        quizStats: {
          ...user.progress.quizStats,
          ...quizStats
        },
        streaks: user.progress.streaks
      },
      awards: user.awards.map(award => ({
        id: award.award._id,
        name: award.award.name,
        type: award.award.type,
        description: award.award.description,
        imageUrl: award.award.imageUrl,
        category: award.award.category,
        rarity: award.award.rarity,
        pointsValue: award.award.pointsValue,
        dateEarned: award.dateEarned
      })),
      completedQuizzes: user.progress.completedQuizzes.map(quiz => ({
        id: quiz._id,
        title: quiz.title,
        category: quiz.category,
        description: quiz.description
      })),
      recentActivity: recentResults.map(result => ({
        id: result._id,
        quiz: {
          id: result.quiz._id,
          title: result.quiz.title,
          category: result.quiz.category
        },
        score: result.percentageScore,
        passed: result.passed,
        completedAt: result.completedAt
      }))
    };
    
    res.status(200).json({
      success: true,
      data: progressData
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's awards
// @route   GET /api/user/awards
// @access  Private
const getUserAwards = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'awards.award',
      select: 'name type description imageUrl category rarity pointsValue'
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const awards = user.awards.map(award => ({
      id: award.award._id,
      name: award.award.name,
      type: award.award.type,
      description: award.award.description,
      imageUrl: award.award.imageUrl,
      category: award.award.category,
      rarity: award.award.rarity,
      pointsValue: award.award.pointsValue,
      dateEarned: award.dateEarned
    }));
    
    // Group awards by type
    const awardsByType = {};
    
    awards.forEach(award => {
      if (!awardsByType[award.type]) {
        awardsByType[award.type] = [];
      }
      awardsByType[award.type].push(award);
    });
    
    res.status(200).json({
      success: true,
      count: awards.length,
      data: {
        all: awards,
        byType: awardsByType
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's quiz history
// @route   GET /api/user/quiz-history
// @access  Private
const getQuizHistory = async (req, res, next) => {
  try {
    let query = { user: req.user.id };
    
    // Add category filter if provided
    if (req.query.category) {
      const results = await QuizResult.find(query)
        .populate({
          path: 'quiz',
          select: 'title category description'
        });
      
      // Filter results by category (since we can't directly query the populated field)
      const filteredResults = results.filter(result => 
        result.quiz && result.quiz.category === req.query.category
      );
      
      return res.status(200).json({
        success: true,
        count: filteredResults.length,
        data: filteredResults
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await QuizResult.countDocuments(query);
    
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    const quizResults = await QuizResult.find(query)
      .populate({
        path: 'quiz',
        select: 'title category description'
      })
      .sort('-completedAt')
      .skip(startIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: quizResults.length,
      pagination,
      data: quizResults
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const timespan = req.query.timespan || 'all';
    const category = req.query.category || 'all';
    const limit = parseInt(req.query.limit, 10) || 10;
    
    let dateFilter = {};
    const now = new Date();
    
    // Set date filter based on timespan
    switch (timespan) {
      case 'day':
        dateFilter = {
          completedAt: {
            $gte: new Date(now.setHours(0, 0, 0, 0))
          }
        };
        break;
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        dateFilter = {
          completedAt: {
            $gte: startOfWeek
          }
        };
        break;
      case 'month':
        const startOfMonth = new Date(now);
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        dateFilter = {
          completedAt: {
            $gte: startOfMonth
          }
        };
        break;
      default:
        dateFilter = {};
    }
    
    // Add category filter if provided and not 'all'
    let categoryPipeline = [];
    if (category !== 'all') {
      categoryPipeline = [
        {
          $lookup: {
            from: 'quizzes',
            localField: 'quiz',
            foreignField: '_id',
            as: 'quizData'
          }
        },
        {
          $match: {
            'quizData.category': category
          }
        }
      ];
    }
    
    const leaderboard = await QuizResult.aggregate([
      {
        $match: dateFilter
      },
      ...categoryPipeline,
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          totalQuizzes: { $sum: 1 },
          averageScore: { $avg: '$percentageScore' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 1,
          name: '$userDetails.name',
          profileImage: '$userDetails.profileImage',
          totalScore: 1,
          totalQuizzes: 1,
          averageScore: 1
        }
      },
      {
        $sort: { totalScore: -1 }
      },
      {
        $limit: limit
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user progress
// @route   PUT /api/progress/user
// @access  Private
const updateUserProgress = async (req, res, next) => {
  try {
    const { moduleId, progress } = req.body;
    
    if (!moduleId || progress === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Please provide moduleId and progress'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Initialize progress object if it doesn't exist
    if (!user.progress) {
      user.progress = {};
    }
    
    // Update module progress
    user.progress[moduleId] = progress;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user.progress
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get module progress
// @route   GET /api/progress/module/:id
// @access  Private
const getModuleProgress = async (req, res, next) => {
  try {
    const moduleId = req.params.id;
    
    if (!moduleId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide module ID'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const moduleProgress = user.progress ? user.progress[moduleId] : null;
    
    res.status(200).json({
      success: true,
      data: moduleProgress || 0
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
    getOverallProgress,
    updateLessonProgress,
    addEmotionalData,
    getEmotionalSummary,
    getUserProgress,
    getUserAwards,
    getQuizHistory,
    getLeaderboard,
    updateUserProgress,
    getModuleProgress
}; 