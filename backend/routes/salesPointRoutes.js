import express from "express"
import {
  getAllSalesPoints,
  getSalesPointById,
  addSalesPoint,
  updateSalesPoint,
  deleteSalesPoint,
} from "../controllers/salesPointController.js"
import validate from "../middlewares/validate.js"
import { salesPointSchema } from "../validations/salesPointValidation.js"

const router = express.Router()

router.get("/", getAllSalesPoints) // GET /api/sales_points
router.get("/:id", getSalesPointById) // GET /api/sales_points/:id
router.post("/", validate(salesPointSchema), addSalesPoint) // ✅ Validation ajoutée ici
router.put("/:id", validate(salesPointSchema), updateSalesPoint) // ✅ Validation ajoutée ici
router.delete("/:id", deleteSalesPoint) // DELETE /api/sales_points/:id

export default router
