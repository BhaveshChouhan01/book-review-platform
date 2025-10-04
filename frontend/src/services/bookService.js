import api from './api'

const bookService = {
  // Get all books with pagination and filters
  getBooks: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/books?${queryString}`)
  },

  // Get single book by ID
  getBookById: (id) => {
    return api.get(`/books/${id}`)
  },

  // Create new book
  createBook: (bookData) => {
    return api.post('/books', bookData)
  },

  // Update book
  updateBook: (id, bookData) => {
    return api.put(`/books/${id}`, bookData)
  },

  // Delete book
  deleteBook: (id) => {
    return api.delete(`/books/${id}`)
  },

  // Get books by user
  getBooksByUser: (userId) => {
    return api.get(`/books/user/${userId}`)
  }
}

export default bookService
