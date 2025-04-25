const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

// Sample lesson data
const sampleLesson = {
  title: 'Myself and My Family',
  description: 'Learn about personal identity, family relationships, and responsibilities at home',
  content: 'This module covers personal identity, family relationships, and home responsibilities.',
  order: 1,
  icon: 'account-group',
  color: '#FF4F9A',
  lessons: [
    {
      id: 'lang-1',
      title: 'Who Am I?',
      description: 'Understand personal identity and basic personal information',
      duration: '30 mins',
      progress: 0,
      difficulty: 'Beginner',
      icon: 'account',
      subject: 'Language',
      arEnabled: true,
    },
    {
      id: 'lang-2',
      title: 'My Special Family Tree',
      description: 'Identify family members and understand relationships within a family',
      duration: '35 mins',
      progress: 0,
      difficulty: 'Beginner',
      icon: 'account-group',
      subject: 'Language',
    },
    {
      id: 'lang-3',
      title: 'Helping Hands at Home',
      description: 'Learn about responsibilities and teamwork in family life',
      duration: '25 mins',
      progress: 0,
      difficulty: 'Beginner',
      icon: 'hand-heart',
      subject: 'Language',
    },
  ],
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Check if the lesson already exists
    const existingLesson = await Module.findOne({ title: sampleLesson.title });
    
    if (existingLesson) {
      console.log('Lesson already exists. Updating...');
      await Module.findByIdAndUpdate(existingLesson._id, sampleLesson, {
        new: true,
        runValidators: true
      });
      console.log('Lesson updated successfully');
    } else {
      // Create new lesson
      await Module.create(sampleLesson);
      console.log('Lesson created successfully');
    }
    
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