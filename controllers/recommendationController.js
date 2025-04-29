const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const aiService = require('../services/aiService');

/**
 * @desc    Get personalized learning recommendations
 * @route   GET /api/recommendations
 * @access  Private
 */
exports.getRecommendations = asyncHandler(async (req, res, next) => {
  // Get user quiz results
  const quizResults = await QuizResult.find({ user: req.user.id })
    .populate('quiz')
    .sort('-dateCompleted');
  
  if (!quizResults || quizResults.length === 0) {
    return next(new ErrorResponse('No quiz history found to generate recommendations', 404));
  }
  
  // Analyze performance by category
  const categoryPerformance = {};
  
  quizResults.forEach(result => {
    const category = result.quiz.category;
    
    if (!categoryPerformance[category]) {
      categoryPerformance[category] = {
        attempts: 0,
        totalScore: 0,
        averageScore: 0,
        weakAreas: [],
        strengths: []
      };
    }
    
    categoryPerformance[category].attempts += 1;
    categoryPerformance[category].totalScore += result.score;
    categoryPerformance[category].averageScore = 
      categoryPerformance[category].totalScore / categoryPerformance[category].attempts;
      
    // Analyze incorrect answers to identify weak areas
    result.answers.forEach(answer => {
      if (!answer.isCorrect) {
        const question = result.quiz.questions.find(q => 
          q._id.toString() === answer.question.toString());
          
        if (question && !categoryPerformance[category].weakAreas.includes(question.text)) {
          categoryPerformance[category].weakAreas.push(question.text);
        }
      } else {
        const question = result.quiz.questions.find(q => 
          q._id.toString() === answer.question.toString());
          
        if (question && !categoryPerformance[category].strengths.includes(question.text)) {
          categoryPerformance[category].strengths.push(question.text);
        }
      }
    });
  });
  
  // Find weakest and strongest categories
  let weakestCategory = null;
  let strongestCategory = null;
  let lowestAvg = 100;
  let highestAvg = 0;
  
  Object.entries(categoryPerformance).forEach(([category, performance]) => {
    if (performance.averageScore < lowestAvg) {
      lowestAvg = performance.averageScore;
      weakestCategory = category;
    }
    
    if (performance.averageScore > highestAvg) {
      highestAvg = performance.averageScore;
      strongestCategory = category;
    }
  });
  
  // Get relevant lessons for improvement
  let recommendedLessons = [];
  if (weakestCategory) {
    recommendedLessons = await Lesson.find({
      category: weakestCategory
    }).limit(3).sort('-createdAt');
  }
  
  // Get quizzes for practice in weak areas
  const recommendedQuizzes = await Quiz.find({
    category: weakestCategory
  }).limit(3).sort('-createdAt');
  
  // Get AI-based personalized recommendations
  const aiRecommendations = await aiService.getPersonalizedRecommendations({
    userData: {
      name: req.user.name,
      age: req.user.age || 'unknown',
      interests: req.user.interests || [],
      weakestCategory,
      strongestCategory,
      weakAreas: weakestCategory ? categoryPerformance[weakestCategory].weakAreas : [],
      strengths: strongestCategory ? categoryPerformance[strongestCategory].strengths : []
    }
  });
  
  res.status(200).json({
    success: true,
    data: {
      categoryPerformance,
      weakestCategory,
      strongestCategory,
      recommendedLessons,
      recommendedQuizzes,
      aiRecommendations
    }
  });
});

/**
 * @desc    Get learning path
 * @route   GET /api/recommendations/learning-path
 * @access  Private
 */
