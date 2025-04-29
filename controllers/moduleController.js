const Module = require('../models/Module');

// @desc    Get all modules
// @route   GET /api/modules
// @access  Public
exports.getAllModules = async (req, res) => {
  try {
    const modules = await Module.find();
    
    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single module
// @route   GET /api/modules/:id
// @access  Public
exports.getModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: `Module not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create new module
// @route   POST /api/modules
// @access  Private (Admin)
exports.createModule = async (req, res) => {
  try {
    const module = await Module.create(req.body);
    
    res.status(201).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update module
// @route   PUT /api/modules/:id
// @access  Private (Admin)
exports.updateModule = async (req, res) => {
  try {
    let module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: `Module not found with id of ${req.params.id}`
      });
    }
    
    module = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Delete module
// @route   DELETE /api/modules/:id
// @access  Private (Admin)
exports.deleteModule = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({
        success: false,
        message: `Module not found with id of ${req.params.id}`
      });
    }
    
    await module.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}; 