import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import bookService from '../services/bookService'
import reviewService from '../services/reviewService'
import { formatDate } from '../utils/helpers'

const Profile = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('books')
  const [userBooks, setUserBooks] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [booksResponse, reviewsResponse] = await Promise.all([
        bookService.getBooksByUser(user.id),
        reviewService.getReviewsByUser(user.id)
      ])
      
      setUserBooks(booksResponse.data.books)
      setUserReviews(reviewsResponse.data.reviews)
      setError('')
    } catch (error) {
      setError('Failed to fetch user data')
      console.error('Fetch user data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'star-rating' : 'star-empty'}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({rating > 0 ? rating.toFixed(1) : 'No ratings'})
        </span>
      </div>
    )
  }

  const BookCard = ({ book }) => (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            <Link 
              to={`/books/${book._id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {book.title}
            </Link>
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {book.genre}
          </span>
        </div>
        
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Author:</span> {book.author}
        </p>
        
        <p className="text-gray-600 mb-2">
          <span className="font-medium">Published:</span> {book.publishedYear}
        </p>
        
        <p className="text-gray-700 mb-4 line-clamp-2">
          {book.description}
        </p>
        
        <div className="flex items-center justify-between">
          <StarRating rating={book.averageRating} />
          <div className="text-sm text-gray-500">
            {book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Added {formatDate(book.createdAt)}
          </span>
          <div className="space-x-2">
            <Link to={`/edit-book/${book._id}`} className="btn btn-secondary btn-sm">
              Edit
            </Link>
            <Link to={`/books/${book._id}`} className="btn btn-primary btn-sm">
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  const ReviewCard = ({ review }) => (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            <Link 
              to={`/books/${review.bookId._id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {review.bookId.title}
            </Link>
          </h3>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= review.rating ? 'star-rating' : 'star-empty'}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        <p className="text-gray-600 mb-3">
          <span className="font-medium">Author:</span> {review.bookId.author}
        </p>
        
        <p className="text-gray-700 mb-4 leading-relaxed">
          {review.reviewText}
        </p>
        
        <div className="pt-3 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Reviewed {formatDate(review.createdAt)}
          </span>
          <Link to={`/books/${review.bookId._id}`} className="btn btn-primary btn-sm">
            View Book
          </Link>
        </div>
      </div>
    </div>
  )

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Member since {formatDate(user.createdAt || new Date())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {userBooks.length}
            </div>
            <div className="text-gray-600">Books Added</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {userReviews.length}
            </div>
            <div className="text-gray-600">Reviews Written</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('books')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'books'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Books ({userBooks.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Reviews ({userReviews.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          {error}
        </div>
      ) : (
        <>
          {/* Books Tab */}
          {activeTab === 'books' && (
            <div>
              {userBooks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">
                    You haven't added any books yet
                  </p>
                  <Link to="/add-book" className="btn btn-primary">
                    Add Your First Book
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {userBooks.map(book => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              {userReviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-4">
                    You haven't written any reviews yet
                  </p>
                  <Link to="/" className="btn btn-primary">
                    Browse Books to Review
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {userReviews.map(review => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Profile
