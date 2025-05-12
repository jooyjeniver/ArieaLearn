const express = require('express');
const router = express.Router();
const emotionController = require('../controllers/emotionController');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/temp');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Routes
router.post('/analyze', emotionController.analyzeEmotion);
router.post('/analyze-upload', upload.single('image'), emotionController.analyzeEmotionFromUpload);
router.post('/compare', emotionController.compareEmotions);
router.post('/analyze-base64', emotionController.analyzeEmotionFromBase64);

module.exports = router; 