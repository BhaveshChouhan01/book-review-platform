import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import bookService from '../services/bookService'
import reviewService from '../services/reviewService'
import { formatDate } from '../utils/helpers'

const BookDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: ''
  })
  const [reviewErrors, setReviewErrors] = useState({})

  useEffect(() => {
    fetchBookDetails()
  }, [id])

  const fetchBookDetails = async () => {
    try {
      setLoading(true)
      const response = await bookService.getBookById(id)
      setBook(response.data.book)
      setReviews(response.data.reviews)
      setError('')
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch book details')
      console.error('Fetch book details error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return
    }

    try {
      await bookService.deleteBook(id)
      navigate('/')
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete book')
    }
  }

  const validateReview = () => {
    const errors = {}
    
    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      errors.rating = 'Please select a rating between 1 and 5'
    }
    
    if (!reviewForm.reviewText.trim()) {
      errors.reviewText = 'Review text is required'
    } else if (reviewForm.reviewText.trim().length < 10) {
      errors.reviewText = 'Review must be at least 10 characters long'
    }
    
    setReviewErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateReview()) return
    
    try {
      setReviewLoading(true)
      await reviewService.createReview({
        bookId: id,
        rating: parseInt(reviewForm.rating),
        reviewText: reviewForm.reviewText.trim()
      })
      
      // Refresh book details to get updated reviews
      await fetchBookDetails()
      
      // Reset form
      setReviewForm({ rating: 5, reviewText: '' })
      setShowReviewForm(false)
      setReviewErrors({})
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit review'
      setReviewErrors({ submit: errorMessage })
    } finally {
      setReviewLoading(false)
    }
  }

  const StarRating = ({ rating, interactive = false, onChange = null }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onChange ? () => onChange(star) : undefined}
            className={`text-2xl ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
        {!interactive && (
          <span className="ml-2 text-gray-600">
            ({rating > 0 ? rating.toFixed(1) : 'No ratings'})
          </span>
        )}
      </div>
    )
  }

  const ReviewCard = ({ review }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
            {review.userId.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800">{review.userId.name}</p>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="alert alert-error">
          {error}
        </div>
        <Link to="/" className="btn btn-secondary mt-4">
          ← Back to Home
        </Link>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-600 text-lg">Book not found</p>
        <Link to="/" className="btn btn-primary mt-4">
          ← Back to Home
        </Link>
      </div>
    )
  }

  const userHasReviewed = user && reviews.some(review => review.userId._id === user.id)
  const isBookOwner = user && book.addedBy._id === user.id

  return (
    <div className="max-w-4xl mx-auto">
      {/* Book Details */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-2">by {book.author}</p>
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {book.genre}
                </span>
                <span className="text-gray-600">Published: {book.publishedYear}</span>
              </div>
            </div>
            
            {isBookOwner && (
              <div className="flex space-x-2">
                <Link to={`/edit-book/${book._id}`} className="btn btn-secondary">
                  Edit
                </Link>
                <button onClick={handleDeleteBook} className="btn btn-danger">
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <StarRating rating={book.averageRating} />
            <p className="text-sm text-gray-600 mt-1">
              {book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>

          <div className="text-sm text-gray-500 pt-4 border-t">
            Added by {book.addedBy.name} on {formatDate(book.createdAt)}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Reviews ({reviews.length})
            </h2>
            
            {user && !userHasReviewed && !isBookOwner && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn btn-primary"
              >
                {showReviewForm ? 'Cancel' : 'Write Review'}
              </button>
            )}
          </div>
        </div>

        <div className="card-body">
          {/* Review Form */}
          {showReviewForm && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
              
              {reviewErrors.submit && (
                <div className="alert alert-error mb-4">
                  {reviewErrors.submit}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <StarRating
                    rating={reviewForm.rating}
                    interactive={true}
                    onChange={(rating) => setReviewForm(prev => ({ ...prev, rating }))}
                  />
                  {reviewErrors.rating && (
                    <p className="text-red-500 text-sm mt-1">{reviewErrors.rating}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, reviewText: e.target.value }))}
                    className={`textarea h-32 ${reviewErrors.reviewText ? 'border-red-500' : ''}`}
                    placeholder="Share your thoughts about this book..."
                  />
                  {reviewErrors.reviewText && (
                    <p className="text-red-500 text-sm mt-1">{reviewErrors.reviewText}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false)
                      setReviewForm({ rating: 5, reviewText: '' })
                      setReviewErrors({})
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <Link to="/" className="btn btn-secondary">
          ← Back to Books
        </Link>
      </div>
    </div>
  )
}

export default BookDetails
