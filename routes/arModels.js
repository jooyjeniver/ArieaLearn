const express = require('express');
const { 
  getArModels,
  getArModel,
  createArModel,
  updateArModel,
  deleteArModel
} = require('../controllers/arController');
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
  .get(getArModels)
  .post(protect, authorize('admin'), uploadFiles, createArModel);

// Add a route for samples - IMPORTANT: This must be defined BEFORE the :id route
router.get('/samples', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      {
        id: 1,
        name: 'Human Heart 3D Model',
        description: 'Interactive 3D model of the human heart for anatomy lessons',
        modelFile: '/uploads/models/human-heart.glb',
        previewImage: '/uploads/resources/heart-preview.jpg',
      },
      {
        id: 2,
        name: 'Solar System 3D Model',
        description: 'Interactive 3D model of our solar system with all planets',
        modelFile: '/uploads/models/solar-system.glb',
        previewImage: '/uploads/resources/solar-system-preview.jpg',
      },
      {
        id: 3,
        name: 'Family Tree 3D Model',
        description: 'Identify family members and understand relationships within a family',
        modelFile: '/uploads/models/family-tree.glb',
        previewImage: '/uploads/resources/family-tree.png',
      }
    ]
  });
});

// Route for getting model by simple numeric ID (for mobile app)
router.get('/simple/:simpleId', (req, res) => {
  const simpleId = parseInt(req.params.simpleId);
  
  // Map of simple IDs to model data
  const models = {
    1: {
      id: 1,
      name: 'Human Heart 3D Model',
      description: 'Interactive 3D model of the human heart for anatomy lessons',
      modelFile: '/uploads/models/human-heart.glb',
      previewImage: '/uploads/resources/heart-preview.jpg',
      scale: { x: 1.0, y: 1.0, z: 1.0 },
      rotation: { x: 0, y: 0, z: 0 }
    },
    2: {
      id: 2,
      name: 'Solar System 3D Model',
      description: 'Interactive 3D model of our solar system with all planets',
      modelFile: '/uploads/models/solar-system.glb',
      previewImage: '/uploads/resources/solar-system-preview.jpg',
      scale: { x: 0.5, y: 0.5, z: 0.5 },
      rotation: { x: 0, y: 0, z: 0 }
    },
    3: {
      id: 3,
      name: 'Family Tree 3D Model',
      description: 'Identify family members and understand relationships within a family',
      modelFile: '/uploads/models/family-tree.glb',
      previewImage: '/uploads/resources/family-tree.png',
      scale: { x: 1.0, y: 1.0, z: 1.0 },
      rotation: { x: 0, y: 0, z: 0 }
    }
  };
  
  const model = models[simpleId];
  
  if (!model) {
    return res.status(404).json({
      success: false,
      error: 'Model not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: model
  });
});

// Routes for specific AR model
router.route('/:id')
  .get(getArModel)
  .put(protect, authorize('admin'), uploadFiles, updateArModel)
  .delete(protect, authorize('admin'), deleteArModel);

module.exports = router; 
 