const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxLength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      maxLength: [2000, "Description cannot exceed 2000 characters"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: ["music", "sports", "technology", "business", "arts", "food", "education", "other"],
    },
    venue: {
      name: {
        type: String,
        required: [true, "Venue name is required"],
      },
      address: {
        street: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: String,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    dateTime: {
      start: {
        type: Date,
        required: [true, "Start date and time is required"],
      },
      end: {
        type: Date,
        required: [true, "End date and time is required"],
      },
    },
    ticketTiers: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          base: {
            type: Number,
            required: true,
            min: 0,
          },
          current: {
            type: Number,
            required: true,
            min: 0,
          },
        },
        totalSeats: {
          type: Number,
          required: true,
          min: 1,
        },
        availableSeats: {
          type: Number,
          required: true,
        },
        perks: [String],
      },
    ],
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    requiresApproval: {
      type: Boolean,
      default: false,
    },
    cancellationPolicy: {
      refundDeadline: {
        type: Number, // hours before event
        default: 24,
      },
      refundPercentage: {
        type: Number,
        default: 80,
        min: 0,
        max: 100,
      },
    },
    dynamicPricing: {
      enabled: {
        type: Boolean,
        default: false,
      },
      priceIncreaseFactor: {
        type: Number,
        default: 1.1,
      },
      demandThreshold: {
        type: Number,
        default: 0.8, // 80% sold
      },
    },
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      bookingAttempts: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
eventSchema.index({ category: 1, "dateTime.start": 1 })
eventSchema.index({ "venue.address.city": 1 })
eventSchema.index({ organizer: 1 })
eventSchema.index({ status: 1 })

// Virtual for total seats
eventSchema.virtual("totalSeats").get(function () {
  return this.ticketTiers.reduce((total, tier) => total + tier.totalSeats, 0)
})

// Virtual for available seats
eventSchema.virtual("availableSeats").get(function () {
  return this.ticketTiers.reduce((total, tier) => total + tier.availableSeats, 0)
})

// Calculate dynamic pricing
eventSchema.methods.calculateDynamicPrice = function (tierIndex) {
  const tier = this.ticketTiers[tierIndex]
  if (!this.dynamicPricing.enabled) return tier.price.base

  const soldPercentage = (tier.totalSeats - tier.availableSeats) / tier.totalSeats
  const timeToEvent = (this.dateTime.start - new Date()) / (1000 * 60 * 60) // hours

  let priceMultiplier = 1

  // Increase price based on demand
  if (soldPercentage >= this.dynamicPricing.demandThreshold) {
    priceMultiplier *= this.dynamicPricing.priceIncreaseFactor
  }

  // Increase price as event approaches (within 7 days)
  if (timeToEvent <= 168 && timeToEvent > 0) {
    priceMultiplier *= 1 + (1 - timeToEvent / 168) * 0.2
  }

  return Math.round(tier.price.base * priceMultiplier)
}

// Update current prices
eventSchema.methods.updateCurrentPrices = function () {
  this.ticketTiers.forEach((tier, index) => {
    tier.price.current = this.calculateDynamicPrice(index)
  })
}

module.exports = mongoose.model("Event", eventSchema)
