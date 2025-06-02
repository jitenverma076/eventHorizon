import api from "./api"

const eventService = {
  // Get all events
  getEvents: async (params = {}) => {
    const response = await api.get("/events", { params })
    return response
  },

  // Get single event
  getEvent: async (eventId) => {
    const response = await api.get(`/events/${eventId}`)
    return response
  },

  // Search events
  searchEvents: async (searchParams) => {
    const response = await api.get("/events/search", { params: searchParams })
    return response
  },

  // Create event (organizer)
  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData)
    return response
  },

  // Update event (organizer)
  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/events/${eventId}`, eventData)
    return response
  },

  // Delete event (organizer)
  deleteEvent: async (eventId) => {
    const response = await api.delete(`/events/${eventId}`)
    return response
  },

  // Get organizer events
  getMyEvents: async () => {
    const response = await api.get("/events/organizer/me")
    return response
  },
}

export default eventService
