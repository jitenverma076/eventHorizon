const Booking = require("../models/Booking")
const Event = require("../models/Event")
const Referral = require("../models/Referral")
const Waitlist = require("../models/Waitlist")
const User = require("../models/User") // Added User import
const { sendEmail } = require("../utils/email")
const { generateQRCode } = require("../utils/qrcode")

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, tickets, referralCode } = req.body

    // Get event
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Check if event is published and not past
    if (event.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Event is not available for booking",
      })
    }

    if (event.dateTime.start <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot book tickets for past events",
      })
    }

    // Validate tickets and check availability
    let totalAmount = 0
    const bookingTickets = []

    for (const ticket of tickets) {
      const tier = event.ticketTiers.find((t) => t.name === ticket.tierName)
      if (!tier) {
        return res.status(400).json({
          success: false,
          message: `Ticket tier '${ticket.tierName}' not found`,
        })
      }

      if (tier.availableSeats < ticket.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough seats available for tier '${ticket.tierName}'. Available: ${tier.availableSeats}`,
        })
      }

      // Calculate current price (dynamic pricing)
      const tierIndex = event.ticketTiers.indexOf(tier)
      const currentPrice = event.calculateDynamicPrice(tierIndex)

      bookingTickets.push({
        tierName: ticket.tierName,
        quantity: ticket.quantity,
        pricePerTicket: currentPrice,
      })

      totalAmount += currentPrice * ticket.quantity
    }

    // Handle referral discount
    let discount = { amount: 0 }
    if (referralCode) {
      const referralUser = await User.findOne({ referralCode })
      if (referralUser && referralUser._id.toString() !== req.user.id) {
        // Apply 5% discount up to $25
        const discountAmount = Math.min(totalAmount * 0.05, 25)
        discount = {
          amount: discountAmount,
          code: referralCode,
          type: "referral",
        }
        totalAmount -= discountAmount
      }
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      tickets: bookingTickets,
      totalAmount,
      discount,
      paymentDetails: {
        paymentStatus: "pending",
      },
    })

    // Update seat availability
    for (const ticket of tickets) {
      const tier = event.ticketTiers.find((t) => t.name === ticket.tierName)
      tier.availableSeats -= ticket.quantity
    }

    // Update current prices if dynamic pricing is enabled
    if (event.dynamicPricing.enabled) {
      event.updateCurrentPrices()
    }

    await event.save()

    // Generate QR code
    try {
      const qrCode = await generateQRCode(booking._id.toString())
      booking.qrCode = qrCode
      await booking.save()
    } catch (qrError) {
      console.log("QR code generation failed:", qrError.message)
    }

    // Process referral if applicable
    if (referralCode && discount.amount > 0) {
      const referrer = await User.findOne({ referralCode })
      if (referrer) {
        const referral = await Referral.findOne({
          referrer: referrer._id,
          referee: req.user.id,
          status: "pending",
        })

        if (referral) {
          await referral.complete(booking)
        }
      }
    }

    // Check waitlist and notify next users
    for (const ticket of tickets) {
      const waitlistUsers = await Waitlist.getNextInLine(
        eventId,
        ticket.tierName,
        5, // Notify up to 5 users
      )

      for (const waitlistEntry of waitlistUsers) {
        try {
          await sendEmail({
            to: waitlistEntry.user.email,
            subject: "Tickets Available - Your Waitlist Alert!",
            template: "waitlist-notification",
            data: {
              userName: waitlistEntry.user.name,
              eventTitle: event.title,
              ticketTier: waitlistEntry.ticketTier,
              eventDate: event.dateTime.start,
            },
          })

          await waitlistEntry.notify()
        } catch (emailError) {
          console.log("Waitlist notification email failed:", emailError.message)
        }
      }
    }

    // Send booking confirmation email
    try {
      await sendEmail({
        to: req.user.email,
        subject: "Booking Confirmation - EventHorizon",
        template: "booking-confirmation",
        data: {
          bookingId: booking._id,
          eventTitle: event.title,
          eventDate: event.dateTime.start,
          venue: event.venue.name,
          tickets: booking.tickets,
          totalAmount: booking.totalAmount,
        },
      })
    } catch (emailError) {
      console.log("Booking confirmation email failed:", emailError.message)
    }

    // Populate and return booking
    await booking.populate("event", "title dateTime venue")

    res.status(201).json({
      success: true,
      data: booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user bookings
// @route   GET /api/bookings/me
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("event", "title dateTime venue status images")
      .sort("-createdAt")

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("event", "title dateTime venue organizer cancellationPolicy")
      .populate("user", "name email")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    // Make sure user owns booking or is organizer
    if (
      booking.user._id.toString() !== req.user.id &&
      booking.event.organizer.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this booking",
      })
    }

    res.status(200).json({
      success: true,
      data: booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event")

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    // Make sure user owns booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to cancel this booking",
      })
    }

    // Check if booking can be cancelled
    if (booking.bookingStatus !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled",
      })
    }

    // Check cancellation policy
    const event = booking.event
    const hoursUntilEvent = (event.dateTime.start - new Date()) / (1000 * 60 * 60)

    if (hoursUntilEvent < event.cancellationPolicy.refundDeadline) {
      return res.status(400).json({
        success: false,
        message: `Cancellation deadline has passed. Must cancel at least ${event.cancellationPolicy.refundDeadline} hours before event.`,
      })
    }

    // Calculate refund amount
    const refundPercentage = event.cancellationPolicy.refundPercentage / 100
    const refundAmount = booking.totalAmount * refundPercentage

    // Update booking
    booking.bookingStatus = "cancelled"
    booking.refund = {
      requested: true,
      requestedAt: new Date(),
      amount: refundAmount,
      reason: req.body.reason || "User cancellation",
    }

    await booking.save()

    // Restore seat availability
    for (const ticket of booking.tickets) {
      const tier = event.ticketTiers.find((t) => t.name === ticket.tierName)
      if (tier) {
        tier.availableSeats += ticket.quantity
      }
    }

    await event.save()

    // Send cancellation confirmation email
    try {
      await sendEmail({
        to: req.user.email,
        subject: "Booking Cancelled - EventHorizon",
        template: "booking-cancellation",
        data: {
          bookingId: booking._id,
          eventTitle: event.title,
          refundAmount: refundAmount,
          processingDays: 3,
        },
      })
    } catch (emailError) {
      console.log("Cancellation confirmation email failed:", emailError.message)
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: {
        refundAmount,
        processingDays: 3,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update payment status
// @route   PUT /api/bookings/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentId, paymentMethod, transactionId, status } = req.body

    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    // Update payment details
    booking.paymentDetails = {
      paymentId,
      paymentMethod,
      transactionId,
      paymentStatus: status,
    }

    await booking.save()

    res.status(200).json({
      success: true,
      data: booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get event bookings (for organizers)
// @route   GET /api/bookings/event/:eventId
// @access  Private (Organizer)
exports.getEventBookings = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId)

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Make sure user is event organizer
    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access event bookings",
      })
    }

    const bookings = await Booking.find({ event: req.params.eventId })
      .populate("user", "name email phone")
      .sort("-createdAt")

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    })
  } catch (error) {
    next(error)
  }
}
