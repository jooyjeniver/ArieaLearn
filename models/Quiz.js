const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      options: [
        {
          text: String,
          isCorrect: Boolean,
        },
      ],
      explanation: String,
    },
  ],
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
  },
});

module.exports = mongoose.model('quizzes', QuizSchema); 