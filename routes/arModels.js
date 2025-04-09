const express = require('express');
const { 
  getArModels,
  getArModel,
  createArModel,
  updateArModel,
  deleteArModel
} = require('../controllers/arModels');
const { protect, authorize } = require('../middlewares/auth');
const { uploadModel, uploadTexture } = require('../middlewares/uploads');
const multer = require('multer');

const router = express.Router();

// Setup multer to handle multiple file types
const uploadFiles = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
}).fields([
  { name: 'modelFile', maxCount: 1 },
  { name: 'previewImage', maxCount: 1 },
  { name: 'textures', maxCount: 5 }
]);

// Routes for all AR models
router.route('/')
  .get(protect, getArModels)
  .post(protect, authorize('admin'), uploadFiles, createArModel);

// Routes for specific AR model
router.route('/:id')
  .get(protect, getArModel)
  .put(protect, authorize('admin'), uploadFiles, updateArModel)
  .delete(protect, authorize('admin'), deleteArModel);

module.exports = router; 
 