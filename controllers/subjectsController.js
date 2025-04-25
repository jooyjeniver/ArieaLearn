const Subject = require('../models/Subject');
const Module = require('../models/Module');

// @desc    Get all subjects with their modules
// @route   GET /api/v1/subjects
// @access  Public
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('modules')
      .sort('order');

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single subject
// @route   GET /api/v1/subjects/:id
// @access  Public
exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('modules');

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get modules by subject
// @route   GET /api/v1/subjects/:id/modules
// @access  Public
exports.getSubjectModules = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('modules');

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      count: subject.modules.length,
      data: subject.modules
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};