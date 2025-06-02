const express = require("express")
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
  getMyEvents,
} = require("../controllers/eventController")

const { protect, authorize, optionalAuth } = require("../middleware/auth")
const { validateEvent, validateObjectId, validatePagination, checkValidation } = require("../middleware/validation")

const router = express.Router()

router
  .route("/")
  .get(validatePagination, checkValidation, optionalAuth, getEvents)
  .post(protect, authorize("organizer", "admin"), validateEvent, checkValidation, createEvent)

router.get("/search", searchEvents)
router.get("/organizer/me", protect, authorize("organizer", "admin"), getMyEvents)

router
  .route("/:id")
  .get(validateObjectId("id"), checkValidation, optionalAuth, getEvent)
  .put(protect, authorize("organizer", "admin"), validateObjectId("id"), validateEvent, checkValidation, updateEvent)
  .delete(protect, authorize("organizer", "admin"), validateObjectId("id"), checkValidation, deleteEvent)

module.exports = router
