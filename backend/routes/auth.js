const express = require("express")
const { register, login, getMe, updateDetails, updatePassword, logout } = require("../controllers/authController")

const { protect } = require("../middleware/auth")
const { validateRegister, validateLogin, checkValidation } = require("../middleware/validation")

const router = express.Router()

router.post("/register", validateRegister, checkValidation, register)
router.post("/login", validateLogin, checkValidation, login)
router.get("/logout", logout)
router.get("/me", protect, getMe)
router.put("/me", protect, updateDetails)
router.put("/updatepassword", protect, updatePassword)

module.exports = router
