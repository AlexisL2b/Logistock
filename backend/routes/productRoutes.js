import express from "express"
import {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js"

const router = express.Router()

// Route pour récupérer tous les produits
router.get("/", getAllProducts)

// Route pour récupérer un produit par ID
router.get("/:id", getProductById)

// Route pour ajouter un produit
router.post("/", addProduct)

// Route pour mettre à jour un produit
router.put("/:id", updateProduct)

// Route pour supprimer un produit
router.delete("/:id", deleteProduct)

export default router
