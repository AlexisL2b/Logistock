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
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get("/", getAllSalesPoints) // GET /api/sales_points
router.get("/:id", getSalesPointById) // GET /api/sales_points/:id
router.post(
  "/",
  validate(salesPointSchema),
  protect,
  checkRole("Admin", "Gestionnaire"),
  addSalesPoint
) // ✅ Validation ajoutée ici
router.put(
  "/:id",
  validate(salesPointSchema),
  protect,
  checkRole("Admin", "Gestionnaire"),
  updateSalesPoint
) // ✅ Validation ajoutée ici
router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),
  deleteSalesPoint
) // DELETE /api/sales_points/:id

export default router
