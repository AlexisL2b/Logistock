import express from "express"
import {
  getAllStockLogs,
  getStockLogById,
  addStockLog,
  updateStockLog,
  deleteStockLog,
} from "../controllers/stockLogController.js"

const router = express.Router()

router.get("/", getAllStockLogs) // GET /api/stock_logs
router.get("/:id", getStockLogById) // GET /api/stock_logs/:id
router.post("/", addStockLog) // POST /api/stock_logs
router.put("/:id", updateStockLog) // PUT /api/stock_logs/:id
router.delete("/:id", deleteStockLog) // DELETE /api/stock_logs/:id

export default router
