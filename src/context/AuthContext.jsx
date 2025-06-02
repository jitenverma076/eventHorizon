"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import authService from "@/services/authService"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        loading: true,
        error: null,
      }

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }

    case "AUTH_FAIL":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }

    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      }

    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const userData = await authService.getMe()
          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              user: userData.data,
              token,
            },
          })
        } catch (error) {
          localStorage.removeItem("token")
          dispatch({
            type: "AUTH_FAIL",
            payload: "Session expired",
          })
        }
      } else {
        dispatch({
          type: "AUTH_FAIL",
          payload: null,
        })
      }
    }

    loadUser()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: "AUTH_START" })

      const response = await authService.login(credentials)
      const { user, token } = response

      localStorage.setItem("token", token)

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed"
      dispatch({
        type: "AUTH_FAIL",
        payload: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: "AUTH_START" })

      const response = await authService.register(userData)
      const { user, token } = response

      localStorage.setItem("token", token)

      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user, token },
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed"
      dispatch({
        type: "AUTH_FAIL",
        payload: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    dispatch({ type: "LOGOUT" })
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData)
      dispatch({
        type: "UPDATE_USER",
        payload: response.data,
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Update failed"
      return { success: false, error: errorMessage }
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
