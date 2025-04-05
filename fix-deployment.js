// fix-deployment.js
console.log('Checking environment and dependencies...');

// Log Node.js version
console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${process.platform}`);

// Check for MongoDB connection
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// List available environment variables (without sensitive values)
console.log('\nEnvironment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '[SET]' : '[NOT SET]');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '[SET]' : '[NOT SET]');
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);

// Test MongoDB connection
console.log('\nTesting MongoDB connection...');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully');
  mongoose.connection.close();
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
})
.finally(() => {
  console.log('\nSetup check complete.');
}); 