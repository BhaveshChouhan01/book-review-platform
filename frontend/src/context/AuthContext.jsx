import React, { createContext, useContext, useReducer, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      }
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      }
    case 'LOGOUT':
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      }
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      }
    case 'LOAD_USER_FAILURE':
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user on app start if token exists
  useEffect(() => {
    if (state.token) {
      loadUser()
    } else {
      dispatch({ type: 'LOAD_USER_FAILURE' })
    }
  }, [])

  const loadUser = async () => {
    try {
      const response = await authService.getProfile()
      dispatch({ type: 'LOAD_USER_SUCCESS', payload: response.data.user })
    } catch (error) {
      dispatch({ type: 'LOAD_USER_FAILURE' })
    }
  }

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authService.login(email, password)
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const register = async (name, email, password) => {
    try {
      dispatch({ type: 'REGISTER_START' })
      const response = await authService.register(name, email, password)
      dispatch({ type: 'REGISTER_SUCCESS', payload: response.data })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
