const User = require('../models/User');
const Progress = require('../models/Progress');
const path = require('path');
const fs = require('fs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    // Build update object
    const updateFields = {};
    
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.email) updateFields.email = req.body.email;

    // Handle profile image upload
    if (req.file) {
      // Delete old profile image if exists
      const user = await User.findById(req.user.id);
      if (user.profileImage && user.profileImage !== 'default-profile.jpg' && user.profileImage.startsWith('/uploads/')) {
        const oldImagePath = path.join(process.cwd(), user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      updateFields.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user progress summary
// @route   GET /api/users/progress
// @access  Private
exports.getUserProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('module', 'title order')
      .sort({ 'module.order': 1 });

    // Get completed modules
    const completedModules = progress.filter(p => p.completed).map(p => p.module._id);
    
    // Calculate completion percentage
    const completionPercentage = progress.length > 0 
      ? (progress.filter(p => p.completed).length / progress.length) * 100 
      : 0;

    // Get current module (first incomplete module)
    const currentModule = progress.find(p => !p.completed)?.module || null;

    // Update user progress data
    await User.findByIdAndUpdate(req.user.id, {
      progress: {
        completedModules,
        currentModule: currentModule?._id,
        completionPercentage
      }
    });

    res.status(200).json({
      success: true,
      data: {
        progress,
        completedModules,
        currentModule,
        completionPercentage
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete user's profile image if not default
    if (user.profileImage && user.profileImage !== 'default-profile.jpg' && user.profileImage.startsWith('/uploads/')) {
      const imagePath = path.join(process.cwd(), user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete user's progress records
    await Progress.deleteMany({ user: req.params.id });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 