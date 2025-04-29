const Award = require('../models/Award');

// @desc    Get all awards
// @route   GET /api/awards
// @access  Public
exports.getAwards = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Award.find(JSON.parse(queryStr));
    
    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('rarity type name');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Award.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const awards = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    // Group awards by type
    const awardsByType = {};
    
    awards.forEach(award => {
      if (!awardsByType[award.type]) {
        awardsByType[award.type] = [];
      }
      awardsByType[award.type].push(award);
    });
    
    res.status(200).json({
      success: true,
      count: awards.length,
      pagination,
      data: {
        all: awards,
        byType: awardsByType
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single award
// @route   GET /api/awards/:id
// @access  Public
exports.getAward = async (req, res, next) => {
  try {
    const award = await Award.findById(req.params.id);
    
    if (!award) {
      return res.status(404).json({
        success: false,
        error: 'Award not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: award
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new award
// @route   POST /api/awards
// @access  Private/Admin
exports.createAward = async (req, res, next) => {
  try {
    const award = await Award.create(req.body);
    
    res.status(201).json({
      success: true,
      data: award
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update award
// @route   PUT /api/awards/:id
// @access  Private/Admin
exports.updateAward = async (req, res, next) => {
  try {
    const award = await Award.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!award) {
      return res.status(404).json({
        success: false,
        error: 'Award not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: award
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete award
// @route   DELETE /api/awards/:id
// @access  Private/Admin
exports.deleteAward = async (req, res, next) => {
  try {
    const award = await Award.findById(req.params.id);
    
    if (!award) {
      return res.status(404).json({
        success: false,
        error: 'Award not found'
      });
    }
    
    await award.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
}; 