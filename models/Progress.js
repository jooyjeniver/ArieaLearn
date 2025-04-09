const mongoose = require('mongoose');

const EmotionalDataSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  emotion: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'neutral', 'surprised', 'fearful', 'disgusted'],
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  imageUrl: {
    type: String
  },
  notes: {
    type: String
  }
});

const LessonProgressSchema = new mongoose.Schema({
  lessonId: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  emotionalData: [EmotionalDataSchema]
});

const ModuleProgressSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  lessons: [LessonProgressSchema]
});

const ProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modules: [ModuleProgressSchema],
  totalTimeSpent: {
    type: Number, // in seconds
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  emotionalSummary: {
    happy: { type: Number, default: 0 },
    sad: { type: Number, default: 0 },
    angry: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    surprised: { type: Number, default: 0 },
    fearful: { type: Number, default: 0 },
    disgusted: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update emotional summary when new emotional data is added
ProgressSchema.methods.updateEmotionalSummary = function(emotion) {
  if (this.emotionalSummary[emotion] !== undefined) {
    this.emotionalSummary[emotion] += 1;
  }
  return this.save();
};

module.exports = mongoose.model('Progress', ProgressSchema); 