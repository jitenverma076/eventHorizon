"use client"

import { createContext, useContext, useReducer } from "react"
import eventService from "@/services/eventService"

const EventContext = createContext()

const initialState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
  filters: {
    category: "",
    city: "",
    dateFrom: "",
    dateTo: "",
    priceMin: "",
    priceMax: "",
    search: "",
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },
}

const eventReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    case "SET_EVENTS":
      return {
        ...state,
        events: action.payload.events,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
      }

    case "ADD_EVENTS":
      return {
        ...state,
        events: [...state.events, ...action.payload.events],
        pagination: action.payload.pagination,
        loading: false,
      }

    case "SET_CURRENT_EVENT":
      return {
        ...state,
        currentEvent: action.payload,
        loading: false,
        error: null,
      }

    case "UPDATE_FILTERS":
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      }

    case "RESET_FILTERS":
      return {
        ...state,
        filters: initialState.filters,
      }

    case "CLEAR_EVENTS":
      return {
        ...state,
        events: [],
        pagination: initialState.pagination,
      }

    default:
      return state
  }
}

export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState)

  // Fetch events
  const fetchEvents = async (page = 1, append = false) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const params = {
        page,
        limit: state.pagination.limit,
        ...state.filters,
      }

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })

      const response = await eventService.getEvents(params)

      const pagination = {
        page: page,
        limit: state.pagination.limit,
        total: response.count,
        hasNext: response.pagination?.next ? true : false,
        hasPrev: response.pagination?.prev ? true : false,
      }

      if (append) {
        dispatch({
          type: "ADD_EVENTS",
          payload: {
            events: response.data,
            pagination,
          },
        })
      } else {
        dispatch({
          type: "SET_EVENTS",
          payload: {
            events: response.data,
            pagination,
          },
        })
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to fetch events",
      })
    }
  }

  // Fetch single event
  const fetchEvent = async (eventId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await eventService.getEvent(eventId)
      dispatch({
        type: "SET_CURRENT_EVENT",
        payload: response.data,
      })
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Failed to fetch event",
      })
    }
  }

  // Search events
  const searchEvents = async (searchParams) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await eventService.searchEvents(searchParams)
      dispatch({
        type: "SET_EVENTS",
        payload: {
          events: response.data,
          pagination: {
            ...state.pagination,
            page: 1,
            total: response.count,
          },
        },
      })
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Search failed",
      })
    }
  }

  // Update filters
  const updateFilters = (newFilters) => {
    dispatch({
      type: "UPDATE_FILTERS",
      payload: newFilters,
    })
  }

  // Reset filters
  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" })
  }

  // Clear events
  const clearEvents = () => {
    dispatch({ type: "CLEAR_EVENTS" })
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: "SET_ERROR", payload: null })
  }

  const value = {
    ...state,
    fetchEvents,
    fetchEvent,
    searchEvents,
    updateFilters,
    resetFilters,
    clearEvents,
    clearError,
  }

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}

export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
}
