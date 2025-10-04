const express = require('express');
const { body } = require('express-validator');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBooksByUser,
  getFilterOptions,
  getBookStats
} = require('../controllers/bookController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules for book
const bookValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('genre')
    .isIn([
      'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy',
      'Thriller', 'Biography', 'History', 'Self-Help', 'Poetry', 'Drama',
      'Horror', 'Adventure', 'Other'
    ])
    .withMessage('Please select a valid genre'),
  body('publishedYear')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Please provide a valid published year')
];

// @route   GET /api/books/filters
// @desc    Get filter options (genres, authors, years, ratings)
// @access  Public
router.get('/filters', getFilterOptions);

// @route   GET /api/books/stats
// @desc    Get book statistics
// @access  Public
router.get('/stats', getBookStats);

// @route   GET /api/books
// @desc    Get all books with pagination and search
// @access  Public
router.get('/', getBooks);

// @route   GET /api/books/user/:userId
// @desc    Get books by specific user
// @access  Public
router.get('/user/:userId', getBooksByUser);

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', getBookById);

// @route   POST /api/books
// @desc    Create new book
// @access  Private
router.post('/', auth, bookValidation, createBook);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private
router.put('/:id', auth, bookValidation, updateBook);

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private
router.delete('/:id', auth, deleteBook);

module.exports = router;
