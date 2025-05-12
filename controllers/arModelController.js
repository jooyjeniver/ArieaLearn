const getArModels = async (req, res) => {
  try {
    const models = await ArModel.find();
    
    // Update the modelFile URL format to match your static file serving
    const modelsWithUrls = models.map(model => ({
      ...model.toObject(),
      modelFile: `/uploads/models/${path.basename(model.modelFile)}`,
      thumbnail: model.thumbnail ? `/uploads/thumbnails/${path.basename(model.thumbnail)}` : null
    }));
    
    res.json(modelsWithUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Other controller methods... 