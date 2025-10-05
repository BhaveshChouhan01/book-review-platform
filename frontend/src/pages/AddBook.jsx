import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bookService from '../services/bookService'
import { genreOptions } from '../utils/helpers'

const AddBook = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    publishedYear: new Date().getFullYear(),
    coverImage: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'publishedYear' ? parseInt(value) || '' : value
    }))
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const currentYear = new Date().getFullYear()
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters'
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required'
    } else if (formData.author.trim().length > 100) {
      newErrors.author = 'Author name cannot exceed 100 characters'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long'
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters'
    }
    
    if (!formData.genre) {
      newErrors.genre = 'Please select a genre'
    }
    
    if (!formData.publishedYear) {
      newErrors.publishedYear = 'Published year is required'
    } else if (formData.publishedYear < 1000 || formData.publishedYear > currentYear) {
      newErrors.publishedYear = `Published year must be between 1000 and ${currentYear}`
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setLoading(true)
      const response = await bookService.createBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
        genre: formData.genre,
        publishedYear: formData.publishedYear,
        coverImage: formData.coverImage.trim() || undefined
      })
      
      // Redirect to the newly created book's detail page
      navigate(`/books/${response.data.book._id}`)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create book'
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card dark:bg-gray-800">
        <div className="card-header dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Book</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Share a great book with the community</p>
        </div>
        
        <div className="card-body">
          {errors.submit && (
            <div className="alert alert-error mb-6">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input ${errors.title ? 'border-red-500' : ''}`}
                placeholder="Enter the book title"
                maxLength="200"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {formData.title.length}/200 characters
              </p>
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`input ${errors.author ? 'border-red-500' : ''}`}
                placeholder="Enter the author's name"
                maxLength="100"
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author}</p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {formData.author.length}/100 characters
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={`textarea ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Describe the book, its plot, themes, or what makes it special..."
                maxLength="1000"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className={`select ${errors.genre ? 'border-red-500' : ''}`}
                >
                  <option value="">Select a genre</option>
                  {genreOptions.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                {errors.genre && (
                  <p className="text-red-500 text-sm mt-1">{errors.genre}</p>
                )}
              </div>

              <div>
                <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Published Year *
                </label>
                <input
                  type="number"
                  id="publishedYear"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleChange}
                  className={`input ${errors.publishedYear ? 'border-red-500' : ''}`}
                  placeholder="e.g., 2023"
                  min="1000"
                  max={new Date().getFullYear()}
                />
                {errors.publishedYear && (
                  <p className="text-red-500 text-sm mt-1">{errors.publishedYear}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image URL (optional)
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="input"
                placeholder="https://example.com/book-cover.jpg"
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Paste a URL to a book cover image (leave blank for placeholder)
              </p>
            </div>

            <div className="flex justify-between items-center pt-6 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding Book...
                  </div>
                ) : (
                  'Add Book'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddBook