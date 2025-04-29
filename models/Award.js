const mongoose = require('mongoose');

const AwardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['star', 'badge', 'trophy', 'certificate'],
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  category: {
    type: String,
    enum: [
      'achievement', // For completing specific goals
      'skill',       // For demonstrating knowledge in a subject
      'progress',    // For reaching milestones
      'special'      // For special events or limited-time awards
    ],
    required: true
  },
  criteria: {
    type: {
      type: String,
      enum: [
        'quiz_score',        // Based on quiz score
        'quiz_completion',   // Based on completing quizzes
        'streak',            // Based on daily/weekly streaks
        'time',              // Based on time to complete
        'category_mastery'   // Based on mastering a category
      ],
      required: true
    },
    value: {
      type: Number, // The threshold value to earn this award
      required: true
    },
    quizCategory: {
      type: String, // If this award is specific to a quiz category
      enum: [
        'Myself and My Family',
        'Our School and Community',
        'Good Habits and Citizenship',
        'My Environment',
        'Time and History',
        'Transport and Communication',
        'all'
      ],
      default: 'all'
    }
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  pointsValue: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Award', AwardSchema); 