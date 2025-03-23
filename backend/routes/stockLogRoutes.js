import express from "express"
import stockLogController from "../controllers/stockLogController.js"
import validate from "../middlewares/validate.js"
import { stockLogSchema } from "../validations/stockLogValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

// ✅ Récupérer tous les logs de stock
router.get("/", stockLogController.getAll)

// ✅ Récupérer un log de stock par ID
router.get("/:id", stockLogController.getById)

// ✅ Ajouter un log de stock
router.post(
  "/",
  validate(stockLogSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  stockLogController.create
)

// ✅ Mettre à jour un log de stock
router.put(
  "/:id",
  validate(stockLogSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  stockLogController.update
)

// ✅ Supprimer un log de stock
router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  stockLogController.remove
)

export default router
