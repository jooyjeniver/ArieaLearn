const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subject name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Subject name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  icon: {
    type: String,
    default: 'book'
  },
  color: {
    type: String,
    default: '#4CAF50'
  },
  order: {
    type: Number,
    required: [true, 'Please specify the subject order']
  },
  modules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subject', SubjectSchema);