const express = require('express');
const { 
  getLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessons');
const { protect, authorize } = require('../middlewares/auth');
const { uploadResource } = require('../middlewares/uploads');

const router = express.Router();

// Routes for all lessons
router.route('/')
  .get(protect, getLessons)
  .post(protect, authorize('admin'), uploadResource.single('image'), createLesson);

// Routes for specific lesson
router.route('/:id')
  .get(protect, getLesson)
  .put(protect, authorize('admin'), uploadResource.single('image'), updateLesson)
  .delete(protect, authorize('admin'), deleteLesson);

module.exports = router; 