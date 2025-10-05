import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import bookService from '../services/bookService'
import reviewService from '../services/reviewService'
import { formatDate } from '../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const BookDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)
  
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    reviewText: ''
  })
  const [reviewErrors, setReviewErrors] = useState({})

  useEffect(() => {
    fetchBookDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      
      await fetchBookDetails()
      
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

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      await reviewService.deleteReview(reviewId)
      await fetchBookDetails()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete review')
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
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            } ${interactive ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
            disabled={!interactive}
          >
            ★
          </button>
        ))}
        {!interactive && (
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            ({rating > 0 ? rating.toFixed(1) : 'No ratings'})
          </span>
        )}
      </div>
    )
  }

  const RatingDistribution = ({ reviews }) => {
    const distribution = [1, 2, 3, 4, 5].map(rating => ({
      rating: `${rating} ★`,
      count: reviews.filter(r => r.rating === rating).length
    }))

    const COLORS = ['#EF4444', '#F59E0B', '#FCD34D', '#A3E635', '#22C55E']

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Rating Distribution
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={distribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="rating" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: 'none',
                borderRadius: '8px',
                color: '#F3F4F6'
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {distribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const ReviewCard = ({ review }) => {
    const isReviewOwner = user && review.userId._id === user.id

    return (
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-b-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-lg">
              {review.userId.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">{review.userId.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(review.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <StarRating rating={review.rating} />
            {isReviewOwner && (
              <button
                onClick={() => handleDeleteReview(review._id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                title="Delete review"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">{review.reviewText}</p>
      </div>
    )
  }

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
          Back to Home
        </Link>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">Book not found</p>
        <Link to="/" className="btn btn-primary mt-4">
          Back to Home
        </Link>
      </div>
    )
  }

  const userHasReviewed = user && reviews.some(review => review.userId._id === user.id)
  const isBookOwner = user && book.addedBy._id === user.id

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card mb-8 dark:bg-gray-800">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img 
                src={book.coverImage || 'https://via.placeholder.com/300x450/4F46E5/ffffff?text=No+Cover'} 
                alt={book.title}
                className="w-full md:w-64 h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/4F46E5/ffffff?text=No+Cover'
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-3">by {book.author}</p>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                      {book.genre}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">Published: {book.publishedYear}</span>
                  </div>
                </div>
                
                {isBookOwner && (
                  <div className="flex space-x-2">
                    <Link to={`/edit-book/${book._id}`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                    <button onClick={handleDeleteBook} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <StarRating rating={book.averageRating} />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{book.description}</p>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 pt-4 border-t dark:border-gray-700">
                Added by <span className="font-medium">{book.addedBy.name}</span> on {formatDate(book.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {reviews.length > 0 && <RatingDistribution reviews={reviews} />}

      <div className="card dark:bg-gray-800">
        <div className="card-header dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
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
            
            {!user && (
              <Link to="/login" className="btn btn-primary">
                Login to Review
              </Link>
            )}
          </div>
        </div>

        <div className="card-body">
          {showReviewForm && (
            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Write Your Review</h3>
              
              {reviewErrors.submit && (
                <div className="alert alert-error mb-4">
                  {reviewErrors.submit}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, reviewText: e.target.value }))}
                    className={`textarea h-32 ${reviewErrors.reviewText ? 'border-red-500' : ''}`}
                    placeholder="Share your thoughts about this book... (minimum 10 characters)"
                    maxLength="500"
                  />
                  {reviewErrors.reviewText && (
                    <p className="text-red-500 text-sm mt-1">{reviewErrors.reviewText}</p>
                  )}
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {reviewForm.reviewText.length}/500 characters
                  </p>
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

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No reviews yet. Be the first to review this book!</p>
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

      <div className="mt-8">
        <Link to="/" className="btn btn-secondary">
          Back to Books
        </Link>
      </div>
    </div>
  )
}

export default BookDetails