const Module = require('../models/Module');

// @desc    Get all lessons
// @route   GET /api/lessons
// @access  Private
exports.getLessons = async (req, res, next) => {
  try {
    // Get all modules with their lessons
    const modules = await Module.find().sort({ order: 1 });
    console.log("lessones",modules);
    // Transform modules into the required format
    const lessons = modules.map(module => ({
      id: module._id.toString(),
      name: module.title,
      description: module.description,
      icon: module.icon || 'book-open-variant',
      color: module.color || '#4CAF50',
      lessons: module.lessons || []
    }));

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Private
exports.getLesson = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
      });
    }

    // Transform module into the required format
    const lesson = {
      id: module._id.toString(),
      name: module.title,
      description: module.description,
      icon: module.icon || 'book-open-variant',
      color: module.color || '#4CAF50',
      lessons: module.lessons || []
    };

    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new lesson
// @route   POST /api/lessons
// @access  Private/Admin
exports.createLesson = async (req, res, next) => {
  try {
    // Add uploaded image if available
    if (req.file) {
      req.body.imageUrl = `/uploads/resources/${req.file.filename}`;
    }

    // Create a new module with the lesson data
    const module = await Module.create({
      title: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
      color: req.body.color,
      order: req.body.order || 0,
      lessons: req.body.lessons || []
    });

    res.status(201).json({
      success: true,
      data: module
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Admin
exports.updateLesson = async (req, res, next) => {
  try {
    // Add uploaded image if available
    if (req.file) {
      req.body.imageUrl = `/uploads/resources/${req.file.filename}`;
    }

    // Update the module with the lesson data
    const module = await Module.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.name,
        description: req.body.description,
        icon: req.body.icon,
        color: req.body.color,
        order: req.body.order,
        lessons: req.body.lessons
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
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

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
exports.deleteLesson = async (req, res, next) => {
  try {
    const module = await Module.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        error: 'Lesson not found'
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