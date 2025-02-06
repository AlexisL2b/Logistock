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

const router = express.Router()

router.get("/", getAllOrderShipments) // GET /api/order_shipments
router.get("/:id", getOrderShipmentById) // GET /api/order_shipments/:id
router.get("/by_order_id/:id", getOrderShipmentByCommandeId) // GET /api/order_shipments/by_order_id/:id
router.post("/", validate(orderShipmentSchema), addOrderShipment) // ✅ Validation ajoutée ici
router.put("/:id", validate(orderShipmentSchema), updateOrderShipment) // ✅ Validation ajoutée ici
router.delete("/:id", deleteOrderShipment) // DELETE /api/order_shipments/:id

export default router
