const express = require("express")
const Event = require("../models/Event")
const Booking = require("../models/Booking")
const User = require("../models/User")
const { protect, authorize } = require("../middleware/auth")

const router = express.Router()

// @desc    Get organizer analytics
// @route   GET /api/analytics/organizer
// @access  Private (Organizer)
router.get("/organizer", protect, authorize("organizer", "admin"), async (req, res, next) => {
  try {
    const organizerId = req.user.id

    // Get events by organizer
    const events = await Event.find({ organizer: organizerId })
    const eventIds = events.map((e) => e._id)

    // Get bookings for organizer's events
    const bookings = await Booking.find({
      event: { $in: eventIds },
      bookingStatus: "confirmed",
    })

    // Calculate statistics
    const totalEvents = events.length
    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
    const totalTicketsSold = bookings.reduce((sum, booking) => {
      return sum + booking.tickets.reduce((ticketSum, ticket) => ticketSum + ticket.quantity, 0)
    }, 0)

    // Revenue by month (last 12 months)
    const revenueByMonth = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthBookings = bookings.filter(
        (booking) => booking.createdAt >= monthStart && booking.createdAt <= monthEnd,
      )

      const monthRevenue = monthBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)

      revenueByMonth.push({
        month: date.toLocaleString("default", { month: "short", year: "numeric" }),
        revenue: monthRevenue,
        bookings: monthBookings.length,
      })
    }

    // Top performing events
    const eventPerformance = events
      .map((event) => {
        const eventBookings = bookings.filter((b) => b.event.toString() === event._id.toString())
        const revenue = eventBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
        const ticketsSold = eventBookings.reduce((sum, booking) => {
          return sum + booking.tickets.reduce((ticketSum, ticket) => ticketSum + ticket.quantity, 0)
        }, 0)

        return {
          eventId: event._id,
          title: event.title,
          revenue,
          ticketsSold,
          bookings: eventBookings.length,
          capacity: event.totalSeats,
          occupancyRate: event.totalSeats > 0 ? (ticketsSold / event.totalSeats) * 100 : 0,
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Booking status distribution
    const allBookings = await Booking.find({ event: { $in: eventIds } })
    const bookingStatusStats = {
      confirmed: allBookings.filter((b) => b.bookingStatus === "confirmed").length,
      cancelled: allBookings.filter((b) => b.bookingStatus === "cancelled").length,
      refunded: allBookings.filter((b) => b.bookingStatus === "refunded").length,
    }

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalEvents,
          totalBookings,
          totalRevenue,
          totalTicketsSold,
          averageRevenuePerEvent: totalEvents > 0 ? totalRevenue / totalEvents : 0,
        },
        revenueByMonth,
        eventPerformance,
        bookingStatusStats,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get event analytics
// @route   GET /api/analytics/event/:eventId
// @access  Private (Organizer)
router.get("/event/:eventId", protect, authorize("organizer", "admin"), async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access event analytics",
      })
    }

    // Get bookings for this event
    const bookings = await Booking.find({ event: req.params.eventId }).populate("user", "name email")

    // Calculate ticket tier performance
    const tierPerformance = event.ticketTiers.map((tier) => {
      const tierBookings = bookings.filter((booking) => booking.tickets.some((ticket) => ticket.tierName === tier.name))

      const ticketsSold = bookings.reduce((sum, booking) => {
        const tierTickets = booking.tickets.filter((ticket) => ticket.tierName === tier.name)
        return sum + tierTickets.reduce((ticketSum, ticket) => ticketSum + ticket.quantity, 0)
      }, 0)

      const revenue = bookings.reduce((sum, booking) => {
        const tierTickets = booking.tickets.filter((ticket) => ticket.tierName === tier.name)
        return sum + tierTickets.reduce((ticketSum, ticket) => ticketSum + ticket.quantity * ticket.pricePerTicket, 0)
      }, 0)

      return {
        name: tier.name,
        totalSeats: tier.totalSeats,
        availableSeats: tier.availableSeats,
        soldSeats: ticketsSold,
        revenue,
        occupancyRate: (ticketsSold / tier.totalSeats) * 100,
      }
    })

    // Sales over time (daily for last 30 days)
    const salesOverTime = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)

      const dayBookings = bookings.filter((booking) => booking.createdAt >= dayStart && booking.createdAt < dayEnd)

      const dayRevenue = dayBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)

      salesOverTime.push({
        date: dayStart.toISOString().split("T")[0],
        bookings: dayBookings.length,
        revenue: dayRevenue,
      })
    }

    // Attendee demographics (simplified)
    const attendeeEmails = bookings.map((b) => b.user.email)
    const uniqueAttendees = [...new Set(attendeeEmails)]

    res.status(200).json({
      success: true,
      data: {
        eventInfo: {
          title: event.title,
          totalCapacity: event.totalSeats,
          totalSold: event.totalSeats - event.availableSeats,
          totalRevenue: bookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
          totalBookings: bookings.length,
          uniqueAttendees: uniqueAttendees.length,
        },
        tierPerformance,
        salesOverTime,
        analytics: event.analytics,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
