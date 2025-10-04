import api from './api'

const authService = {
  // Register new user
  register: (name, email, password) => {
    return api.post('/auth/register', { name, email, password })
  },

  // Login user
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
  },

  // Get user profile
  getProfile: () => {
    return api.get('/auth/profile')
  }
}

export default authService
