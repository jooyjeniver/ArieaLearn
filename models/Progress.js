const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  quizScore: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can have only one progress entry per module
ProgressSchema.index({ user: 1, module: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema); 