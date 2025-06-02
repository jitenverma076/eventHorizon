const express = require("express")
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  updatePaymentStatus,
  getEventBookings,
} = require("../controllers/bookingController")

const { protect, authorize } = require("../middleware/auth")
const { validateBooking, validateObjectId, checkValidation } = require("../middleware/validation")

const router = express.Router()

router.route("/").post(protect, validateBooking, checkValidation, createBooking)

router.get("/me", protect, getMyBookings)

router
  .route("/:id")
  .get(protect, validateObjectId("id"), checkValidation, getBooking)
  .put(protect, validateObjectId("id"), checkValidation, updatePaymentStatus)

router.put("/:id/cancel", protect, validateObjectId("id"), checkValidation, cancelBooking)

router.get(
  "/event/:eventId",
  protect,
  authorize("organizer", "admin"),
  validateObjectId("eventId"),
  checkValidation,
  getEventBookings,
)

module.exports = router
