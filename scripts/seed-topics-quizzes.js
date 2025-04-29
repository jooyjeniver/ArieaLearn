const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config({ path: '../.env' });

// Import models
const Topic = require('../models/Topic');
const Quiz = require('../models/Quiz');

// Connect to DB
// Replace this with your actual MongoDB connection string
const MONGO_URI = process.env.MONGODB_URI; // or your actual connection string
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Topic seed data
const topics = [
  {
    name: 'Mathematics',
    description: 'Explore mathematical concepts from basic arithmetic to advanced calculus.',
    iconUrl: '/uploads/icons/math.png',
    order: 1
  },
  {
    name: 'Science',
    description: 'Discover scientific principles in physics, chemistry, biology and more.',
    iconUrl: '/uploads/icons/science.png',
    order: 2
  },
  {
    name: 'History',
    description: 'Learn about important historical events and figures throughout time.',
    iconUrl: '/uploads/icons/history.png',
    order: 3
  },
  {
    name: 'AR Development',
    description: 'Master the concepts and technologies behind augmented reality applications.',
    iconUrl: '/uploads/icons/ar-dev.png',
    order: 4
  },
  {
    name: '3D Modeling',
    description: 'Learn 3D modeling techniques for creating AR content.',
    iconUrl: '/uploads/icons/3d-modeling.png',
    order: 5
  }
];

