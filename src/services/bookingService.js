import api from "./api"

const bookingService = {
  // Create booking
  createBooking: async (bookingData) => {
    const response = await api.post("/bookings", bookingData)
    return response
  },

  // Get user bookings
  getMyBookings: async () => {
    const response = await api.get("/bookings/me")
    return response
  },

  // Get single booking
  getBooking: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`)
    return response
  },

  // Cancel booking
  cancelBooking: async (bookingId, reason) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`, { reason })
    return response
  },

  // Update payment status
  updatePaymentStatus: async (bookingId, paymentData) => {
    const response = await api.put(`/bookings/${bookingId}/payment`, paymentData)
    return response
  },

  // Get event bookings (organizer)
  getEventBookings: async (eventId) => {
    const response = await api.get(`/bookings/event/${eventId}`)
    return response
  },
}

export default bookingService
