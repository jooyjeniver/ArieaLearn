const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a topic name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Topic name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  iconUrl: {
    type: String,
    default: '/uploads/icons/default-topic.png'
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Topic', TopicSchema); 