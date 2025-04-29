const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profileImage: {
    type: String,
    default: 'default-profile.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  progress: {
    completedModules: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    }],
    currentModule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    },
    completionPercentage: {
      type: Number,
      default: 0
    },
    // Quiz-related progress
    completedQuizzes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    }],
    quizStats: {
      totalAttempted: {
        type: Number,
        default: 0
      },
      totalPassed: {
        type: Number,
        default: 0
      },
      averageScore: {
        type: Number,
        default: 0
      },
      // Category-specific stats
      categoryProgress: [{
        category: {
          type: String,
          enum: [
            'Myself and My Family',
            'Our School and Community',
            'Good Habits and Citizenship',
            'My Environment',
            'Time and History',
            'Transport and Communication'
          ]
        },
        completed: {
          type: Number,
          default: 0
        },
        totalAvailable: {
          type: Number,
          default: 0
        },
        averageScore: {
          type: Number,
          default: 0
        }
      }]
    },
    streaks: {
      current: {
        type: Number,
        default: 0
      },
      best: {
        type: Number,
        default: 0
      },
      lastActivity: {
        type: Date,
        default: Date.now
      }
    }
  },
  awards: [{
    award: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Award'
    },
    dateEarned: {
      type: Date,
      default: Date.now
    },
    fromQuiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    }
  }],
  points: {
    total: {
      type: Number,
      default: 0
    },
    history: [{
      amount: Number,
      reason: String,
      date: {
        type: Date,
        default: Date.now
      }
    }]
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 