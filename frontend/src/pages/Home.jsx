import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import bookService from '../services/bookService'
import EnhancedSearch from '../components/EnhancedSearch'
import StatsCard from '../components/StatsCard'
import api from '../services/api'

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

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await api.get('/books/filters')
      setFilterOptions(response.data)
    } catch (error) {
      console.error('Failed to fetch filter options:', error)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/books/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }, [])

  const fetchBooks = useCallback(async (page, filters = {}) => {
    try {
      setSearchLoading(true)
      const params = {
        page: page,
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
  }, [])

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchFilterOptions(),
        fetchStats()
      ])
      await fetchBooks(1, {})
    } catch (error) {
      setError('Failed to fetch initial data')
      console.error('Fetch initial data error:', error)
    } finally {
      setLoading(false)
    }
  }, [fetchFilterOptions, fetchStats, fetchBooks])

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  useEffect(() => {
    if (!loading && currentPage > 1) {
      fetchBooks(currentPage, currentFilters)
    }
  }, [currentPage, loading, fetchBooks, currentFilters])

  const handleSearch = (filters) => {
    setCurrentPage(1)
    setCurrentFilters(filters)
    fetchBooks(1, filters)
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          ({rating > 0 ? rating.toFixed(1) : 'No ratings'})
        </span>
      </div>
    )
  }

  const BookCard = ({ book }) => (
    <div className="card hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="card-body">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img 
              src={book.coverImage || 'https://via.placeholder.com/150x225/4F46E5/ffffff?text=No+Cover'} 
              alt={book.title}
              className="w-32 h-48 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150x225/4F46E5/ffffff?text=No+Cover'
              }}
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                <Link 
                  to={`/books/${book._id}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {book.title}
                </Link>
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded whitespace-nowrap">
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
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Discover Amazing Books
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Explore our collection of books and share your reviews with the community
        </p>
      </div>

      <StatsCard stats={stats} loading={loading} />
      <EnhancedSearch 
        onSearch={handleSearch} 
        filterOptions={filterOptions}
        loading={searchLoading}
      />

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

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
              <div className={`grid gap-6 mb-8 transition-opacity duration-200 ${searchLoading ? 'opacity-50' : 'opacity-100'}`}>
                {books.map(book => (
                  <BookCard key={`${book._id}-${currentPage}`} book={book} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex flex-col items-center space-y-4 mb-8">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev || searchLoading}
                      className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      {[...Array(pagination.totalPages)].map((_, idx) => (
                        <button
                          key={idx + 1}
                          onClick={() => handlePageChange(idx + 1)}
                          disabled={searchLoading}
                          className={`px-3 py-1 rounded ${
                            currentPage === idx + 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext || searchLoading}
                      className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {books.length} of {pagination.totalBooks} books
                  </span>
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