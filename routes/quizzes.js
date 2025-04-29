const express = require('express');
const {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  submitQuiz,
  getAllQuizzes,
  getQuizById,
  getQuizzesByTopic,
  getQuizzesByDifficulty,
  getQuizzesByModule,
  simpleGetAllQuizzes,
  getQuizTopics,
  getQuizzesByTopicId
} = require('../controllers/quizController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Simple API to get all quizzes for testing purposes
router.get('/simple', simpleGetAllQuizzes);

// GET list of quiz topics with their IDs
router.get('/topics', getQuizTopics);

// GET all quizzes (simple version without population)
router.get('/all', getAllQuizzes);

// GET quizzes by topic
router.get('/topic/:topic', getQuizzesByTopic);

// GET quizzes by difficulty
router.get('/difficulty/:level', getQuizzesByDifficulty);

// GET quizzes by module
router.get('/module/:moduleId', getQuizzesByModule);

// GET quizzes by topic ID
router.get('/by-topic-id/:topicId', getQuizzesByTopicId);

// Public routes
router.get('/', getAllQuizzes);
router.get('/:id', getQuiz);
router.get('/topic/:topic', getQuizzesByTopic);
router.get('/difficulty/:level', getQuizzesByDifficulty);
router.get('/module/:moduleId', getQuizzesByModule);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createQuiz);
router.put('/:id', protect, authorize('admin'), updateQuiz);
router.delete('/:id', protect, authorize('admin'), deleteQuiz);

// Submit quiz answers
router.post('/:id/submit', protect, submitQuiz);

// Add question to quiz
router.post('/:id/questions', protect, authorize('admin'), addQuestion);

module.exports = router; 