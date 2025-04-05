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