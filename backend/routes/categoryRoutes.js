import express from "express"
import {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js"
import validate from "../middlewares/validate.js"
import { categorySchema } from "../validations/categoryValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get(
  "/",
  protect,
  checkRole("admin", "Gestionnaire", "Acheteur"),
  getAllCategories
)
router.get("/:id", getCategoryById)
router.post(
  "/",
  protect,
  checkRole("Admin", "Gestionnaire"),
  validate(categorySchema),
  addCategory
) // ✅ Validation ajoutée ici
router.put(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),
  validate(categorySchema),
  updateCategory
) // ✅ Validation ajoutée ici
router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),
  deleteCategory
)

export default router
