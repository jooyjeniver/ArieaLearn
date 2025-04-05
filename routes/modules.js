const express = require('express');
const { 
  getModules,
  getModule,
  createModule,
  updateModule,
  deleteModule,
  addResource,
  addArModel,
  getUserModuleProgress,
  updateUserModuleProgress
} = require('../controllers/modules');
const { protect, authorize } = require('../middlewares/auth');
const { uploadResource } = require('../middlewares/uploads');

const router = express.Router();

// Get user progress for all modules
router.get('/progress', protect, getUserModuleProgress);

// Routes for all modules
router.route('/')
  .get(protect, getModules)
  .post(protect, authorize('admin'), uploadResource.single('image'), createModule);

// Routes for specific module
router.route('/:id')
  .get(protect, getModule)
  .put(protect, authorize('admin'), uploadResource.single('image'), updateModule)
  .delete(protect, authorize('admin'), deleteModule);

// Routes for module resources
router.post('/:id/resources', 
  protect, 
  authorize('admin'), 
  uploadResource.single('resourceFile'), 
  addResource
);

// Routes for module AR models
router.post('/:id/models', 
  protect, 
  authorize('admin'), 
  uploadResource.single('modelFile'), 
  addArModel
);

// Routes for user module progress
router.put('/:id/progress', protect, updateUserModuleProgress);

module.exports = router; 