import express from "express"
import categoryController from "../controllers/categoryController.js"
import validate from "../middlewares/validate.js"
import { categorySchema } from "../validations/categoryValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

// 🔍 Récupérer toutes les catégories (avec rôles autorisés)
router.get(
  "/",
  protect,
  checkRole("admin", "Gestionnaire", "Acheteur"),
  categoryController.getAll
)

// 🔍 Récupérer une catégorie par ID
router.get("/:id", categoryController.getById)

// ➕ Créer une nouvelle catégorie
router.post(
  "/",
  protect,
  checkRole("Admin", "Gestionnaire"),
  validate(categorySchema),
  categoryController.create
)

// ✏️ Mettre à jour une catégorie
router.put(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),
  validate(categorySchema),
  categoryController.update
)

// ❌ Supprimer une catégorie
router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),
  categoryController.remove
)

export default router
