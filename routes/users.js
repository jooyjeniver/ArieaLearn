const express = require('express');
const { 
  getUserProfile, 
  updateUserProfile, 
  getUserProgress,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/users');
const { protect, authorize } = require('../middlewares/auth');
const { uploadProfile } = require('../middlewares/uploads');

const router = express.Router();

// User routes for all authenticated users
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, uploadProfile.single('profileImage'), updateUserProfile);
router.get('/progress', protect, getUserProgress);

// Admin only routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router; 