const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    tickets: [
      {
        tierName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        pricePerTicket: {
          type: Number,
          required: true,
        },
        seatNumbers: [String],
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      amount: {
        type: Number,
        default: 0,
      },
      code: String,
      type: {
        type: String,
        enum: ["referral", "promo", "early-bird"],
      },
    },
    paymentDetails: {
      paymentId: String,
      paymentMethod: {
        type: String,
        enum: ["stripe", "razorpay", "paypal", "bank-transfer"],
      },
      transactionId: String,
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
    },
    bookingStatus: {
      type: String,
      enum: ["confirmed", "cancelled", "refunded", "transferred"],
      default: "confirmed",
    },
    qrCode: {
      type: String, // Base64 encoded QR code
    },
    checkInStatus: {
      isCheckedIn: {
        type: Boolean,
        default: false,
      },
      checkInTime: Date,
      checkInLocation: String,
    },
    refund: {
      requested: {
        type: Boolean,
        default: false,
      },
      requestedAt: Date,
      processed: {
        type: Boolean,
        default: false,
      },
      processedAt: Date,
      amount: Number,
      reason: String,
    },
    notes: String,
  },
  {
    timestamps: true,
  },
)

// Indexes
bookingSchema.index({ user: 1, event: 1 })
bookingSchema.index({ "paymentDetails.paymentId": 1 })
bookingSchema.index({ createdAt: -1 })

// Generate booking reference
bookingSchema.pre("save", function (next) {
  if (this.isNew) {
    this.bookingReference =
      "EH" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase()
  }
  next()
})

// Calculate total amount
bookingSchema.methods.calculateTotal = function () {
  let total = this.tickets.reduce((sum, ticket) => {
    return sum + ticket.quantity * ticket.pricePerTicket
  }, 0)

  total -= this.discount.amount
  return Math.max(total, 0)
}

// Check if refund is allowed
bookingSchema.methods.isRefundAllowed = function () {
  if (this.bookingStatus !== "confirmed") return false

  // Populate event to check cancellation policy
  return this.populate("event").then(() => {
    const event = this.event
    const hoursUntilEvent = (event.dateTime.start - new Date()) / (1000 * 60 * 60)
    return hoursUntilEvent >= event.cancellationPolicy.refundDeadline
  })
}

bookingSchema.add({ bookingReference: String })

module.exports = mongoose.model("Booking", bookingSchema)
