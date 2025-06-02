const mongoose = require("mongoose")

const waitlistSchema = new mongoose.Schema(
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
    ticketTier: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    maxPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "notified", "expired", "fulfilled"],
      default: "active",
    },
    priority: {
      type: Number,
      default: 0, // Higher number = higher priority
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    notificationSentAt: Date,
    expiresAt: {
      type: Date,
      default: () => {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      },
    },
    responseDeadline: {
      type: Date,
      default: () => {
        return new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours to respond
      },
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
waitlistSchema.index({ event: 1, status: 1, priority: -1, createdAt: 1 })
waitlistSchema.index({ user: 1 })
waitlistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Compound index to prevent duplicate waitlist entries
waitlistSchema.index({ user: 1, event: 1, ticketTier: 1 }, { unique: true })

// Static method to get next in line
waitlistSchema.statics.getNextInLine = function (eventId, ticketTier, availableQuantity) {
  return this.find({
    event: eventId,
    ticketTier: ticketTier,
    status: "active",
    quantity: { $lte: availableQuantity },
  })
    .sort({ priority: -1, createdAt: 1 })
    .populate("user", "name email phone")
    .limit(10)
}

// Method to notify user
waitlistSchema.methods.notify = function () {
  this.status = "notified"
  this.notificationSent = true
  this.notificationSentAt = new Date()
  this.responseDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000)
  return this.save()
}

// Method to check if response time expired
waitlistSchema.methods.isResponseExpired = function () {
  return this.status === "notified" && new Date() > this.responseDeadline
}

module.exports = mongoose.model("Waitlist", waitlistSchema)
