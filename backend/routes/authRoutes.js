import express from "express"
import {
  createUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js"
import validate from "../middlewares/validate.js"
import { registerSchema, loginSchema } from "../validation/authValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import checkRole from "../middlewares/checkRole.js"

const router = express.Router()

/**
 * 🔹 Route d'inscription
 */
router.post(
  "/register",
  protect, // Vérifie que l'utilisateur est connecté
  checkRole("admin", "gestionnaire"), // Seuls les admins ou gestionnaires peuvent créer des utilisateurs
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
