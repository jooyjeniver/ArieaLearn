const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  content: {
    type: String,
    required: [true, 'Please add content for the module']
  },
  order: {
    type: Number,
    required: [true, 'Please specify the module order']
  },
  imageUrl: {
    type: String
  },
  icon: {
    type: String,
    default: 'book-open-variant'
  },
  color: {
    type: String,
    default: '#4CAF50'
  },
  lessons: [{
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    progress: {
      type: Number,
      default: 0
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    icon: {
      type: String
    },
    subject: {
      type: String,
      required: true
    },
    arEnabled: {
      type: Boolean,
      default: false
    },
    learningObjectives: [{
      type: String
    }],
    keyConcepts: [{
      type: String
    }],
    activities: [{
      type: String
    }],
    vocabulary: [{
      type: String
    }]
  }],
  arModels: [{
    name: {
      type: String,
      required: true
    },
    modelUrl: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    textures: [{
      type: String
    }]
  }],
  resources: [{
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pdf', 'video', 'link', 'image'],
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  quizzes: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Module', ModuleSchema); 