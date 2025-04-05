const ArModel = require('../models/ArModel');
const Module = require('../models/Module');
const path = require('path');
const fs = require('fs');

// @desc    Get all AR models
// @route   GET /api/armodels
// @access  Private
exports.getArModels = async (req, res, next) => {
  try {
    const arModels = await ArModel.find().populate('module', 'title');

    res.status(200).json({
      success: true,
      count: arModels.length,
      data: arModels
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single AR model
// @route   GET /api/armodels/:id
// @access  Private
exports.getArModel = async (req, res, next) => {
  try {
    const arModel = await ArModel.findById(req.params.id).populate('module', 'title');

    if (!arModel) {
      return res.status(404).json({
        success: false,
        error: 'AR model not found'
      });
    }

    res.status(200).json({
      success: true,
      data: arModel
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new AR model
// @route   POST /api/armodels
// @access  Private/Admin
exports.createArModel = async (req, res, next) => {
  try {
    // Check if module exists
    const module = await Module.findById(req.body.module);
    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    // Handle model file upload
    if (req.files && req.files.modelFile) {
      req.body.modelFile = `/uploads/models/${req.files.modelFile[0].filename}`;
    }

    // Handle preview image upload
    if (req.files && req.files.previewImage) {
      req.body.previewImage = `/uploads/resources/${req.files.previewImage[0].filename}`;
    }

    // Handle textures upload
    if (req.files && req.files.textures) {
      const textures = [];
      req.files.textures.forEach((file, index) => {
        textures.push({
          name: req.body.textureNames ? req.body.textureNames[index] : `Texture ${index + 1}`,
          textureFile: `/uploads/textures/${file.filename}`
        });
      });
      req.body.textures = textures;
    }

    const arModel = await ArModel.create(req.body);

    res.status(201).json({
      success: true,
      data: arModel
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update AR model
// @route   PUT /api/armodels/:id
// @access  Private/Admin
exports.updateArModel = async (req, res, next) => {
  try {
    let arModel = await ArModel.findById(req.params.id);

    if (!arModel) {
      return res.status(404).json({
        success: false,
        error: 'AR model not found'
      });
    }

    // Handle model file upload
    if (req.files && req.files.modelFile) {
      // Delete old file if exists
      if (arModel.modelFile && arModel.modelFile.startsWith('/uploads/')) {
        const oldFilePath = path.join(process.cwd(), arModel.modelFile);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      req.body.modelFile = `/uploads/models/${req.files.modelFile[0].filename}`;
    }

    // Handle preview image upload
    if (req.files && req.files.previewImage) {
      // Delete old image if exists
      if (arModel.previewImage && arModel.previewImage.startsWith('/uploads/')) {
        const oldFilePath = path.join(process.cwd(), arModel.previewImage);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      req.body.previewImage = `/uploads/resources/${req.files.previewImage[0].filename}`;
    }

    // Handle textures upload
    if (req.files && req.files.textures) {
      const textures = arModel.textures || [];
      
      // Add new textures
      req.files.textures.forEach((file, index) => {
        textures.push({
          name: req.body.textureNames ? req.body.textureNames[index] : `Texture ${textures.length + 1}`,
          textureFile: `/uploads/textures/${file.filename}`
        });
      });
      
      req.body.textures = textures;
    }

    arModel = await ArModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: arModel
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete AR model
// @route   DELETE /api/armodels/:id
// @access  Private/Admin
exports.deleteArModel = async (req, res, next) => {
  try {
    const arModel = await ArModel.findById(req.params.id);

    if (!arModel) {
      return res.status(404).json({
        success: false,
        error: 'AR model not found'
      });
    }

    // Delete model file
    if (arModel.modelFile && arModel.modelFile.startsWith('/uploads/')) {
      const modelFilePath = path.join(process.cwd(), arModel.modelFile);
      if (fs.existsSync(modelFilePath)) {
        fs.unlinkSync(modelFilePath);
      }
    }

    // Delete preview image
    if (arModel.previewImage && arModel.previewImage.startsWith('/uploads/')) {
      const previewImagePath = path.join(process.cwd(), arModel.previewImage);
      if (fs.existsSync(previewImagePath)) {
        fs.unlinkSync(previewImagePath);
      }
    }

    // Delete textures
    if (arModel.textures && arModel.textures.length > 0) {
      arModel.textures.forEach(texture => {
        if (texture.textureFile && texture.textureFile.startsWith('/uploads/')) {
          const texturePath = path.join(process.cwd(), texture.textureFile);
          if (fs.existsSync(texturePath)) {
            fs.unlinkSync(texturePath);
          }
        }
      });
    }

    await ArModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 