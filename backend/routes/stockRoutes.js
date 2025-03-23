import express from "express"
import {
  getAllStocks,
  getStockById,
  getStocksWithProducts,
  checkStockAvailability,
  addStock,
  updateStock,
  updateStockByProductId,
  incrementStock,
  decrementStockForOrder,
  deleteStock,
} from "../controllers/stockController.js"

import validate from "../middlewares/validate.js"
import {
  stockSchema,
  incrementStockSchema,
} from "../validations/stockValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

// ✅ Lecture
router.get("/all", getAllStocks)
router.get("/stocks-with-products", getStocksWithProducts)
router.get("/:id", getStockById)

// ✅ Vérification de stock avant commande
router.post("/check", validate(stockSchema), checkStockAvailability)

// ✅ Création
router.post(
  "/",
  validate(stockSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  addStock
)

// ✅ Incrémentation
router.put(
  "/increment/:id",
  validate(incrementStockSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  incrementStock
)

// ✅ Décrémentation via commande
router.post(
  "/decrement",
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  decrementStockForOrder
)

// ✅ Mise à jour
router.put(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  updateStock
)

router.put(
  "/update-by-product/:product_id",
  validate(stockSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  updateStockByProductId
)

// ✅ Suppression
router.delete("/:id", deleteStock)

export default router
