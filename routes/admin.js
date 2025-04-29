const express = require('express');
const {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion
} = require('../controllers/quizController');

const {
  createAward,
  updateAward,
  deleteAward
} = require('../controllers/awardController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Apply protection and admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// Admin quiz routes
router.post('/quiz', createQuiz);
router.put('/quiz/:id', updateQuiz);
router.delete('/quiz/:id', deleteQuiz);
router.post('/quiz/:id/question', addQuestion);

// Admin award routes
router.post('/award', createAward);
router.put('/award/:id', updateAward);
router.delete('/award/:id', deleteAward);

module.exports = router; 