// Quiz seed data - this will be populated with topic IDs during seeding
const quizTemplates = [
  // Mathematics Quizzes
  {
    topicName: 'Mathematics',
    quizzes: [
      {
        title: 'Basic Algebra',
        description: 'Test your knowledge of basic algebraic expressions and equations.',
        difficulty: 'intermediate',
        questions: [
          {
            questionText: 'Solve for x: 2x + 5 = 13',
            options: [
              { text: 'x = 4', isCorrect: true },
              { text: 'x = 3', isCorrect: false },
              { text: 'x = 5', isCorrect: false },
              { text: 'x = 6', isCorrect: false }
            ],
            explanation: 'To solve for x, subtract 5 from both sides of the equation: 2x = 8. Then divide both sides by 2: x = 4.'
          },
          {
            questionText: 'If 3y - 7 = 8, what is y?',
            options: [
              { text: 'y = 5', isCorrect: true },
              { text: 'y = 3', isCorrect: false },
              { text: 'y = 4', isCorrect: false },
              { text: 'y = 6', isCorrect: false }
            ],
            explanation: 'Add 7 to both sides: 3y = 15. Divide both sides by 3: y = 5.'
          }
        ]
      },
      {
        title: 'Geometry Basics',
        description: 'Learn about fundamental geometric concepts and shapes.',
        difficulty: 'beginner',
        questions: [
          {
            questionText: 'What is the formula for the area of a circle?',
            options: [
              { text: 'πr²', isCorrect: true },
              { text: '2πr', isCorrect: false },
              { text: 'πd', isCorrect: false },
              { text: 'πr²/2', isCorrect: false }
            ],
            explanation: 'The area of a circle is given by the formula A = πr², where r is the radius of the circle.'
          },
          {
            questionText: 'What is the sum of angles in a triangle?',
            options: [
              { text: '180 degrees', isCorrect: true },
              { text: '90 degrees', isCorrect: false },
              { text: '360 degrees', isCorrect: false },
              { text: '270 degrees', isCorrect: false }
            ],
            explanation: 'The sum of interior angles in any triangle is always 180 degrees.'
          }
        ]
      }
    ]
  },
  
  // Science Quizzes
  {
    topicName: 'Science',
    quizzes: [
      {
        title: 'Basic Physics',
        description: 'Test your understanding of fundamental physics concepts.',
        difficulty: 'intermediate',
        questions: [
          {
            questionText: 'What is Newton\'s First Law of Motion?',
            options: [
              { text: 'An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force.', isCorrect: true },
              { text: 'Force equals mass times acceleration.', isCorrect: false },
              { text: 'For every action, there is an equal and opposite reaction.', isCorrect: false },
              { text: 'Energy cannot be created or destroyed.', isCorrect: false }
            ],
            explanation: 'Newton\'s First Law of Motion, also known as the law of inertia, states that an object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.'
          },
          {
            questionText: 'What is the unit of electrical resistance?',
            options: [
              { text: 'Ohm', isCorrect: true },
              { text: 'Volt', isCorrect: false },
              { text: 'Ampere', isCorrect: false },
              { text: 'Watt', isCorrect: false }
            ],
            explanation: 'The ohm (Ω) is the SI unit of electrical resistance.'
          }
        ]
      }
    ]
  },
  
  // AR Development Quizzes
  {
    topicName: 'AR Development',
    quizzes: [
      {
        title: 'AR Fundamentals',
        description: 'Learn the basic concepts behind augmented reality technology.',
        difficulty: 'beginner',
        questions: [
          {
            questionText: 'What is the difference between AR and VR?',
            options: [
              { text: 'AR overlays digital content on the real world, while VR replaces the real world with a simulated environment.', isCorrect: true },
              { text: 'AR is only for games, while VR is for professional applications.', isCorrect: false },
              { text: 'AR requires special equipment, while VR works on any smartphone.', isCorrect: false },
              { text: 'There is no significant difference between AR and VR.', isCorrect: false }
            ],
            explanation: 'Augmented Reality (AR) enhances the real world with digital elements, while Virtual Reality (VR) immerses users in a completely virtual environment.'
          },
          {
            questionText: 'Which of the following is NOT a common AR tracking method?',
            options: [
              { text: 'Temperature sensing', isCorrect: true },
              { text: 'Marker-based tracking', isCorrect: false },
              { text: 'SLAM (Simultaneous Localization and Mapping)', isCorrect: false },
              { text: 'GPS/location-based tracking', isCorrect: false }
            ],
            explanation: 'While marker-based, SLAM, and GPS tracking are common in AR, temperature sensing is not typically used for AR positioning or tracking.'
          }
        ]
      },
      {
        title: 'Advanced AR Development',
        description: 'Advanced concepts and techniques for AR application development.',
        difficulty: 'advanced',
        questions: [
          {
            questionText: 'What is SLAM in the context of AR?',
            options: [
              { text: 'Simultaneous Localization And Mapping', isCorrect: true },
              { text: 'System Level AR Management', isCorrect: false },
              { text: 'Structural Layout And Modeling', isCorrect: false },
              { text: 'Spatial Lighting Analysis Method', isCorrect: false }
            ],
            explanation: 'SLAM (Simultaneous Localization And Mapping) is a technology that enables devices to map their surroundings and understand their position within that environment.'
          },
          {
            questionText: 'Which of these is NOT a common challenge in AR development?',
            options: [
              { text: 'Excessive processing power', isCorrect: true },
              { text: 'Lighting estimation', isCorrect: false },
              { text: 'Occlusion handling', isCorrect: false },
              { text: 'Accurate tracking', isCorrect: false }
            ],
            explanation: 'AR development typically faces challenges with limited processing power, not excess. Lighting estimation, occlusion handling, and accurate tracking are genuine AR development challenges.'
          }
        ]
      }
    ]
  },
  
  // 3D Modeling Quizzes
  {
    topicName: '3D Modeling',
    quizzes: [
      {
        title: '3D Modeling Basics',
        description: 'Introduction to 3D modeling concepts and techniques.',
        difficulty: 'beginner',
        questions: [
          {
            questionText: 'What is a polygon in 3D modeling?',
            options: [
              { text: 'A flat shape formed by connecting vertices', isCorrect: true },
              { text: 'A two-dimensional shape', isCorrect: false },
              { text: 'A three-dimensional geometric shape', isCorrect: false },
              { text: 'A type of texture', isCorrect: false }
            ],
            explanation: 'In 3D modeling, polygons are flat shapes formed by connecting three or more vertices. They are used to create the surfaces of 3D models.'
          },
          {
            questionText: 'What file format is commonly used for 3D models in AR applications?',
            options: [
              { text: '.glb or .gltf', isCorrect: true },
              { text: '.jpg', isCorrect: false },
              { text: '.doc', isCorrect: false },
              { text: '.html', isCorrect: false }
            ],
            explanation: 'GLB and GLTF formats are widely used for 3D models in AR applications because they are optimized for web and mobile delivery.'
          }
        ]
      }
    ]
  },
  
  // History Quizzes
  {
    topicName: 'History',
    quizzes: [
      {
        title: 'Ancient Civilizations',
        description: 'Explore the history of ancient civilizations around the world.',
        difficulty: 'intermediate',
        questions: [
          {
            questionText: 'Which ancient civilization built the pyramids at Giza?',
            options: [
              { text: 'Ancient Egyptians', isCorrect: true },
              { text: 'Mesopotamians', isCorrect: false },
              { text: 'Ancient Greeks', isCorrect: false },
              { text: 'Romans', isCorrect: false }
            ],
            explanation: 'The pyramids at Giza were built by the Ancient Egyptians, primarily during the Old and Middle Kingdom periods.'
          },
          {
            questionText: 'Which of these was NOT an ancient Mesopotamian civilization?',
            options: [
              { text: 'Maya', isCorrect: true },
              { text: 'Sumerian', isCorrect: false },
              { text: 'Babylonian', isCorrect: false },
              { text: 'Assyrian', isCorrect: false }
            ],
            explanation: 'The Maya civilization developed in Mesoamerica (present-day Mexico and Central America), not in Mesopotamia (present-day Iraq and Syria).'
          }
        ]
      }
    ]
  }
];

// Function to seed database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Topic.deleteMany();
    await Quiz.deleteMany();
    
    console.log('Previous data cleared');
    
    // Insert topics
    const createdTopics = await Topic.insertMany(topics);
    console.log(`${createdTopics.length} topics created`);
    
    // Map topic names to their IDs
    const topicMap = {};
    createdTopics.forEach(topic => {
      topicMap[topic.name] = topic._id;
    });
    
    // Create quizzes with appropriate topic references
    const quizzesToInsert = [];
    
    quizTemplates.forEach(template => {
      const topicId = topicMap[template.topicName];
      
      if (!topicId) {
        console.warn(`Topic ${template.topicName} not found in created topics`);
        return;
      }
      
      template.quizzes.forEach(quiz => {
        quizzesToInsert.push({
          ...quiz,
          topic: topicId
        });
      });
    });
    
    const createdQuizzes = await Quiz.insertMany(quizzesToInsert);
    console.log(`${createdQuizzes.length} quizzes created`);
    
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 