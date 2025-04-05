const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create storage directory if it doesn't exist
const createStoragePath = (storagePath) => {
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }
  return storagePath;
};

// Setup storage for profile images
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const storagePath = './uploads/profiles';
    cb(null, createStoragePath(storagePath));
  },
  filename: function (req, file, cb) {
    cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Setup storage for 3D models
const modelStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const storagePath = './uploads/models';
    cb(null, createStoragePath(storagePath));
  },
  filename: function (req, file, cb) {
    cb(null, `model-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Setup storage for model textures
const textureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const storagePath = './uploads/textures';
    cb(null, createStoragePath(storagePath));
  },
  filename: function (req, file, cb) {
    cb(null, `texture-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Setup storage for educational resources
const resourceStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const storagePath = './uploads/resources';
    cb(null, createStoragePath(storagePath));
  },
  filename: function (req, file, cb) {
    cb(null, `resource-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File type check
const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed`), false);
    }
  };
};

// Setup upload for profile images
exports.uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter(['.jpg', '.jpeg', '.png'])
});

// Setup upload for 3D models
exports.uploadModel = multer({
  storage: modelStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: fileFilter(['.glb', '.gltf', '.obj', '.usdz'])
});

// Setup upload for textures
exports.uploadTexture = multer({
  storage: textureStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter(['.jpg', '.jpeg', '.png', '.bmp'])
});

// Setup upload for resources
exports.uploadResource = multer({
  storage: resourceStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: fileFilter(['.pdf', '.jpg', '.jpeg', '.png', '.mp4'])
}); 