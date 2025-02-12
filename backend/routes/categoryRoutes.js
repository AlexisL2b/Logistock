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
import authenticate from "../middlewares/authenticate.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get(
  "/",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  getAllCategories
)
router.get("/:id", getCategoryById)
router.post(
  "/",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  validate(categorySchema),
  addCategory
) // ✅ Validation ajoutée ici
router.put(
  "/:id",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  validate(categorySchema),
  updateCategory
) // ✅ Validation ajoutée ici
router.delete(
  "/:id",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  deleteCategory
)

export default router
