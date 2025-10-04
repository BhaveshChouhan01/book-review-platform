import React, { useState, useEffect } from 'react'
import { genreOptions } from '../utils/helpers'

const EnhancedSearch = ({ onSearch, filterOptions, loading }) => {
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    author: '',
    minRating: 0,
    maxRating: 5,
    minYear: 1000,
    maxYear: new Date().getFullYear(),
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Debounce the search for text inputs
    if (key === 'search' || key === 'author') {
      clearTimeout(window.searchTimeout)
      window.searchTimeout = setTimeout(() => {
        onSearch(newFilters)
      }, 300)
    } else {
      onSearch(newFilters)
    }
  }

  const resetFilters = () => {
    const resetFilters = {
      search: '',
      genre: '',
      author: '',
      minRating: 0,
      maxRating: 5,
      minYear: 1000,
      maxYear: new Date().getFullYear(),
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  const sortOptions = [
    { value: 'createdAt', label: 'Date Added' },
    { value: 'rating', label: 'Rating' },
    { value: 'year', label: 'Published Year' },
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'reviews', label: 'Review Count' },
    { value: 'popularity', label: 'Popularity' }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          🔍 Search & Filter Books
        </h2>
        <div className="flex items-center space-x-4">
          {loading && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              Searching...
            </div>
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            {showAdvanced ? 'Simple Search' : 'Advanced Search'}
          </button>
        </div>
      </div>

      {/* Basic Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search title, author, or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div>
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          >
            <option value="">All Genres</option>
            {genreOptions.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
          >
            <option value="desc">↓</option>
            <option value="asc">↑</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t dark:border-gray-600 pt-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Specific Author
              </label>
              <input
                type="text"
                placeholder="Author name..."
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating Range: {filters.minRating} - {filters.maxRating} ⭐
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.maxRating}
                  onChange={(e) => handleFilterChange('maxRating', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Published Year Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={filters.minYear}
                  onChange={(e) => handleFilterChange('minYear', parseInt(e.target.value) || 1000)}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="From"
                />
                <input
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={filters.maxYear}
                  onChange={(e) => handleFilterChange('maxYear', parseInt(e.target.value) || new Date().getFullYear())}
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="To"
                />
              </div>
            </div>
            
            <div className="flex flex-col justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                🔄 Reset All
              </button>
            </div>
          </div>
          
          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('minRating', 4)}
              className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 text-yellow-800 dark:text-yellow-200 rounded-full text-sm transition-colors"
            >
              ⭐ 4+ Stars
            </button>
            <button
              onClick={() => {
                const currentYear = new Date().getFullYear()
                handleFilterChange('minYear', currentYear - 5)
                handleFilterChange('maxYear', currentYear)
              }}
              className="px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-200 rounded-full text-sm transition-colors"
            >
              📅 Recent (5 years)
            </button>
            <button
              onClick={() => handleFilterChange('sortBy', 'popularity')}
              className="px-3 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-800 dark:text-green-200 rounded-full text-sm transition-colors"
            >
              🔥 Popular
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedSearch
