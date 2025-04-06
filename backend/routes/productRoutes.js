import express from "express"
import productController from "../controllers/productController.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"
import validate from "../middlewares/validate.js"
import { productSchema } from "../validations/productValidation.js"

const router = express.Router()

// 🔹 Récupérer tous les produits (accès public ou selon règles définies)
router.get("/", productController.getAll)

// 🔹 Récupérer un produit par ID (authentification requise)
router.get("/:id", protect, productController.getById)

// 🔹 Créer un nouveau produit (réservé à Admin ou Gestionnaire)
router.post(
  "/",
  protect,
  checkRole("Admin", "Gestionnaire"),
  validate(productSchema),

  productController.create
)

// 🔹 Mettre à jour un produit existant
router.put(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),
  validate(productSchema),

  productController.update
)

// 🔹 Supprimer un produit
router.delete(
  "/:id",
  protect,

  checkRole("Admin", "Gestionnaire"),
  productController.remove
)

export default router
