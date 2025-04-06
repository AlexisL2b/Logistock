import express from "express"
import {
  createUser,
  getCsrfToken,
  loginUser,
  // getUserProfile,
} from "../controllers/authController.js"
import validate from "../middlewares/validate.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"
import { loginSchema, registerSchema } from "../validations/authValidation.js"
import { csrfProtection } from "../middlewares/csrfMiddleware.js"

const router = express.Router()

router.post("/login", validate(loginSchema), loginUser)
// router.get("/csrf_token", getCsrfToken)

/**
 * 🔹 Route protégée : Récupération du profil utilisateur
 */
// router.get("/profile", protect, getUserProfile)

export default router
