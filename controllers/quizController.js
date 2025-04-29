const Quiz = require('../models/Quiz');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const Award = require('../models/Award');
const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: `Quiz not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private (Admin)
exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    
    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Admin)
exports.updateQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: `Quiz not found with id of ${req.params.id}`
      });
    }
    
    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Admin)
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: `Quiz not found with id of ${req.params.id}`
      });
    }
    
    await quiz.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get quizzes by topic
// @route   GET /api/quizzes/topic/:topic
// @access  Public
exports.getQuizzesByTopic = async (req, res) => {
  try {
    const topic = req.params.topic;
    
    const quizzes = await Quiz.find({ topic });
    
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get quizzes by difficulty
// @route   GET /api/quizzes/difficulty/:level
// @access  Public
exports.getQuizzesByDifficulty = async (req, res) => {
  try {
    const difficulty = req.params.level;
    
    const quizzes = await Quiz.find({ difficulty });
    
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get quizzes by module
// @route   GET /api/quizzes/module/:moduleId
// @access  Public
exports.getQuizzesByModule = async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    
    const quizzes = await Quiz.find({ moduleId });
    
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add question to quiz
// @route   POST /api/quizzes/:id/questions
// @access  Private/Admin
exports.addQuestion = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }
    
    // Make sure user is quiz owner or admin
    if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this quiz'
      });
    }
    
    // Add question
    quiz.questions.push(req.body);
    
    await quiz.save();
    
    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private
exports.submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }
    
    const { answers, timeTaken } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide answers array'
      });
    }
    
    // Calculate score
    let score = 0;
    const maxScore = quiz.questions.length * 10; // Assuming each question is worth 10 points
    
    const processedAnswers = answers.map(answer => {
      const question = quiz.questions.id(answer.questionId);
      
      if (!question) {
        return {
          question: answer.questionId,
          selectedOption: answer.selectedOptionId,
          isCorrect: false
        };
      }
      
      const correctOption = question.options.find(option => option.isCorrect);
      const isCorrect = correctOption && correctOption._id.toString() === answer.selectedOptionId;
      
      if (isCorrect) {
        score += question.points || 10;
      }
      
      return {
        question: answer.questionId,
        selectedOption: answer.selectedOptionId,
        isCorrect
      };
    });
    
    const percentageScore = (score / maxScore) * 100;
    const passed = percentageScore >= quiz.passingScore;
    
    // Create quiz result
    const quizResult = await QuizResult.create({
      user: req.user._id,
      quiz: quiz._id,
      answers: processedAnswers,
      score,
      maxScore,
      percentageScore,
      timeTaken,
      passed
    });
    
    // Update user progress
    const user = await User.findById(req.user._id);
    
    if (!user.progress.completedQuizzes.includes(quiz._id) && passed) {
      user.progress.completedQuizzes.push(quiz._id);
    }
    
    // Update quiz stats
    user.progress.quizStats.totalAttempted += 1;
    
    if (passed) {
      user.progress.quizStats.totalPassed += 1;
    }
    
    // Calculate new average score
    const prevTotal = user.progress.quizStats.averageScore * (user.progress.quizStats.totalAttempted - 1);
    user.progress.quizStats.averageScore = (prevTotal + percentageScore) / user.progress.quizStats.totalAttempted;
    
    // Update category progress
    let categoryIndex = user.progress.quizStats.categoryProgress.findIndex(
      cat => cat.category === quiz.category
    );
    
    if (categoryIndex === -1) {
      // Create new category progress entry if it doesn't exist
      user.progress.quizStats.categoryProgress.push({
        category: quiz.category,
        completed: passed ? 1 : 0,
        totalAvailable: 1,
        averageScore: percentageScore
      });
    } else {
      // Update existing category progress
      const categoryProgress = user.progress.quizStats.categoryProgress[categoryIndex];
      if (passed) {
        categoryProgress.completed += 1;
      }
      
      // Recalculate average score for the category
      const totalQuizzesInCategory = await QuizResult.countDocuments({
        user: req.user._id,
        'quiz.category': quiz.category
      });
      
      if (totalQuizzesInCategory > 0) {
        const categoryScores = await QuizResult.find({
          user: req.user._id,
          'quiz.category': quiz.category
        }).select('percentageScore');
        
        const totalScore = categoryScores.reduce((acc, result) => acc + result.percentageScore, 0);
        categoryProgress.averageScore = totalScore / totalQuizzesInCategory;
      } else {
        categoryProgress.averageScore = percentageScore;
      }
      
      // Update categoryProgress
      user.progress.quizStats.categoryProgress[categoryIndex] = categoryProgress;
    }
    
    // Update streaks
    const today = new Date();
    const lastActivity = new Date(user.progress.streaks.lastActivity);
    
    // If the last activity was yesterday, increment streak
    if (
      today.getDate() - lastActivity.getDate() === 1 &&
      today.getMonth() === lastActivity.getMonth() &&
      today.getFullYear() === lastActivity.getFullYear()
    ) {
      user.progress.streaks.current += 1;
      
      // Update best streak if current is higher
      if (user.progress.streaks.current > user.progress.streaks.best) {
        user.progress.streaks.best = user.progress.streaks.current;
      }
    } 
    // If last activity was not yesterday and not today, reset streak
    else if (
      today.getDate() !== lastActivity.getDate() ||
      today.getMonth() !== lastActivity.getMonth() ||
      today.getFullYear() !== lastActivity.getFullYear()
    ) {
      user.progress.streaks.current = 1;
    }
    
    user.progress.streaks.lastActivity = today;
    
    // Award points
    user.points.total += score;
    user.points.history.push({
      amount: score,
      reason: `Completed quiz: ${quiz.title}`
    });
    
    // Check for awards
    const earnedAwards = await checkAndAssignAwards(user, quiz, quizResult);
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        quizResult,
        earnedAwards
      }
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to check and assign awards
async function checkAndAssignAwards(user, quiz, quizResult) {
  try {
    const earnedAwards = [];
    
    // Get eligible awards
    const eligibleAwards = await Award.find({
      isActive: true,
      $or: [
        { 'criteria.quizCategory': quiz.category },
        { 'criteria.quizCategory': 'all' }
      ]
    });
    
    for (const award of eligibleAwards) {
      let hasEarned = false;
      
      switch (award.criteria.type) {
        case 'quiz_score':
          if (quizResult.percentageScore >= award.criteria.value) {
            hasEarned = true;
          }
          break;
          
        case 'quiz_completion':
          if (user.progress.quizStats.totalPassed >= award.criteria.value) {
            hasEarned = true;
          }
          break;
          
        case 'streak':
          if (user.progress.streaks.current >= award.criteria.value) {
            hasEarned = true;
          }
          break;
          
        case 'time':
          if (quizResult.timeTaken <= award.criteria.value) {
            hasEarned = true;
          }
          break;
          
        case 'category_mastery':
          const categoryProgress = user.progress.quizStats.categoryProgress.find(
            cat => cat.category === quiz.category
          );
          
          if (categoryProgress && categoryProgress.completed >= award.criteria.value) {
            hasEarned = true;
          }
          break;
          
        default:
          break;
      }
      
      // Check if user already has this award
      const alreadyEarned = user.awards.some(a => a.award.toString() === award._id.toString());
      
      if (hasEarned && !alreadyEarned) {
        user.awards.push({
          award: award._id,
          fromQuiz: quiz._id
        });
        
        // Add points for earning the award
        user.points.total += award.pointsValue;
        user.points.history.push({
          amount: award.pointsValue,
          reason: `Earned award: ${award.name}`
        });
        
        earnedAwards.push(award);
      }
    }
    
    return earnedAwards;
  } catch (err) {
    console.error('Error checking and assigning awards:', err);
    return [];
  }
}

// Get quizzes by topic
exports.getQuizzesByTopic = async (req, res, next) => {
  const topicId = req.params.id;
  
  // Validate if topic exists
  const topic = await Topic.findById(topicId);
  if (!topic) {
    return next(new ErrorResponse(`Topic not found with id of ${topicId}`, 404));
  }
  
  // Find quizzes by topic ID
  const quizzes = await Quiz.find({ topic: topicId });
  
  res.status(200).json({
    success: true,
    count: quizzes.length,
    data: quizzes,
    topic: topic.name
  });
};

// Get quizzes by difficulty
exports.getQuizzesByDifficulty = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ difficulty: req.params.difficulty });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quizzes by module
exports.getQuizzesByModule = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ moduleId: req.params.moduleId });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Simple API to get all quizzes for testing purposes
exports.simpleGetAllQuizzes = async (req, res) => {
  try {
    // Use a more flexible query that doesn't rely on specific fields
    const quizzes = await Quiz.find({}).lean();
    
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
};

// Get quiz topics with their IDs
exports.getQuizTopics = async (req, res) => {
  try {
    // Try to get quizzes based on various schemas
    const quizzes = await Quiz.find().lean();
    
    // Map game types to readable topics
    const gameTypeMap = {
      "67fe578ba5894b82502ce111": "Science Quiz",
      "67fe578ba5894b82502ce112": "Math Masters", 
      "67fe578ba5894b82502ce113": "History Challenge",
      "67fe578ba5894b82502ce114": "General Knowledge"
    };

    // Categorize quizzes by their schema format
    const topicsMap = {};
    
    // Process quizzes and categorize them
    quizzes.forEach(quiz => {
      let topicName = "Uncategorized";
      let quizTitle = "Unknown Quiz";
      
      // Check if it's a game-type quiz
      if (quiz.gameType && gameTypeMap[quiz.gameType]) {
        topicName = gameTypeMap[quiz.gameType];
        quizTitle = quiz.question || "Unknown Question";
      } 
      // Check if it's a structured quiz with topic
      else if (quiz.topic) {
        topicName = quiz.topic;
        quizTitle = quiz.title || "Unknown Title";
      }
      
      // Initialize topic if not exists
      if (!topicsMap[topicName]) {
        topicsMap[topicName] = {
          topicId: quiz.gameType || topicName,
          name: topicName,
          quizzes: []
        };
      }
      
      // Add quiz to appropriate topic
      topicsMap[topicName].quizzes.push({
        id: quiz._id,
        title: quizTitle,
        difficulty: quiz.difficulty || "unknown"
      });
    });
    
    // Add AR Fundamentals topics (if not already included)
    if (!topicsMap["AR Fundamentals"]) {
      // Create a temporary model to query the AR quizzes which might be in a different collection
      const ARQuizSchema = new mongoose.Schema({}, { strict: false });
      const ARQuiz = mongoose.model('ARQuiz', ARQuizSchema, 'quizzes');
      
      // Find AR quizzes
      const arQuizzes = await ARQuiz.find({ topic: "AR Fundamentals" }).lean();
      
      if (arQuizzes && arQuizzes.length > 0) {
        topicsMap["AR Fundamentals"] = {
          topicId: "AR Fundamentals",
          name: "AR Fundamentals",
          quizzes: arQuizzes.map(quiz => ({
            id: quiz._id,
            title: quiz.title || "Unknown AR Quiz",
            difficulty: quiz.difficulty || "unknown"
          }))
        };
      }
    }
    
    // Add AR Development topic
    if (!topicsMap["AR Development"]) {
      topicsMap["AR Development"] = {
        topicId: "AR Development",
        name: "AR Development",
        quizzes: [
          {
            id: "ar-dev-1",
            title: "Advanced AR Development Concepts",
            difficulty: "advanced"
          }
        ]
      };
    }
    
    // Add 3D Modeling topic 
    if (!topicsMap["3D Modeling"]) {
      topicsMap["3D Modeling"] = {
        topicId: "3D Modeling",
        name: "3D Modeling",
        quizzes: [
          {
            id: "3d-model-1",
            title: "3D Modeling Basics for AR",
            difficulty: "intermediate"
          }
        ]
      };
    }
    
    // Convert map to array
    const topics = Object.values(topicsMap);

    // Return the data
    res.status(200).json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
};

exports.getQuizzesByTopicId = async (req, res) => {
  try {
    const topicName = req.params.topicName;
    
    // Find quizzes by topicId
    const quizzes = await Quiz.find({ topic: topicName }).lean();
    
    // If no quizzes found with the topicId
    if (quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No quizzes found for topic ID: ${topicId}`
      });
    }
    
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create a quiz for a specific topic
// @route   POST /api/topics/:id/quizzes
// @access  Private (Admin)
exports.addQuizToTopic = asyncHandler(async (req, res, next) => {
  const topicId = req.params.id;
  
  // Validate if topic exists
  const topic = await Topic.findById(topicId);
  if (!topic) {
    return next(new ErrorResponse(`Topic not found with id of ${topicId}`, 404));
  }
  
  // Add topic to request body
  req.body.topic = topicId;
  
  // Create quiz
  const quiz = await Quiz.create(req.body);
  
  res.status(201).json({
    success: true,
    data: quiz
  });
}); 