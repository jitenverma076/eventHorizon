const { body, param, query, validationResult } = require("express-validator")

// Check validation results
exports.checkValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}

// User validation rules
exports.validateRegister = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("phone").optional().isMobilePhone().withMessage("Please provide a valid phone number"),
]

exports.validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

// Event validation rules
exports.validateEvent = [
  body("title").trim().isLength({ min: 3, max: 100 }).withMessage("Event title must be between 3 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  body("category")
    .isIn(["music", "sports", "technology", "business", "arts", "food", "education", "other"])
    .withMessage("Please select a valid category"),
  body("venue.name").trim().notEmpty().withMessage("Venue name is required"),
  body("venue.address.city").trim().notEmpty().withMessage("City is required"),
  body("dateTime.start")
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error("Start date must be in the future")
      }
      return true
    }),
  body("dateTime.end")
    .isISO8601()
    .toDate()
    .custom((value, { req }) => {
      if (value <= new Date(req.body.dateTime.start)) {
        throw new Error("End date must be after start date")
      }
      return true
    }),
  body("ticketTiers").isArray({ min: 1 }).withMessage("At least one ticket tier is required"),
  body("ticketTiers.*.name").trim().notEmpty().withMessage("Ticket tier name is required"),
  body("ticketTiers.*.price.base").isFloat({ min: 0 }).withMessage("Ticket price must be a positive number"),
  body("ticketTiers.*.totalSeats").isInt({ min: 1 }).withMessage("Total seats must be at least 1"),
]

// Booking validation rules
exports.validateBooking = [
  body("eventId").isMongoId().withMessage("Invalid event ID"),
  body("tickets").isArray({ min: 1 }).withMessage("At least one ticket must be selected"),
  body("tickets.*.tierName").trim().notEmpty().withMessage("Ticket tier name is required"),
  body("tickets.*.quantity").isInt({ min: 1, max: 10 }).withMessage("Quantity must be between 1 and 10"),
]

// Waitlist validation rules
exports.validateWaitlist = [
  body("eventId").isMongoId().withMessage("Invalid event ID"),
  body("ticketTier").trim().notEmpty().withMessage("Ticket tier is required"),
  body("quantity").isInt({ min: 1, max: 10 }).withMessage("Quantity must be between 1 and 10"),
  body("maxPrice").isFloat({ min: 0 }).withMessage("Max price must be a positive number"),
]

// MongoDB ObjectId validation
exports.validateObjectId = (field) => [param(field).isMongoId().withMessage(`Invalid ${field}`)]

// Pagination validation
exports.validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
]
