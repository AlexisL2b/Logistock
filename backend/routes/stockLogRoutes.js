import express from "express"
import {
  getAllStockLogs,
  getStockLogById,
  addStockLog,
  updateStockLog,
  deleteStockLog,
} from "../controllers/stockLogController.js"
import validate from "../middlewares/validate.js"
import { stockLogSchema } from "../validations/stockLogValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get("/", getAllStockLogs) // GET /api/stock_logs
router.get("/:id", getStockLogById) // GET /api/stock_logs/:id
router.post(
  "/",
  validate(stockLogSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  addStockLog
) // ✅ Validation ajoutée ici
router.put(
  "/:id",
  validate(stockLogSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  updateStockLog
) // ✅ Validation ajoutée ici
router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  deleteStockLog
) // DELETE /api/stock_logs/:id

export default router
