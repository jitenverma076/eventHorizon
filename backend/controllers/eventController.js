const Event = require("../models/Event")
const Booking = require("../models/Booking")
const Waitlist = require("../models/Waitlist")

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    let query = Event.find({ status: "published" })

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"]
    removeFields.forEach((param) => delete reqQuery[param])

    // Create query string
    let queryStr = JSON.stringify(reqQuery)

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

    // Finding resource
    query = Event.find(JSON.parse(queryStr))

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ")
      query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("dateTime.start")
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 20
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Event.countDocuments(JSON.parse(queryStr))

    query = query.skip(startIndex).limit(limit)

    // Populate organizer
    query = query.populate("organizer", "name email")

    // Executing query
    const events = await query

    // Update current prices for dynamic pricing
    events.forEach((event) => {
      if (event.dynamicPricing.enabled) {
        event.updateCurrentPrices()
      }
    })

    // Pagination result
    const pagination = {}

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      }
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      }
    }

    res.status(200).json({
      success: true,
      count: events.length,
      pagination,
      data: events,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email avatar")

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      })
    }

    // Update analytics
    event.analytics.views += 1
    await event.save()

    // Update current prices if dynamic pricing is enabled
    if (event.dynamicPricing.enabled) {
      event.updateCurrentPrices()
    }

    res.status(200).json({
      success: true,
      data: event,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer)
exports.createEvent = async (req, res, next) => {
  try {
    // Add organizer to req.body
    req.body.organizer = req.user.id

    // Initialize available seats same as total seats
    if (req.body.ticketTiers) {
      req.body.ticketTiers.forEach((tier) => {
        tier.availableSeats = tier.totalSeats
        tier.price.current = tier.price.base
      })
    }

    const event = await Event.create(req.body)

    res.status(201).json({
      success: true,
      data: event,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id)

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
        message: "Not authorized to update this event",
      })
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: event,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)

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
        message: "Not authorized to delete this event",
      })
    }

    // Check if there are any bookings
    const bookingCount = await Booking.countDocuments({ event: event._id })
    if (bookingCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete event with existing bookings. Cancel the event instead.",
      })
    }

    await event.deleteOne()

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
exports.searchEvents = async (req, res, next) => {
  try {
    const { q, category, city, dateFrom, dateTo, priceMin, priceMax } = req.query

    const matchStage = { status: "published" }

    // Text search
    if (q) {
      matchStage.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ]
    }

    // Category filter
    if (category) {
      matchStage.category = category
    }

    // City filter
    if (city) {
      matchStage["venue.address.city"] = { $regex: city, $options: "i" }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      matchStage["dateTime.start"] = {}
      if (dateFrom) {
        matchStage["dateTime.start"].$gte = new Date(dateFrom)
      }
      if (dateTo) {
        matchStage["dateTime.start"].$lte = new Date(dateTo)
      }
    }

    // Price range filter
    if (priceMin || priceMax) {
      matchStage["ticketTiers.price.base"] = {}
      if (priceMin) {
        matchStage["ticketTiers.price.base"].$gte = Number.parseFloat(priceMin)
      }
      if (priceMax) {
        matchStage["ticketTiers.price.base"].$lte = Number.parseFloat(priceMax)
      }
    }

    const events = await Event.find(matchStage).populate("organizer", "name").sort("dateTime.start").limit(50)

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get events by organizer
// @route   GET /api/events/organizer/me
// @access  Private (Organizer)
exports.getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user.id }).sort("-createdAt")

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    })
  } catch (error) {
    next(error)
  }
}
