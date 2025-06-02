const express = require("express")
const Referral = require("../models/Referral")
const User = require("../models/User")
const { protect } = require("../middleware/auth")

const router = express.Router()

// @desc    Get user referrals
// @route   GET /api/referrals/me
// @access  Private
router.get("/me", protect, async (req, res, next) => {
  try {
    const referrals = await Referral.find({ referrer: req.user.id })
      .populate("referee", "name email createdAt")
      .sort("-createdAt")

    const stats = {
      totalReferrals: referrals.length,
      completedReferrals: referrals.filter((r) => r.status === "completed").length,
      totalEarnings: referrals
        .filter((r) => r.status === "completed" && r.reward.referrer.claimed)
        .reduce((sum, r) => sum + r.reward.referrer.amount, 0),
      pendingEarnings: referrals
        .filter((r) => r.status === "completed" && !r.reward.referrer.claimed)
        .reduce((sum, r) => sum + r.reward.referrer.amount, 0),
    }

    res.status(200).json({
      success: true,
      data: {
        referrals,
        stats,
        referralCode: req.user.referralCode,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Validate referral code
// @route   GET /api/referrals/validate/:code
// @access  Public
router.get("/validate/:code", async (req, res, next) => {
  try {
    const user = await User.findOne({ referralCode: req.params.code })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid referral code",
      })
    }

    res.status(200).json({
      success: true,
      data: {
        valid: true,
        referrerName: user.name,
      },
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Claim referral reward
// @route   PUT /api/referrals/:id/claim
// @access  Private
router.put("/:id/claim", protect, async (req, res, next) => {
  try {
    const referral = await Referral.findById(req.params.id)

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Referral not found",
      })
    }

    if (referral.referrer.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to claim this reward",
      })
    }

    if (referral.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Referral is not yet completed",
      })
    }

    if (referral.reward.referrer.claimed) {
      return res.status(400).json({
        success: false,
        message: "Reward already claimed",
      })
    }

    referral.reward.referrer.claimed = true
    await referral.save()

    res.status(200).json({
      success: true,
      message: "Reward claimed successfully",
      data: referral,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
