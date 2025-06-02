const mongoose = require("mongoose")

const referralSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referralCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "expired"],
      default: "pending",
    },
    reward: {
      referrer: {
        amount: {
          type: Number,
          default: 0,
        },
        type: {
          type: String,
          enum: ["percentage", "fixed"],
          default: "fixed",
        },
        claimed: {
          type: Boolean,
          default: false,
        },
      },
      referee: {
        amount: {
          type: Number,
          default: 0,
        },
        type: {
          type: String,
          enum: ["percentage", "fixed"],
          default: "fixed",
        },
        claimed: {
          type: Boolean,
          default: false,
        },
      },
    },
    firstPurchase: {
      booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
      completedAt: Date,
    },
    expiresAt: {
      type: Date,
      default: () => {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
referralSchema.index({ referrer: 1 })
referralSchema.index({ referee: 1 })
referralSchema.index({ referralCode: 1 })
referralSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Static method to calculate referral rewards
referralSchema.statics.calculateRewards = (bookingAmount) => ({
  referrer: {
    amount: Math.min(bookingAmount * 0.1, 50), // 10% up to $50
    type: "fixed",
  },
  referee: {
    amount: Math.min(bookingAmount * 0.05, 25), // 5% up to $25
    type: "fixed",
  },
})

// Method to complete referral
referralSchema.methods.complete = function (booking) {
  this.status = "completed"
  this.firstPurchase.booking = booking._id
  this.firstPurchase.completedAt = new Date()

  // Calculate rewards based on booking amount
  const rewards = this.constructor.calculateRewards(booking.totalAmount)
  this.reward = rewards

  return this.save()
}

module.exports = mongoose.model("Referral", referralSchema)
