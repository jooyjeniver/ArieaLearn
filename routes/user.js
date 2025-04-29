const express = require('express');
const { 
  getUserProfile, 
  updateUserProfile
} = require('../controllers/usersController');

const {
  getUserProgress,
  getUserAwards,
  getQuizHistory
} = require('../controllers/progressController');

const { protect } = require('../middlewares/auth');
const { uploadProfile } = require('../middlewares/uploads');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', uploadProfile.single('profileImage'), updateUserProfile);

// User progress routes
router.get('/progress', getUserProgress);
router.get('/awards', getUserAwards);
router.get('/quiz-history', getQuizHistory);

module.exports = router; 