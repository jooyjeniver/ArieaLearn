const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const ArModel = require('../models/ArModel');
const Module = require('../models/Module');

// Load env vars
dotenv.config();

// Use default MongoDB URI if environment variable is not set
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ariealearn';

// Connect to database
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });

// Sample AR models data - we'll need to get the module ID from the database
const sampleArModels = [
  {
    name: 'Myself and My Family',
    description: 'Learn about personal identity, family relationships, and responsibilities at home',
    modelFile: '/uploads/models/treeparts.glb', // This file should be placed in uploads/models folder
    fileType: 'glb',
    previewImage: '/uploads/resources/family-tree.png',
    scale: {
        "x": 1,
        "y": 1,
        "z": 1
    },
    rotation: {
        "x": 0,
        "y": 0,
        "z": 0
    },
  },
];

// Copy sample GLB files to the uploads directory
const copyModelFiles = async () => {
  try {
    // Source files (should be in a samples directory in your project)
    const sampleFiles = [
      { src: path.join(__dirname, '../samples/models/family-tree.glb'), dest: path.join(__dirname, '../uploads/models/family-tree.glb') },

    ];

    // Create destination directories if they don't exist
    const ensureDirExists = (dirPath) => {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    };

    ensureDirExists(path.join(__dirname, '../uploads/models'));
    ensureDirExists(path.join(__dirname, '../uploads/resources'));

    // Copy files if they exist, otherwise log warning
    for (const file of sampleFiles) {
      if (fs.existsSync(file.src)) {
        fs.copyFileSync(file.src, file.dest);
        console.log(`Copied ${file.src} to ${file.dest}`);
      } else {
        console.log(`Warning: Sample file ${file.src} does not exist. Skipping.`);
      }
    }
  } catch (err) {
    console.error(`Error copying model files: ${err.message}`);
  }
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    // First get all modules to find one to attach the models to
    const modules = await Module.find();
    
    if (!modules || modules.length === 0) {
      console.error('No modules found in the database. Please run seed-lessons.js first.');
      process.exit(1);
    }

    // Use the first module as the parent for our AR models
    const moduleId = modules[0]._id;

    // Try to copy sample model files if they exist
    await copyModelFiles();

    // Add module ID to each model
    const modelsWithModule = sampleArModels.map(model => ({
      ...model,
      module: moduleId
    }));

    // Delete any existing AR models
    await ArModel.deleteMany({});
    console.log('Deleted existing AR models');

    // Create new AR models
    await ArModel.insertMany(modelsWithModule);
    console.log('AR models created successfully');

    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database disconnected');
    process.exit(0);
  } catch (err) {
    console.error(`Error seeding database: ${err.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 