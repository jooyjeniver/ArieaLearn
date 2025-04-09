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

// Additional modules data
const additionalModules = [
  {
    title: 'Good Habits and Citizenship',
    description: 'Learn about polite behavior, sharing, national pride, and cleanliness',
    content: 'This module covers good manners, sharing, national identity, and personal hygiene.',
    order: 3,
    icon: 'heart',
    color: '#E91E63',
    lessons: [
      {
        id: 'habits-1',
        title: 'Magic Words and Kind Actions',
        description: 'Learn and use polite words (please, sorry, thank you) and show kindness through words and actions',
        duration: '35 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'heart',
        subject: 'Social Studies',
        arEnabled: false,
        learningObjectives: [
          'Learn and use polite words (please, sorry, thank you)',
          'Show kindness through words and actions'
        ],
        keyConcepts: [
          'Polite language makes others feel respected',
          'Small kind acts can make a big difference'
        ],
        activities: [
          'Role-play good manners (sharing toys, asking politely)',
          '"Magic Words Poster" – draw words like please, sorry, excuse me'
        ],
        vocabulary: [
          'Please',
          'Sorry',
          'Thank you',
          'Excuse me',
          'Respect'
        ]
      },
      {
        id: 'habits-2',
        title: 'We Care, We Share!',
        description: 'Understand the value of sharing and helping, and build empathy and teamwork',
        duration: '40 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'hand-heart',
        subject: 'Social Studies',
        arEnabled: false,
        learningObjectives: [
          'Understand the value of sharing and helping',
          'Build empathy and teamwork'
        ],
        keyConcepts: [
          'Sharing builds friendships',
          'Helping others is part of being a good citizen'
        ],
        activities: [
          '"Sharing Circle" – pass a toy or book and say something kind',
          'Storytime about helping someone in need'
        ],
        vocabulary: [
          'Share',
          'Help',
          'Teamwork',
          'Friendship',
          'Empathy'
        ]
      },
      {
        id: 'habits-3',
        title: 'Proud to Be Sri Lankan',
        description: 'Identify national symbols and values, and build national pride and unity',
        duration: '45 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'flag',
        subject: 'Social Studies',
        arEnabled: true,
        learningObjectives: [
          'Identify national symbols and values',
          'Build national pride and unity'
        ],
        keyConcepts: [
          'National flag, anthem, flower, bird, and tree',
          'Sri Lanka is our home; we should love and protect it'
        ],
        activities: [
          'Color the Sri Lankan flag',
          'Practice the national anthem (simplified lines)'
        ],
        vocabulary: [
          'Sri Lanka',
          'Flag',
          'Anthem',
          'Nation',
          'Unity'
        ]
      },
      {
        id: 'habits-4',
        title: 'Little Heroes of Cleanliness',
        description: 'Learn personal and environmental cleanliness, and know why hygiene is important',
        duration: '35 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'broom',
        subject: 'Social Studies',
        arEnabled: false,
        learningObjectives: [
          'Learn personal and environmental cleanliness',
          'Know why hygiene is important'
        ],
        keyConcepts: [
          'Cleaning prevents sickness',
          'Clean surroundings make everyone feel better'
        ],
        activities: [
          '"Clean-Up Game" – picking up papers from the classroom',
          'Chart: "How I Stay Clean Every Day"'
        ],
        vocabulary: [
          'Clean',
          'Dirty',
          'Wash',
          'Bath',
          'Sanitation'
        ]
      }
    ]
  },
  {
    title: 'My Environment',
    description: 'Learn about natural and man-made environments, trees, animals, and environmental protection',
    content: 'This module covers the environment, biodiversity, cleanliness, and pollution.',
    order: 4,
    icon: 'tree',
    color: '#4CAF50',
    lessons: [
      {
        id: 'env-1',
        title: 'Nature vs. Buildings – Can You Tell?',
        description: 'Distinguish between natural and man-made environments',
        duration: '40 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'tree',
        subject: 'Science',
        arEnabled: true,
        learningObjectives: [
          'Distinguish between natural and man-made environments'
        ],
        keyConcepts: [
          'Nature includes trees, rivers, animals',
          'Buildings and roads are man-made'
        ],
        activities: [
          'Picture sort: "Natural vs Man-made"',
          'Draw one natural and one built object'
        ],
        vocabulary: [
          'Natural',
          'Man-made',
          'Tree',
          'Building',
          'River'
        ]
      },
      {
        id: 'env-2',
        title: 'Let\'s Explore Trees and Animals!',
        description: 'Identify common animals and plants in Sri Lanka and appreciate biodiversity',
        duration: '45 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'paw',
        subject: 'Science',
        arEnabled: true,
        learningObjectives: [
          'Identify common animals and plants in Sri Lanka',
          'Appreciate biodiversity'
        ],
        keyConcepts: [
          'Forests, animals, and plants give us food, shelter, and air'
        ],
        activities: [
          'Leaf collection or drawing',
          'Matching animals to their homes (nest, den, etc.)'
        ],
        vocabulary: [
          'Tree',
          'Animal',
          'Bird',
          'Forest',
          'Nature'
        ]
      },
      {
        id: 'env-3',
        title: 'Clean Earth, Happy Life',
        description: 'Learn about the importance of keeping our earth clean',
        duration: '35 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'earth',
        subject: 'Science',
        arEnabled: false,
        learningObjectives: [
          'Importance of keeping our earth clean'
        ],
        keyConcepts: [
          'Littering harms animals and plants',
          'Clean surroundings = happy living'
        ],
        activities: [
          '"Do Not Litter" sign-making',
          'Recycling activity with bottle caps or boxes'
        ],
        vocabulary: [
          'Litter',
          'Clean',
          'Environment',
          'Waste',
          'Protect'
        ]
      },
      {
        id: 'env-4',
        title: 'Say No to Pollution!',
        description: 'Understand types of pollution (air, water, land) and learn ways to reduce pollution',
        duration: '40 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'smoke',
        subject: 'Science',
        arEnabled: false,
        learningObjectives: [
          'Understand types of pollution (air, water, land)',
          'Learn ways to reduce pollution'
        ],
        keyConcepts: [
          'Pollution makes the earth sick',
          'Everyone can help reduce it'
        ],
        activities: [
          'Poster: "How to Stop Pollution"',
          'Watch a short cartoon on pollution'
        ],
        vocabulary: [
          'Pollution',
          'Smoke',
          'Garbage',
          'Clean Air',
          'Recycle'
        ]
      }
    ]
  },
  {
    title: 'Time and History',
    description: 'Learn about days, months, festivals, and historical places in Sri Lanka',
    content: 'This module covers time concepts, festivals, and historical sites in Sri Lanka.',
    order: 5,
    icon: 'clock',
    color: '#FF9800',
    lessons: [
      {
        id: 'time-1',
        title: 'Tick-Tock: Days and Months',
        description: 'Learn days of the week and months of the year, and understand how calendars help us',
        duration: '40 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'calendar',
        subject: 'Social Studies',
        arEnabled: false,
        learningObjectives: [
          'Learn days of the week and months of the year',
          'Understand how calendars help us'
        ],
        keyConcepts: [
          'There are 7 days in a week and 12 months in a year',
          'Days help us plan school and holidays'
        ],
        activities: [
          'Make a paper calendar',
          'Sing "Days of the Week" song'
        ],
        vocabulary: [
          'Monday',
          'Tuesday',
          'January',
          'February',
          'Calendar'
        ]
      },
      {
        id: 'time-2',
        title: 'Celebrate with Joy!',
        description: 'Identify major national and religious festivals in Sri Lanka',
        duration: '45 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'party-popper',
        subject: 'Social Studies',
        arEnabled: true,
        learningObjectives: [
          'Identify major national and religious festivals in Sri Lanka'
        ],
        keyConcepts: [
          'Sri Lanka celebrates festivals like Sinhala & Tamil New Year, Vesak, Eid, and Christmas'
        ],
        activities: [
          'Festival photo album with short notes',
          'Draw your favorite celebration'
        ],
        vocabulary: [
          'Vesak',
          'Christmas',
          'Eid',
          'Festival',
          'Celebrate'
        ]
      },
      {
        id: 'time-3',
        title: 'Walk Through History',
        description: 'Learn about important historical sites',
        duration: '50 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'castle',
        subject: 'Social Studies',
        arEnabled: true,
        learningObjectives: [
          'Learn about important historical sites'
        ],
        keyConcepts: [
          'Places like Sigiriya, Anuradhapura, and Polonnaruwa tell stories of our past'
        ],
        activities: [
          'Match photos to places',
          'Storytime: Legends of King Kashyapa or ancient temples'
        ],
        vocabulary: [
          'History',
          'Temple',
          'Ancient',
          'King',
          'Sigiriya'
        ]
      }
    ]
  },
  {
    title: 'Transport and Communication',
    description: 'Learn about different modes of transport, travel safety, and communication methods',
    content: 'This module covers transportation, safety rules, and communication methods.',
    order: 7,
    icon: 'car',
    color: '#9C27B0',
    lessons: [
      {
        id: 'transport-1',
        title: 'Wheels, Boats & Wings',
        description: 'Identify land, water, and air transport',
        duration: '40 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'car',
        subject: 'Social Studies',
        arEnabled: true,
        learningObjectives: [
          'Identify land, water, and air transport'
        ],
        keyConcepts: [
          'We use different transport for different places'
        ],
        activities: [
          'Transport collage (cut out and stick vehicles)',
          'Match transport to goods (plane → cargo, truck → groceries)'
        ],
        vocabulary: [
          'Car',
          'Bus',
          'Boat',
          'Plane',
          'Travel'
        ]
      },
      {
        id: 'transport-2',
        title: 'Travel Safe, Travel Smart',
        description: 'Learn traffic rules and safety tips',
        duration: '35 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'traffic-light',
        subject: 'Social Studies',
        arEnabled: false,
        learningObjectives: [
          'Learn traffic rules and safety tips'
        ],
        keyConcepts: [
          'Using zebra crossings, wearing helmets, and seatbelts is important'
        ],
        activities: [
          'Practice a zebra crossing walk',
          'Design a traffic sign'
        ],
        vocabulary: [
          'Helmet',
          'Seatbelt',
          'Zebra Crossing',
          'Traffic Light',
          'Safety'
        ]
      },
      {
        id: 'transport-3',
        title: 'From Letters to Likes!',
        description: 'Understand how people communicated then and now',
        duration: '40 mins',
        progress: 0,
        difficulty: 'Beginner',
        icon: 'email',
        subject: 'Social Studies',
        arEnabled: false,
        learningObjectives: [
          'Understand how people communicated then and now'
        ],
        keyConcepts: [
          'Past: letters, pigeons, telegrams',
          'Present: phones, email, messaging'
        ],
        activities: [
          'Write and decorate a pretend letter to a friend',
          'Show icons of modern communication and match them'
        ],
        vocabulary: [
          'Letter',
          'Phone',
          'Message',
          'Email',
          'Chat'
        ]
      }
    ]
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    for (const moduleData of additionalModules) {
      // Check if the module already exists
      const existingModule = await Module.findOne({ title: moduleData.title });
      
      if (existingModule) {
        console.log(`Module "${moduleData.title}" already exists. Updating...`);
        await Module.findByIdAndUpdate(existingModule._id, moduleData, {
          new: true,
          runValidators: true
        });
        console.log(`Module "${moduleData.title}" updated successfully`);
      } else {
        // Create new module
        await Module.create(moduleData);
        console.log(`Module "${moduleData.title}" created successfully`);
      }
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