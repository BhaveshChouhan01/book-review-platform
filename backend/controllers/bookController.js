const { validationResult } = require('express-validator');
const Book = require('../models/Book');
const Review = require('../models/Review');

// @desc    Get all books with pagination
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Enhanced search functionality
    const search = req.query.search || '';
    const genre = req.query.genre || '';
    const author = req.query.author || '';
    const minRating = parseFloat(req.query.minRating) || 0;
    const maxRating = parseFloat(req.query.maxRating) || 5;
    const minYear = parseInt(req.query.minYear) || 1000;
    const maxYear = parseInt(req.query.maxYear) || new Date().getFullYear();
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build advanced query
    let query = {};
    
    // Text search across multiple fields
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Specific author filter
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }
    
    // Genre filter
    if (genre && genre !== 'All') {
      query.genre = genre;
    }
    
    // Rating range filter
    if (minRating > 0 || maxRating < 5) {
      query.averageRating = { 
        $gte: minRating, 
        $lte: maxRating 
      };
    }
    
    // Publication year range filter
    if (minYear > 1000 || maxYear < new Date().getFullYear()) {
      query.publishedYear = { 
        $gte: minYear, 
        $lte: maxYear 
      };
    }

    // Build enhanced sort object
    let sort = {};
    switch (sortBy) {
      case 'rating':
        sort.averageRating = sortOrder;
        sort.reviewCount = -1; // Secondary sort by review count
        break;
      case 'year':
        sort.publishedYear = sortOrder;
        break;
      case 'title':
        sort.title = sortOrder;
        break;
      case 'author':
        sort.author = sortOrder;
        break;
      case 'reviews':
        sort.reviewCount = sortOrder;
        break;
      case 'popularity':
        sort.reviewCount = -1;
        sort.averageRating = -1;
        break;
      default:
        sort.createdAt = sortOrder;
    }

    const books = await Book.find(query)
      .populate('addedBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      books,
      pagination: {
        currentPage: page,
        totalPages,
        totalBooks: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get books error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Get reviews for this book
    const reviews = await Review.find({ bookId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json({ book, reviews });
  } catch (error) {
    console.error('Get book error:', error.message);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, author, description, genre, publishedYear } = req.body;

    const book = new Book({
      title,
      author,
      description,
      genre,
      publishedYear,
      addedBy: req.user.id
    });

    await book.save();
    await book.populate('addedBy', 'name');

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    console.error('Create book error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the owner
    if (book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    const { title, author, description, genre, publishedYear } = req.body;

    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.genre = genre || book.genre;
    book.publishedYear = publishedYear || book.publishedYear;

    await book.save();
    await book.populate('addedBy', 'name');

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error.message);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the owner
    if (book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    // Delete all reviews for this book
    await Review.deleteMany({ bookId: req.params.id });
    
    // Delete the book
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error.message);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get books by user
// @route   GET /api/books/user/:userId
// @access  Public
const getBooksByUser = async (req, res) => {
  try {
    const books = await Book.find({ addedBy: req.params.userId })
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ books });
  } catch (error) {
    console.error('Get user books error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get filter options (genres, authors, years)
// @route   GET /api/books/filters
// @access  Public
const getFilterOptions = async (req, res) => {
  try {
    const [genres, authors, years] = await Promise.all([
      Book.distinct('genre'),
      Book.distinct('author'),
      Book.distinct('publishedYear')
    ]);

    // Get rating distribution
    const ratingStats = await Book.aggregate([
      {
        $group: {
          _id: null,
          minRating: { $min: '$averageRating' },
          maxRating: { $max: '$averageRating' },
          avgRating: { $avg: '$averageRating' }
        }
      }
    ]);

    res.json({
      genres: genres.sort(),
      authors: authors.sort(),
      years: {
        min: Math.min(...years),
        max: Math.max(...years),
        available: years.sort((a, b) => b - a)
      },
      ratings: ratingStats[0] || { minRating: 0, maxRating: 5, avgRating: 0 }
    });
  } catch (error) {
    console.error('Get filter options error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get book statistics
// @route   GET /api/books/stats
// @access  Public
const getBookStats = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalBooks: { $sum: 1 },
          totalReviews: { $sum: '$reviewCount' },
          averageRating: { $avg: '$averageRating' },
          genreDistribution: { $push: '$genre' }
        }
      }
    ]);

    // Get genre distribution
    const genreStats = await Book.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 },
          avgRating: { $avg: '$averageRating' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: stats[0] || { totalBooks: 0, totalReviews: 0, averageRating: 0 },
      genreStats
    });
  } catch (error) {
    console.error('Get book stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getBooksByUser,
  getFilterOptions,
  getBookStats
};
