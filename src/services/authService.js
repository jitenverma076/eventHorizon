import api from "./api"

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData)
    return response
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials)
    return response
  },

  // Get current user
  getMe: async () => {
    const response = await api.get("/auth/me")
    return response
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put("/auth/me", userData)
    return response
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await api.put("/auth/updatepassword", passwordData)
    return response
  },

  // Logout
  logout: async () => {
    const response = await api.get("/auth/logout")
    localStorage.removeItem("token")
    return response
  },
}

export default authService
