import api from './api'

const reviewService = {
  // Get reviews for a book
  getReviewsByBook: (bookId) => {
    return api.get(`/reviews/book/${bookId}`)
  },

  // Get reviews by user
  getReviewsByUser: (userId) => {
    return api.get(`/reviews/user/${userId}`)
  },

  // Get single review
  getReviewById: (id) => {
    return api.get(`/reviews/${id}`)
  },

  // Create new review
  createReview: (reviewData) => {
    return api.post('/reviews', reviewData)
  },

  // Update review
  updateReview: (id, reviewData) => {
    return api.put(`/reviews/${id}`, reviewData)
  },

  // Delete review
  deleteReview: (id) => {
    return api.delete(`/reviews/${id}`)
  }
}

export default reviewService
