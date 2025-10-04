const express = require('express');
const { body } = require('express-validator');
const {
  getReviewsByBook,
  getReviewsByUser,
  createReview,
  updateReview,
  deleteReview,
  getReviewById
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation rules for review
const reviewValidation = [
  body('bookId')
    .isMongoId()
    .withMessage('Please provide a valid book ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Review text must be between 10 and 500 characters')
];

const reviewUpdateValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Review text must be between 10 and 500 characters')
];

// @route   GET /api/reviews/book/:bookId
// @desc    Get all reviews for a specific book
// @access  Public
router.get('/book/:bookId', getReviewsByBook);

// @route   GET /api/reviews/user/:userId
// @desc    Get all reviews by a specific user
// @access  Public
router.get('/user/:userId', getReviewsByUser);

// @route   GET /api/reviews/:id
// @desc    Get single review by ID
// @access  Public
router.get('/:id', getReviewById);

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private
router.post('/', auth, reviewValidation, createReview);

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', auth, reviewUpdateValidation, updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', auth, deleteReview);

module.exports = router;
