const Module = require('../models/Module');

// Get all modules
exports.getAllModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a module by ID
exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new module
exports.createModule = async (req, res) => {
  try {
    const newModule = new Module(req.body);
    const savedModule = await newModule.save();
    res.status(201).json(savedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a module
exports.updateModule = async (req, res) => {
  try {
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedModule) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(200).json(updatedModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a module
exports.deleteModule = async (req, res) => {
  try {
    const deletedModule = await Module.findByIdAndDelete(req.params.id);
    if (!deletedModule) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 