const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const { protect, authorize } = require('../middlewares/auth');

// Import Quiz model for module-quiz operations
let Quiz;
try {
  Quiz = require('../models/Quiz');
} catch (error) {
  console.log('Quiz model not available for module routes');
}

// Module routes
router.route('/')
  .get(moduleController.getAllModules)
  .post(protect, authorize('admin'), moduleController.createModule);

router.route('/:id')
  .get(moduleController.getModule)
  .put(protect, authorize('admin'), moduleController.updateModule)
  .delete(protect, authorize('admin'), moduleController.deleteModule);

// Get quizzes for a specific module
router.get('/:id/quizzes', async (req, res) => {
  try {
    if (!Quiz) {
      return res.status(501).json({
        success: false,
        message: 'Quiz functionality not implemented'
      });
    }
    
    const moduleId = req.params.id;
    const quizzes = await Quiz.find({ moduleId });
    
    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add a quiz to a module
router.post('/:id/quizzes', protect, authorize('admin'), async (req, res) => {
  try {
    if (!Quiz) {
      return res.status(501).json({
        success: false,
        message: 'Quiz functionality not implemented'
      });
    }
    
    // Add the module ID to the quiz data
    req.body.moduleId = req.params.id;
    
    // Create the quiz
    const quiz = await Quiz.create(req.body);
    
    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 