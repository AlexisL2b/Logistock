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

const router = express.Router()

router.get("/", getAllCategories)
router.get("/:id", getCategoryById)
router.post("/", validate(categorySchema), addCategory) // ✅ Validation ajoutée ici
router.put("/:id", validate(categorySchema), updateCategory) // ✅ Validation ajoutée ici
router.delete("/:id", deleteCategory)

export default router
