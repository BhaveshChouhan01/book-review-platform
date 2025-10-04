const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    
    // For development, let's try using MongoDB Atlas or continue without strict exit
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  MongoDB not available. Server will continue but database features may not work.');
      console.log('💡 To fix: Install MongoDB or use MongoDB Atlas cloud service');
      return;
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
