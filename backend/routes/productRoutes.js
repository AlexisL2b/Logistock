import express from "express"
import {
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"
import validate from "../middlewares/validate.js"
import { productSchema } from "../validations/productValidation.js"

const router = express.Router()

// ✅ Routes des produits
router.get("/", getAllProducts)

// Récupérer un produit par son ID
router.get("/:id", protect, getProductById)
router.post(
  "/",
  protect,
  validate(productSchema),
  checkRole("Admin", "Gestionnaire"),
  createProduct
)
router.put(
  "/:id",
  protect,
  validate(productSchema),
  checkRole("Admin", "Gestionnaire"),
  updateProduct
)
router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),
  deleteProduct
)

export default router
