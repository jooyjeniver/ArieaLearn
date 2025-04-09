const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('../models/Subject');
const Module = require('../models/Module');

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });

// Sample subjects data
const subjects = [
  { 
    name: 'Myself and My Family',
    description: 'Learn about personal identity, family relationships, and responsibilities at home',
    icon: 'account-group', 
    color: '#FF4F9A',
    route: 'myself-family',
    order: 1,
    modules: []
  },
  { 
    name: 'Our School and Community',
    description: 'Explore school life, community helpers, and important places in our neighborhood',
    icon: 'school', 
    color: '#4F7CFF',
    route: 'school-community',
    order: 2,
    modules: []
  },
  { 
    name: 'Good Habits and Citizenship',
    description: 'Develop good habits and learn about being a responsible citizen',
    icon: 'hand-heart', 
    color: '#00C48C',
    route: 'Health',
    order: 3,
    modules: []
  },
  { 
    name: 'My Environment',
    description: 'Discover the natural world and learn about environmental care',
    icon: 'nature', 
    color: '#FFB800',
    route: 'Environment',
    order: 4,   
    modules: [
        { id: 'lang-1', title: 'Who Am I?' },
        { id: 'lang-2', title: 'My Special Family Tree' },
        { id: 'lang-3', title: 'Helping Hands at Home' }
    ]
  },
  { 
    name: 'Time and History',
    description: 'Understand concepts of time and explore historical events',
    icon: 'clock-time-four', 
    color: '#BC4FFF',
    route: 'Time',
    order: 5,
    modules: []
  },
  { 
    name: 'Transport and Communication',
    description: 'Learn about different modes of transport and ways of communication',
    icon: 'bus-multiple', 
    color: '#FF8A4F',
    route: 'Transport',
    order: 6,
    modules: []
  }
];
// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing subjects
    await Subject.deleteMany();
    console.log('Existing subjects cleared');

    // Create new subjects
    for (const subject of subjects) {
      const newSubject = await Subject.create({
        name: subject.name,
        description: subject.description,
        icon: subject.icon,
        color: subject.color,
        route: subject.route,
        order: subject.order
      });

      // Find modules for this subject
      const modules = await Module.find({
        'lessons.subject': subject.name
      });

      // Add module references to subject
      if (modules.length > 0) {
        newSubject.modules = modules.map(module => module._id);
        await newSubject.save();
      }
      console.log(`Created subject: ${subject.name}`);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(`Error seeding database: ${err.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();