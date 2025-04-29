const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Better logging for connection status
console.log('Environment loaded. Starting quiz seeding process...');

// Sample quiz data with complete structure
const quizzesData = [
  {
    title: 'Introduction to AR Concepts',
    description: 'Test your knowledge of basic AR concepts and terminology.',
    topic: 'AR Fundamentals',
    difficulty: 'beginner',
    questions: [
      {
        questionText: 'What does AR stand for?',
        options: [
          { text: 'Augmented Reality', isCorrect: true },
          { text: 'Alternative Reality', isCorrect: false },
          { text: 'Artificial Reality', isCorrect: false },
          { text: 'Advanced Reality', isCorrect: false },
        ],
        explanation: 'AR stands for Augmented Reality, which overlays digital content on the real world.',
      },
      {
        questionText: 'Which of the following is NOT a common use of AR?',
        options: [
          { text: 'Navigation', isCorrect: false },
          { text: 'Education', isCorrect: false },
          { text: 'Complete replacement of reality', isCorrect: true },
          { text: 'Gaming', isCorrect: false },
        ],
        explanation: 'Complete replacement of reality describes Virtual Reality (VR), not AR.',
      },
      {
        questionText: 'What hardware is typically required for AR experiences?',
        options: [
          { text: 'Only a dedicated headset', isCorrect: false },
          { text: 'A camera-equipped device like a smartphone', isCorrect: true },
          { text: 'Full body tracking equipment', isCorrect: false },
          { text: 'A minimum of three external sensors', isCorrect: false },
        ],
        explanation: 'AR can run on smartphones and tablets with cameras, without requiring special equipment.',
      },
    ],
  },
  {
    title: '3D Modeling Basics',
    description: 'Test your understanding of 3D modeling concepts for AR.',
    topic: '3D Modeling',
    difficulty: 'intermediate',
    questions: [
      {
        questionText: 'What is a polygon in 3D modeling?',
        options: [
          { text: 'A two-dimensional shape', isCorrect: false },
          { text: 'A three-dimensional geometric shape', isCorrect: false },
          { text: 'A flat shape formed by connecting vertices', isCorrect: true },
          { text: 'A type of texture', isCorrect: false },
        ],
        explanation: 'Polygons are flat shapes formed by connecting vertices, and they make up 3D meshes.',
      },
      {
        questionText: 'What file format is commonly used for 3D models in AR applications?',
        options: [
          { text: '.jpg', isCorrect: false },
          { text: '.glb or .gltf', isCorrect: true },
          { text: '.doc', isCorrect: false },
          { text: '.html', isCorrect: false },
        ],
        explanation: 'GLB and GLTF formats are optimized for web and mobile 3D content delivery.',
      },
      {
        questionText: 'What is "rigging" in 3D modeling?',
        options: [
          { text: 'Adding colors and textures', isCorrect: false },
          { text: 'Creating a digital skeleton for animation', isCorrect: true },
          { text: 'Optimizing the model size', isCorrect: false },
          { text: 'Adding lighting effects', isCorrect: false },
        ],
        explanation: 'Rigging involves creating a skeleton structure that allows for animation of a 3D model.',
      },
    ],
  },
  {
    title: 'Advanced AR Development',
    description: 'Challenge your knowledge of advanced AR development concepts.',
    topic: 'AR Development',
    difficulty: 'advanced',
    questions: [
      {
        questionText: 'What is SLAM in the context of AR?',
        options: [
          { text: 'Simultaneous Localization And Mapping', isCorrect: true },
          { text: 'System Level AR Management', isCorrect: false },
          { text: 'Structural Layout And Modeling', isCorrect: false },
          { text: 'Spatial Lighting Analysis Method', isCorrect: false },
        ],
        explanation: 'SLAM allows AR systems to map an environment and track position within it simultaneously.',
      },
      {
        questionText: 'Which of these is NOT a common challenge in AR development?',
        options: [
          { text: 'Lighting estimation', isCorrect: false },
          { text: 'Occlusion handling', isCorrect: false },
          { text: 'File size limitations', isCorrect: false },
          { text: 'Excessive processing power', isCorrect: true },
        ],
        explanation: 'AR typically struggles with limited processing power, not excess.',
      },
      {
        questionText: 'What is a marker-based AR system?',
        options: [
          { text: 'A system that requires GPS positioning', isCorrect: false },
          { text: 'A system that uses physical targets to anchor virtual content', isCorrect: true },
          { text: 'A system that only works indoors', isCorrect: false },
          { text: 'A system that requires multiple users', isCorrect: false },
        ],
        explanation: 'Marker-based AR uses identifiable images or objects as reference points for placing AR content.',
      },
    ],
  },
  {
    title: 'Science Quiz: Physics Fundamentals',
    description: 'Test your knowledge of basic physics principles.',
    topic: 'Science',
    difficulty: 'intermediate',
    questions: [
      {
        questionText: 'What is Newton\'s First Law of Motion?',
        options: [
          { text: 'An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force.', isCorrect: true },
          { text: 'Force equals mass times acceleration.', isCorrect: false },
          { text: 'For every action, there is an equal and opposite reaction.', isCorrect: false },
          { text: 'Energy cannot be created or destroyed.', isCorrect: false },
        ],
        explanation: 'Newton\'s First Law, also known as the law of inertia, states that an object will maintain its state of rest or uniform motion unless acted upon by an external force.',
      },
      {
        questionText: 'What is the SI unit for measuring force?',
        options: [
          { text: 'Watt', isCorrect: false },
          { text: 'Joule', isCorrect: false },
          { text: 'Newton', isCorrect: true },
          { text: 'Pascal', isCorrect: false },
        ],
        explanation: 'The newton (N) is the SI unit of force, named after Sir Isaac Newton.',
      },
      {
        questionText: 'Which of the following is an example of potential energy?',
        options: [
          { text: 'A running athlete', isCorrect: false },
          { text: 'A compressed spring', isCorrect: true },
          { text: 'A speeding car', isCorrect: false },
          { text: 'A flying airplane', isCorrect: false },
        ],
        explanation: 'Potential energy is stored energy that has the potential to be released, like in a compressed spring, raised weight, or charged battery.',
      },
    ],
  },
  {
    title: 'Mathematics: Algebra Basics',
    description: 'Review fundamental algebraic concepts and equations.',
    topic: 'Mathematics',
    difficulty: 'beginner',
    questions: [
      {
        questionText: 'Solve for x: 3x + 7 = 22',
        options: [
          { text: 'x = 5', isCorrect: true },
          { text: 'x = 7', isCorrect: false },
          { text: 'x = 4', isCorrect: false },
          { text: 'x = 6', isCorrect: false },
        ],
        explanation: 'To solve: 3x + 7 = 22\nSubtract 7 from both sides: 3x = 15\nDivide both sides by 3: x = 5',
      },
      {
        questionText: 'Which of the following is a quadratic equation?',
        options: [
          { text: 'y = 3x + 2', isCorrect: false },
          { text: 'y = x² + 3x + 2', isCorrect: true },
          { text: 'y = 2/x', isCorrect: false },
          { text: 'y = √x', isCorrect: false },
        ],
        explanation: 'A quadratic equation contains at least one term where the variable is squared (x²) and no terms with higher powers.',
      },
      {
        questionText: 'What is the value of x in the equation 2(x-3) = 8?',
        options: [
          { text: 'x = 7', isCorrect: true },
          { text: 'x = 5', isCorrect: false },
          { text: 'x = 11', isCorrect: false },
          { text: 'x = 2', isCorrect: false },
        ],
        explanation: 'To solve: 2(x-3) = 8\nDistribute: 2x - 6 = 8\nAdd 6 to both sides: 2x = 14\nDivide both sides by 2: x = 7',
      },
    ],
  }
];

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    // Try environment variable first
    let connectionURI = process.env.MONGODB_URI;
    
    // If not found, try a default
    if (!connectionURI) {
      console.log('No MONGO_URI found in environment, using default connection string');
      connectionURI = 'mongodb://localhost:27017/ariealearn';
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(connectionURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
};

// Create quiz schema directly in the seed file to avoid conflicts
const createQuizModel = () => {
  try {
    // Check if model already exists
    if (mongoose.models.quizzes) {
      console.log('Using existing Quiz model');
      return mongoose.models.quizzes;
    }
    
    // Define the schema
    console.log('Creating Quiz model');
    const QuizSchema = new mongoose.Schema({
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      topic: {
        type: String,
        required: true,
      },
      difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
      },
      questions: [
        {
          questionText: {
            type: String,
            required: true,
          },
          options: [
            {
              text: String,
              isCorrect: Boolean,
            },
          ],
          explanation: String,
        },
      ],
      moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
      },
    });
    
    // Return the model
    return mongoose.model('quizzes', QuizSchema);
  } catch (error) {
    console.error('Error creating Quiz model:', error.message);
    // Try alternative approach
    return mongoose.model('quizzes');
  }
};

