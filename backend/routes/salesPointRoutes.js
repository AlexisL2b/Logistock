import express from "express"
import {
  getAllSalesPoints,
  getSalesPointById,
  addSalesPoint,
  updateSalesPoint,
  deleteSalesPoint,
} from "../controllers/salesPointController.js"

const router = express.Router()

router.get("/", getAllSalesPoints)
router.get("/:id", getSalesPointById)
router.post("/", addSalesPoint)
router.put("/:id", updateSalesPoint)
router.delete("/:id", deleteSalesPoint)

export default router
