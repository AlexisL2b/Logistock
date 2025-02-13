import express from "express"
import {
  getAllOrderShipments,
  getOrderShipmentById,
  addOrderShipment,
  updateOrderShipment,
  deleteOrderShipment,
  getOrderShipmentByCommandeId,
} from "../controllers/orderShipmentController.js"
import validate from "../middlewares/validate.js"
import { orderShipmentSchema } from "../validations/orderShipmentValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get("/", getAllOrderShipments) // GET /api/order_shipments
router.get("/:id", getOrderShipmentById) // GET /api/order_shipments/:id
router.get("/by_order_id/:id", getOrderShipmentByCommandeId) // GET /api/order_shipments/by_order_id/:id
router.post(
  "/",
  protect,
  checkRole("Admin", "Gestionnaire"),
  validate(orderShipmentSchema),
  addOrderShipment
) // ✅ Validation ajoutée ici
router.put(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),
  validate(orderShipmentSchema),
  updateOrderShipment
) // ✅ Validation ajoutée ici
router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),
  deleteOrderShipment
) // DELETE /api/order_shipments/:id

export default router
