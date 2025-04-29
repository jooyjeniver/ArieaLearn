const Topic = require('../models/Topic');

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort('order name');
    
    res.status(200).json({
      success: true,
      count: topics.length,
      data: topics
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single topic
// @route   GET /api/topics/:id
// @access  Public
exports.getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: `Topic not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: topic
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Create new topic
// @route   POST /api/topics
// @access  Private (Admin)
exports.createTopic = async (req, res) => {
  try {
    const topic = await Topic.create(req.body);
    
    res.status(201).json({
      success: true,
      data: topic
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private (Admin)
exports.updateTopic = async (req, res) => {
  try {
    let topic = await Topic.findById(req.params.id);
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: `Topic not found with id of ${req.params.id}`
      });
    }
    
    topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: topic
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private (Admin)
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: `Topic not found with id of ${req.params.id}`
      });
    }
    
    await topic.deleteOne();
    
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