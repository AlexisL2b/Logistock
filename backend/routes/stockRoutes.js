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
  getStocksWithProducts,
} from "../controllers/stockController.js"
import validate from "../middlewares/validate.js"
import {
  incrementStockSchema,
  stockSchema,
} from "../validations/stockValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.post(
  "/decrement",
  // validate(stockSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  decrementStockForOrder
) // ✅ Validation ajoutée ici
router.put(
  "/increment/:id",
  validate(incrementStockSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  incrementStock
) // ✅ Validation ajoutée ici
router.get("/stocks-with-products", getStocksWithProducts) // Récupérer un stock par ID
router.post("/check", validate(stockSchema), checkStockAvailability) // ✅ Validation ajoutée ici
router.get("/all", getAllStocks) // Récupérer tous les stocks
router.get("/:id", getStockById) // Récupérer un stock par ID
router.post(
  "/",
  validate(stockSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  addStock
) // ✅ Validation ajoutée ici
router.put(
  "/:id",
  // validate(stockSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  updateStock
) // ✅ Validation ajoutée ici
// ✅ Validation ajoutée ici
router.put(
  "/update-by-product/:product_id",
  validate(stockSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  updateStockByProductId
) // ✅ Validation ajoutée ici
router.delete("/:id", deleteStock) // Supprimer un stock par ID

export default router
