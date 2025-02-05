import express from "express"
import {
  decrementStockForOrder,
  checkStockAvailability,
  getAllStocks,
  getStockById,
  addStock,
  updateStock,
  updateStockByProductId,
  deleteStock,
  incrementStock,
} from "../controllers/stockController.js"

const router = express.Router()

router.post("/decrement", decrementStockForOrder)
router.put("/increment", incrementStock)

router.post("/check", checkStockAvailability)

router.get("/all", getAllStocks)

router.get("/:id", getStockById) // Récupérer un stock par ID
router.post("/", addStock) // Ajouter un stock
router.put("/:id", updateStock) // Mettre à jour un stock par ID
router.put("/update-by-product/:produit_id", updateStockByProductId) // Mettre à jour un stock par ID produit
router.delete("/:id", deleteStock) // Supprimer un stock par ID

export default router
