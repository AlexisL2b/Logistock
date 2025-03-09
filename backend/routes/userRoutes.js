import express from "express"
import {
  getUserProfile,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getBuyers,
} from "../controllers/userController.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"
import { userSchema } from "../validations/userValidation.js"
import validate from "../middlewares/validate.js"

const router = express.Router()

// 🔹 Récupérer tous les utilisateurs (seuls les admins peuvent y accéder)
router.get("/", protect, checkRole("admin"), getAllUsers)

// 🔹 Récupérer le profil de l'utilisateur connecté
router.get("/profile", protect, getUserProfile)

// 🔹 Récupérer la liste des acheteurs (accessible uniquement aux admins et gestionnaires)
router.get("/buyers", protect, checkRole("admin", "Gestionnaire"), getBuyers)

// 🔹 Créer un nouvel utilisateur (seuls les admins et gestionnaires peuvent le faire)
router.post(
  "/",
  // protect,
  // checkRole("admin", "Gestionnaire"),
  validate(userSchema),
  createUser
)

// 🔹 Mettre à jour un utilisateur (seuls les admins et gestionnaires peuvent le faire)
router.put(
  "/:id",
  protect,
  checkRole("admin", "Gestionnaire"),

  // validate(userSchema),
  updateUser
)

// 🔹 Supprimer un utilisateur (seuls les admins peuvent le faire)
router.delete("/:id", protect, checkRole("admin", "Gestionnaire"), deleteUser)

export default router
