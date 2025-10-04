// Format date to readable string
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Format rating to display stars
export const formatRating = (rating) => {
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
  return `${stars} (${rating.toFixed(1)})`
}

// Truncate text to specified length
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate pagination info
export const getPaginationInfo = (currentPage, totalPages, totalItems) => {
  const startItem = (currentPage - 1) * 5 + 1
  const endItem = Math.min(currentPage * 5, totalItems)
  
  return {
    startItem,
    endItem,
    totalItems,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  }
}

// Genre options for book form
export const genreOptions = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Fantasy',
  'Thriller',
  'Biography',
  'History',
  'Self-Help',
  'Poetry',
  'Drama',
  'Horror',
  'Adventure',
  'Other'
]