exports.getLearningPath = asyncHandler(async (req, res, next) => {
  // Get user's current progress and performance data
  const quizResults = await QuizResult.find({ user: req.user.id })
    .populate('quiz')
    .sort('-dateCompleted');
  
  // Get all available categories
  const categories = await Quiz.distinct('category');
  
  // Create a structured learning path
  const learningPath = categories.map(category => {
    // Filter quizzes for this category
    const categoryQuizzes = quizResults.filter(result => 
      result.quiz.category === category);
    
    // Calculate progress in this category
    const completedInCategory = categoryQuizzes.length;
    const averageScore = categoryQuizzes.length > 0 
      ? categoryQuizzes.reduce((sum, result) => sum + result.score, 0) / completedInCategory 
      : 0;
    
    // Determine mastery level
    let masteryLevel = 'Not Started';
    if (completedInCategory > 0) {
      if (averageScore >= 90) {
        masteryLevel = 'Expert';
      } else if (averageScore >= 75) {
        masteryLevel = 'Proficient';
      } else if (averageScore >= 60) {
        masteryLevel = 'Developing';
      } else {
        masteryLevel = 'Beginner';
      }
    }
    
    return {
      category,
      masteryLevel,
      progress: completedInCategory,
      averageScore,
      nextSteps: masteryLevel === 'Expert' 
        ? 'Continue to next category or help others' 
        : 'Complete more quizzes to improve mastery'
    };
  });
  
  // Sort learning path by mastery level (least mastered first)
  const masteryOrder = {
    'Not Started': 0,
    'Beginner': 1,
    'Developing': 2,
    'Proficient': 3,
    'Expert': 4
  };
  
  learningPath.sort((a, b) => 
    masteryOrder[a.masteryLevel] - masteryOrder[b.masteryLevel]);
  
  res.status(200).json({
    success: true,
    data: learningPath
  });
});

/**
 * @desc    Get achievement forecast
 * @route   GET /api/recommendations/achievements
 * @access  Private
 */
exports.getAchievementForecast = asyncHandler(async (req, res, next) => {
  // Get user's current awards
  const user = await User.findById(req.user.id).populate('awards');
  
  // Get all available awards
  const allAwards = await Award.find();
  
  // Filter out awards the user already has
  const userAwardIds = user.awards.map(award => award._id.toString());
  const potentialAwards = allAwards.filter(award => 
    !userAwardIds.includes(award._id.toString()));
  
  // Get user quiz results for progress tracking
  const quizResults = await QuizResult.find({ user: req.user.id });
  
  // Calculate progress towards each award
  const achievementForecast = potentialAwards.map(award => {
    let progress = 0;
    let remaining = 0;
    
    // Calculate progress based on award criteria
    switch (award.criteria.type) {
      case 'quiz_completion':
        const completedQuizzes = quizResults.length;
        progress = Math.min(100, (completedQuizzes / award.criteria.value) * 100);
        remaining = Math.max(0, award.criteria.value - completedQuizzes);
        break;
        
      case 'quiz_score':
        const perfectScores = quizResults.filter(result => 
          result.score === 100).length;
        progress = Math.min(100, (perfectScores / award.criteria.value) * 100);
        remaining = Math.max(0, award.criteria.value - perfectScores);
        break;
        
      case 'category_mastery':
        // Count completed quizzes in specific category
        const categoryResults = quizResults.filter(result => {
          // We'd need to populate quiz field to check category
          // This is simplified for the example
          return result.category === award.criteria.quizCategory;
        });
        progress = Math.min(100, (categoryResults.length / award.criteria.value) * 100);
        remaining = Math.max(0, award.criteria.value - categoryResults.length);
        break;
        
      // Add other criteria types as needed
      default:
        progress = 0;
        remaining = award.criteria.value;
    }
    
    return {
      award: {
        id: award._id,
        name: award.name,
        description: award.description,
        imageUrl: award.imageUrl,
        type: award.type,
        rarity: award.rarity
      },
      progress,
      remaining,
      estimatedCompletion: remaining <= 0 ? 'Ready to claim!' : `${remaining} more to go!`
    };
  });
  
  // Sort by progress (highest first)
  achievementForecast.sort((a, b) => b.progress - a.progress);
  
  res.status(200).json({
    success: true,
    data: achievementForecast
  });
});

module.exports = exports; 