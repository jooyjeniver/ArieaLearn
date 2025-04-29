const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId
    },
    selectedOption: {
      type: String
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  percentageScore: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number,  // in seconds
    required: true
  },
  passed: {
    type: Boolean,
    default: false
  },
  awardsEarned: [{
    type: {
      type: String,
      enum: ['star', 'badge', 'trophy', 'certificate'],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    imageUrl: {
      type: String
    }
  }],
  feedback: {
    type: String
  },
  attemptsCount: {
    type: Number,
    default: 1
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate streaks and progress statistics
QuizResultSchema.statics.getProgressStats = async function(userId) {
  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const stats = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    { 
      $group: {
        _id: null,
        totalQuizzes: { $sum: 1 },
        totalPassed: { $sum: { $cond: ["$passed", 1, 0] } },
        totalScore: { $sum: "$score" },
        maxPossibleScore: { $sum: "$maxScore" },
        todayQuizzes: {
          $sum: { 
            $cond: [
              { $gte: ["$completedAt", startOfToday] }, 
              1, 
              0
            ] 
          }
        },
        weekQuizzes: {
          $sum: { 
            $cond: [
              { $gte: ["$completedAt", startOfWeek] }, 
              1, 
              0
            ] 
          }
        },
        averageScore: { $avg: "$percentageScore" }
      }
    }
  ]);

  return stats[0] || {
    totalQuizzes: 0,
    totalPassed: 0,
    totalScore: 0,
    maxPossibleScore: 0,
    todayQuizzes: 0,
    weekQuizzes: 0,
    averageScore: 0
  };
};

module.exports = mongoose.model('QuizResult', QuizResultSchema); 