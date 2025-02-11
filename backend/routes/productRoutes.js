import express from "express"
import {
  getProductById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js"
import authenticate from "../middlewares/authenticate.js"
import checkRole from "../middlewares/checkRole.js"

const router = express.Router()

// ✅ Routes des produits
router.get("/", getAllProducts)

// Récupérer un produit par son ID
router.get("/:id", getProductById)
router.post(
  "/",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  createProduct
)
router.put(
  "/:id",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  updateProduct
)
router.delete(
  "/:id",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  deleteProduct
)

export default router

// import express from "express"
// import {
//   getAllProducts,
//   getProductById,
//   addProduct,
//   updateProduct,
//   deleteProduct,
//   updateProductStock,
// } from "../controllers/productController.js"

// const router = express.Router()

// // Route pour récupérer tous les produits
// router.get("/", getAllProducts)

// // Route pour récupérer un produit par ID
// router.get("/:id", getProductById)

// // Route pour ajouter un produit
// router.post("/", addProduct)
// router.put("/:id/stock", updateProductStock)

// // Route pour mettre à jour un produit
// router.put("/:id", updateProduct)

// // Route pour supprimer un produit
// router.delete("/:id", deleteProduct)

// export default router
