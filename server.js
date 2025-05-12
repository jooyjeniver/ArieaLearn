const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config();

// Route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const moduleRoutes = require('./routes/modules');
const arModelRoutes = require('./routes/arModels');
const lessonRoutes = require('./routes/lessons');
const progressRoutes = require('./routes/progress');
const aiRoutes = require('./routes/ai');
const subjectRoutes = require('./routes/subjects');
const topicRoutes = require('./routes/topics');

// New quiz-related route files
const quizRoutes = require('./routes/quizzes');
const awardRoutes = require('./routes/awards');
const adminRoutes = require('./routes/admin');
const userProgressRoutes = require('./routes/user');

// Import routes
const emotionRoutes = require('./routes/emotion');

const app = express();

// Trust proxy if behind a proxy (like Heroku, Render, etc.)
app.set('trust proxy', 1);

// Security headers (basic version without helmet)
app.use((req, res, next) => {
  // Set security headers manually
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  next();
});

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Body parser
app.use(express.json());

// Enable CORS with appropriate config
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
        process.env.BASE_URL,
        'http://10.0.2.2:5000',  // Android emulator
        'http://localhost:5000', // Local development
        'http://127.0.0.1:5000',  // Alternative local address
        'http://192.168.8.192:5000' // New IP address
      ].flat()
    : true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Add OPTIONS handling for preflight requests
app.options('*', cors(corsOptions));

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Add this line to support /api/uploads path as well
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/armodels', arModelRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes);

// Mount new quiz-related routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userProgressRoutes);

// Mount emotion routes
app.use('/api/emotion', emotionRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to AreaLearn API',
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Error handler middleware
app.use(errorHandler);

// Connect to database
connectDB()
  .then(() => {
    console.log('MongoDB Connected');
    
    // Start the server only after DB connection is established
    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log(`Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

const tempDir = path.join(__dirname, 'uploads', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}