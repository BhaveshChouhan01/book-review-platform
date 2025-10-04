const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Book Review Platform API - Simple Version', 
    status: 'Running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test routes
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Mock books endpoint
app.get('/api/books', (req, res) => {
  res.json({
    books: [
      {
        _id: '1',
        title: 'Sample Book 1',
        author: 'John Doe',
        description: 'This is a sample book for testing.',
        genre: 'Fiction',
        publishedYear: 2023,
        averageRating: 4.5,
        reviewCount: 10,
        addedBy: { name: 'Admin' }
      },
      {
        _id: '2',
        title: 'Sample Book 2',
        author: 'Jane Smith',
        description: 'Another sample book for testing.',
        genre: 'Non-Fiction',
        publishedYear: 2022,
        averageRating: 4.2,
        reviewCount: 8,
        addedBy: { name: 'Admin' }
      }
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalBooks: 2,
      hasNext: false,
      hasPrev: false
    }
  });
});

// Mock stats endpoint
app.get('/api/books/stats', (req, res) => {
  res.json({
    overview: {
      totalBooks: 2,
      totalReviews: 18,
      averageRating: 4.35
    },
    genreStats: [
      { _id: 'Fiction', count: 1, avgRating: 4.5 },
      { _id: 'Non-Fiction', count: 1, avgRating: 4.2 }
    ]
  });
});

// Mock filters endpoint
app.get('/api/books/filters', (req, res) => {
  res.json({
    genres: ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy'],
    authors: ['John Doe', 'Jane Smith'],
    years: {
      min: 2020,
      max: 2023,
      available: [2023, 2022, 2021, 2020]
    },
    ratings: {
      minRating: 1,
      maxRating: 5,
      avgRating: 4.35
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📝 Test the API at http://localhost:${PORT}`);
  console.log(`📚 Books endpoint: http://localhost:${PORT}/api/books`);
});
