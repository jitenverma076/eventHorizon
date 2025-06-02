const express = require("express")
const Waitlist = require("../models/Waitlist")
const Event = require("../models/Event")
const { protect } = require("../middleware/auth")
const { validateWaitlist, validateObjectId, checkValidation } = require("../middleware/validation")

const router = express.Router()

// @desc    Join waitlist
// @route   POST /api/waitlist
// @access  Private
router.post("/", protect, validateWaitlist, checkValidation, async (req, res, next) => {
  try {
    const { eventId, ticketTier, quantity, maxPrice } = req.body

    // Check if event exists
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Check if ticket tier exists
    const tier = event.ticketTiers.find((t) => t.name === ticketTier)
    if (!tier) {
      return res.status(400).json({
        success: false,
        message: "Ticket tier not found",
      })
    }

    // Check if seats are actually unavailable
    if (tier.availableSeats >= quantity) {
      return res.status(400).json({
        success: false,
        message: "Tickets are currently available. Please book directly.",
      })
    }

    // Check if user already on waitlist for this event/tier
    const existingEntry = await Waitlist.findOne({
      user: req.user.id,
      event: eventId,
      ticketTier,
      status: "active",
    })

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "You are already on the waitlist for this ticket tier",
      })
    }

    // Create waitlist entry
    const waitlistEntry = await Waitlist.create({
      user: req.user.id,
      event: eventId,
      ticketTier,
      quantity,
      maxPrice,
    })

    await waitlistEntry.populate("event", "title dateTime")

    res.status(201).json({
      success: true,
      data: waitlistEntry,
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get user waitlist entries
// @route   GET /api/waitlist/me
// @access  Private
router.get("/me", protect, async (req, res, next) => {
  try {
    const waitlistEntries = await Waitlist.find({ user: req.user.id })
      .populate("event", "title dateTime venue images")
      .sort("-createdAt")

    res.status(200).json({
      success: true,
      count: waitlistEntries.length,
      data: waitlistEntries,
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Remove from waitlist
// @route   DELETE /api/waitlist/:id
// @access  Private
router.delete("/:id", protect, validateObjectId("id"), checkValidation, async (req, res, next) => {
  try {
    const waitlistEntry = await Waitlist.findById(req.params.id)

    if (!waitlistEntry) {
      return res.status(404).json({
        success: false,
        message: "Waitlist entry not found",
      })
    }

    if (waitlistEntry.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to remove this waitlist entry",
      })
    }

    await waitlistEntry.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get event waitlist (for organizers)
// @route   GET /api/waitlist/event/:eventId
// @access  Private (Organizer)
router.get("/event/:eventId", protect, validateObjectId("eventId"), checkValidation, async (req, res, next) => {
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
        message: "Not authorized to access event waitlist",
      })
    }

    const waitlistEntries = await Waitlist.find({ event: req.params.eventId })
      .populate("user", "name email phone")
      .sort("priority createdAt")

    res.status(200).json({
      success: true,
      count: waitlistEntries.length,
      data: waitlistEntries,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
