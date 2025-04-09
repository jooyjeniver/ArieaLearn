const mongoose = require('mongoose');
const dotenv = require('dotenv');
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

// School and Community lesson data
const schoolCommunityModule = {
  title: 'Our School and Community',
  description: 'Learn about school life, rules, community helpers, and important places in the community',
  content: 'This module covers school environment, rules, community helpers, and important places in the community.',
  order: 2,
  icon: 'school',
  color: '#2196F3',
  lessons: [
    {
      id: 'school-1',
      title: 'My School, My Second Home',
      description: 'Understand the importance of school in daily life, identify key areas and people in the school environment, and appreciate the role of school in learning and friendship',
      duration: '40 mins',
      progress: 0,
      difficulty: 'Beginner',
      icon: 'school',
      subject: 'Social Studies',
      arEnabled: true,
      learningObjectives: [
        'Understand the importance of school in daily life',
        'Identify key areas and people in the school environment',
        'Appreciate the role of school in learning and friendship'
      ],
      keyConcepts: [
        'School is a place to learn, play, and grow',
        'Teachers, principals, and friends make school enjoyable',
        'Respecting the school environment is important'
      ],
      activities: [
        'Draw or label a picture of your school (classroom, playground, library, etc.)',
        '"My Favorite Place in School" – show and tell with drawings or photos',
        'Mini writing: "Why I Like My School"'
      ],
      vocabulary: [
        'School',
        'Classroom',
        'Playground',
        'Teacher',
        'Friend',
        'Learn'
      ]
    },
    {
      id: 'school-2',
      title: 'Let\'s Follow the School Rules!',
      description: 'Recognize the need for rules at school, learn examples of common school rules, and understand how rules help us stay safe and fair',
      duration: '35 mins',
      progress: 0,
      difficulty: 'Beginner',
      icon: 'clipboard-check',
      subject: 'Social Studies',
      arEnabled: false,
      learningObjectives: [
        'Recognize the need for rules at school',
        'Learn examples of common school rules',
        'Understand how rules help us stay safe and fair'
      ],
      keyConcepts: [
        'Rules keep school safe and peaceful',
        'We must listen to teachers and respect each other',
        'Following rules makes school a better place for everyone'
      ],
      activities: [
        'Make a poster: "5 Golden Rules in My School" (e.g., Don\'t run inside, Raise your hand)',
        'Role play: "Breaking vs Following Rules" (e.g., lining up vs pushing)',
        'Create flashcards of good behaviors (e.g., sharing, listening, helping)'
      ],
      vocabulary: [
        'Rule',
        'Respect',
        'Discipline',
        'Obey',
        'Listen',
        'Fairness'
      ]
    },
    {
      id: 'school-3',
      title: 'Meet Our Community Heroes',
      description: 'Identify important community helpers, appreciate their roles and contributions to society, and encourage respect and gratitude for helpers',
      duration: '45 mins',
      progress: 0,
      difficulty: 'Beginner',
      icon: 'account-group',
      subject: 'Social Studies',
      arEnabled: true,
      learningObjectives: [
        'Identify important community helpers',
        'Appreciate their roles and contributions to society',
        'Encourage respect and gratitude for helpers'
      ],
      keyConcepts: [
        'Community helpers make life easier and safer',
        'Examples: teachers, doctors, farmers, police officers, garbage collectors',
        'We should be kind and thankful to them'
      ],
      activities: [
        'Draw or color pictures of community helpers',
        'Match-the-helper game (e.g., doctor → stethoscope, farmer → plough)',
        'Interview activity: Ask a parent or neighbor about their job'
      ],
      vocabulary: [
        'Community',
        'Helper',
        'Teacher',
        'Doctor',
        'Police',
        'Farmer'
      ]
    },
    {
      id: 'school-4',
      title: 'Places Around Me',
      description: 'Identify important places in the community, understand how each place helps us, and learn to recognize local landmarks',
      duration: '40 mins',
      progress: 0,
      difficulty: 'Beginner',
      icon: 'map-marker',
      subject: 'Social Studies',
      arEnabled: false,
      learningObjectives: [
        'Identify important places in the community',
        'Understand how each place helps us (e.g., hospital for health, bank for money)',
        'Learn to recognize local landmarks'
      ],
      keyConcepts: [
        'Our community has many useful places like markets, schools, post offices, and hospitals',
        'We visit different places for different needs',
        'Knowing your neighborhood is part of being safe and smart'
      ],
      activities: [
        'Map drawing: Make a simple map of your neighborhood with places labeled',
        'Community walk (real or virtual): Spot and name local places',
        'Photo journal: Take pictures of important places near your home and label them'
      ],
      vocabulary: [
        'Hospital',
        'Post Office',
        'Bank',
        'Market',
        'Police Station',
        'Temple / Church / Mosque'
      ]
    }
  ]
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Check if the module already exists
    const existingModule = await Module.findOne({ title: schoolCommunityModule.title });
    
    if (existingModule) {
      console.log('Module already exists. Updating...');
      await Module.findByIdAndUpdate(existingModule._id, schoolCommunityModule, {
        new: true,
        runValidators: true
      });
      console.log('Module updated successfully');
    } else {
      // Create new module
      await Module.create(schoolCommunityModule);
      console.log('Module created successfully');
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