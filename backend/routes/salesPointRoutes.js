import express from "express"
import {
  getAllSalesPoints,
  getSalesPointById,
  addSalesPoint,
  updateSalesPoint,
  deleteSalesPoint,
} from "../controllers/salesPointController.js"

const router = express.Router()

router.get("/", getAllSalesPoints) // GET /api/sales_points
router.get("/:id", getSalesPointById) // GET /api/sales_points/:id
router.post("/", addSalesPoint) // POST /api/sales_points
router.put("/:id", updateSalesPoint) // PUT /api/sales_points/:id
router.delete("/:id", deleteSalesPoint) // DELETE /api/sales_points/:id

export default router
