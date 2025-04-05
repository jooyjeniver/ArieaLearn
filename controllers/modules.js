const Module = require('../models/Module');
const Progress = require('../models/Progress');

// @desc    Get all modules
// @route   GET /api/modules
// @access  Private
exports.getModules = async (req, res, next) => {
  try {
    const modules = await Module.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single module
// @route   GET /api/modules/:id
// @access  Private
exports.getModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new module
// @route   POST /api/modules
// @access  Private/Admin
exports.createModule = async (req, res, next) => {
  try {
    // Add uploaded image if available
    if (req.file) {
      req.body.imageUrl = `/uploads/resources/${req.file.filename}`;
    }

    const module = await Module.create(req.body);

    res.status(201).json({
      success: true,
      data: module
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update module
// @route   PUT /api/modules/:id
// @access  Private/Admin
exports.updateModule = async (req, res, next) => {
  try {
    // Add uploaded image if available
    if (req.file) {
      req.body.imageUrl = `/uploads/resources/${req.file.filename}`;
    }

    const module = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete module
// @route   DELETE /api/modules/:id
// @access  Private/Admin
exports.deleteModule = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    await Module.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add resource to module
// @route   POST /api/modules/:id/resources
// @access  Private/Admin
exports.addResource = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    // Add resource
    const resource = {
      title: req.body.title,
      type: req.body.type
    };

    // Add file path if resource was uploaded
    if (req.file) {
      resource.url = `/uploads/resources/${req.file.filename}`;
    } else if (req.body.url) {
      resource.url = req.body.url;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Please provide a resource URL or upload a file'
      });
    }

    module.resources.push(resource);
    await module.save();

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add AR model to module
// @route   POST /api/modules/:id/models
// @access  Private/Admin
exports.addArModel = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    // Add AR model
    const arModel = {
      name: req.body.name,
      description: req.body.description || '',
      modelUrl: req.body.modelUrl || (req.file ? `/uploads/models/${req.file.filename}` : null)
    };

    if (!arModel.modelUrl) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a model URL or upload a model file'
      });
    }

    // Add textures if provided
    if (req.body.textures && Array.isArray(req.body.textures)) {
      arModel.textures = req.body.textures;
    }

    module.arModels.push(arModel);
    await module.save();

    res.status(200).json({
      success: true,
      data: module
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user progress for all modules
// @route   GET /api/modules/progress
// @access  Private
exports.getUserModuleProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user.id }).populate('module');

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user progress for a module
// @route   PUT /api/modules/:id/progress
// @access  Private
exports.updateUserModuleProgress = async (req, res, next) => {
  try {
    // Find module
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Module not found'
      });
    }

    // Find or create progress
    let progress = await Progress.findOne({
      user: req.user.id,
      module: req.params.id
    });

    if (progress) {
      // Update existing progress
      progress = await Progress.findOneAndUpdate(
        { user: req.user.id, module: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new progress
      progress = await Progress.create({
        user: req.user.id,
        module: req.params.id,
        ...req.body
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (err) {
    next(err);
  }
}; 