const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const quizController = require('../controllers/quizController');

// Topic routes
router.route('/')
  .get(topicController.getAllTopics)
  .post(topicController.createTopic);

router.route('/:id')
  .get(topicController.getTopic)
  .put(topicController.updateTopic)
  .delete(topicController.deleteTopic);

// Get quizzes for a specific topic
router.get('/:id/quizzes', quizController.getQuizzesByTopic);

// Add a quiz to a topic
router.post('/:id/quizzes', quizController.addQuizToTopic);

module.exports = router; 