// Function to directly interact with the collection
const seedQuizzesDirectly = async () => {
  try {
    console.log('Attempting to seed quizzes directly to collection...');
    
    // Get reference to the collection
    const quizzesCollection = mongoose.connection.collection('quizzes');
    
    // Delete existing documents
    const deleteResult = await quizzesCollection.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing quizzes`);
    
    // Insert new documents
    const insertResult = await quizzesCollection.insertMany(quizzesData);
    console.log(`✅ Successfully inserted ${insertResult.insertedCount} quizzes directly to collection`);
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding quizzes directly:', error.message);
    return false;
  }
};

// Seed quizzes using the model
const seedQuizzesWithModel = async (Quiz) => {
  try {
    console.log('Seeding quizzes using Mongoose model...');
    
    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('Existing quizzes cleared');
    
    // Insert new quizzes
    const insertedQuizzes = await Quiz.insertMany(quizzesData);
    console.log(`✅ ${insertedQuizzes.length} quizzes inserted successfully using model`);
    
    return true;
  } catch (error) {
    console.error('❌ Error seeding quizzes with model:', error.message);
    
    // If validation error, show more details
    if (error.name === 'ValidationError') {
      Object.keys(error.errors).forEach(field => {
        console.error(`- Field '${field}' error:`, error.errors[field].message);
      });
    }
    
    return false;
  }
};

// Main execution function
const main = async () => {
  let success = false; // Declare success at the function scope level
  
  try {
    // Connect to the database
    const connected = await connectDB();
    if (!connected) {
      console.error('Failed to connect to MongoDB. Exiting...');
      process.exit(1);
    }
    
    // Try to create/get the Quiz model
    try {
      const Quiz = createQuizModel();
      success = await seedQuizzesWithModel(Quiz);
    } catch (modelError) {
      console.warn('Error using model approach:', modelError.message);
      console.log('Falling back to direct collection access...');
      success = await seedQuizzesDirectly();
    }
    
    if (success) {
      console.log('🎉 Database seeding completed successfully!');
    } else {
      console.error('❌ Database seeding failed');
    }
  } catch (error) {
    console.error('Unhandled error during seeding:', error);
    success = false; // Ensure success is false on error
  } finally {
    // Close the MongoDB connection
    try {
      // await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
    
    // Exit the process - now success is in scope
    process.exit(success ? 0 : 1);
  }

  // Add this right before closing the connection in the finally block
  try {
    const quizCount = await mongoose.connection.collection('quizzes').countDocuments();
    console.log(`Verification: Database now contains ${quizCount} quizzes`);
  } catch (err) {
    console.error('Error verifying quiz count:', err);
  }
};

// Run the main function
main(); 