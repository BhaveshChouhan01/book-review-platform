// Mock database connection for testing without MongoDB
const connectDB = async () => {
  try {
    console.log('Mock Database Connected: localhost (no actual MongoDB required)');
    console.log('Note: This is a mock connection. Install MongoDB for full functionality.');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
