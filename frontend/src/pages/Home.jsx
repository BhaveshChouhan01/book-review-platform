import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bookService from '../services/bookService'
import EnhancedSearch from '../components/EnhancedSearch'
import StatsCard from '../components/StatsCard'
import { formatRating } from '../utils/helpers'

const Home = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [filterOptions, setFilterOptions] = useState(null)
  const [stats, setStats] = useState(null)
  const [currentFilters, setCurrentFilters] = useState({})

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (Object.keys(currentFilters).length > 0) {
      fetchBooks(currentFilters)
    }
  }, [currentPage])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [booksResponse, filtersResponse, statsResponse] = await Promise.all([
        bookService.getBooks({ page: 1, limit: 5 }),
        fetchFilterOptions(),
        fetchStats()
      ])
      
      setBooks(booksResponse.data.books)
      setPagination(booksResponse.data.pagination)
      setError('')
    } catch (error) {
      setError('Failed to fetch initial data')
      console.error('Fetch initial data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books/filters')
      const data = await response.json()
      setFilterOptions(data)
      return data
    } catch (error) {
      console.error('Failed to fetch filter options:', error)
      return null
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books/stats')
      const data = await response.json()
      setStats(data)
      return data
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      return null
    }
  }

  const fetchBooks = async (filters = {}) => {
    try {
      setSearchLoading(true)
      const params = {
        page: currentPage,
        limit: 5,
        ...filters
      }
      
      const response = await bookService.getBooks(params)
      setBooks(response.data.books)
      setPagination(response.data.pagination)
      setError('')
    } catch (error) {
      setError('Failed to fetch books')
      console.error('Fetch books error:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSearch = (filters) => {
    setCurrentPage(1)
    setCurrentFilters(filters)
    fetchBooks(filters)
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
    <div className="card hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="card-body">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            <Link 
              to={`/books/${book._id}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {book.title}
            </Link>
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded">
            {book.genre}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <span className="font-medium">Author:</span> {book.author}
        </p>
        
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <span className="font-medium">Published:</span> {book.publishedYear}
        </p>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {book.description}
        </p>
        
        <div className="flex items-center justify-between">
          <StarRating rating={book.averageRating} />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400">
          Added by {book.addedBy?.name || 'Unknown'}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          📚 Discover Amazing Books
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Explore our collection of books and share your reviews with the community
        </p>
      </div>

      {/* Statistics Dashboard */}
      <StatsCard stats={stats} loading={loading} />

      {/* Enhanced Search and Filters */}
      <EnhancedSearch 
        onSearch={handleSearch} 
        filterOptions={filterOptions}
        loading={searchLoading}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="spinner"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Books List */}
      {!loading && !error && (
        <>
          {books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                {Object.keys(currentFilters).length > 0 ? 'No books found matching your criteria' : 'No books found'}
              </p>
              <Link to="/add-book" className="btn btn-primary">
                Add the first book
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 mb-8">
                {books.map(book => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  
                  <span className="text-gray-600 dark:text-gray-400">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Home

