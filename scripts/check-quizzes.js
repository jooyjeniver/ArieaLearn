const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define the Quiz schema
const QuizSchema = new mongoose.Schema({
  title: String,
  description: String,
  topic: String,
  difficulty: String,
  questions: Array,
  moduleId: mongoose.Schema.Types.ObjectId,
  createdBy: mongoose.Schema.Types.ObjectId
}, { strict: false });

const Quiz = mongoose.model('Quiz', QuizSchema);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ariealear';
console.log('Attempting to connect to MongoDB with URI:', MONGO_URI.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://***:***@'));

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('MongoDB connected...');
    
    // List all collections to see if our quiz collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Query quizzes
    const quizzes = await Quiz.find({}).lean();
    console.log(`Found ${quizzes.length} quizzes`);
    
    if (quizzes.length > 0) {
      // Display a sample quiz
      console.log('Sample quiz:', JSON.stringify(quizzes[0], null, 2));
      
      // Check for quizzes we seeded
      const arQuizzes = quizzes.filter(q => q.topic === 'AR Fundamentals');
      console.log(`Found ${arQuizzes.length} AR Fundamentals quizzes`);
      if (arQuizzes.length > 0) {
        console.log('AR Quiz:', JSON.stringify(arQuizzes[0], null, 2));
      }
    }
    
    // Close the connection
    mongoose.disconnect();
    console.log('Database connection closed');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }); 