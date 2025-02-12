import express from "express"
import {
  createUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js"
import validate from "../middlewares/validate.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"
import { loginSchema, registerSchema } from "../validations/authValidation.js"

const router = express.Router()

/**
 * 🔹 Route d'inscription (seulement admin et gestionnaire)
 */
router.post(
  "/register",
  protect,
  checkRole("admin", "gestionnaire"), // 🚀 Seuls les admins & gestionnaires peuvent créer des utilisateurs
  validate(registerSchema),
  createUser
)
/**
 * 🔹 Route de connexion
 */
router.post("/login", validate(loginSchema), loginUser)

/**
 * 🔹 Route protégée : Récupération du profil utilisateur
 */
router.get("/profile", protect, getUserProfile)

export default router
