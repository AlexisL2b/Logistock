import express from "express"
import {
  getAllOrderShipments,
  getOrderShipmentById,
  addOrderShipment,
  updateOrderShipment,
  deleteOrderShipment,
} from "../controllers/orderShipmentController.js"

const router = express.Router()

router.get("/", getAllOrderShipments) // GET /api/order_shipments
router.get("/:id", getOrderShipmentById) // GET /api/order_shipments/:id
router.post("/", addOrderShipment) // POST /api/order_shipments
router.put("/:id", updateOrderShipment) // PUT /api/order_shipments/:id
router.delete("/:id", deleteOrderShipment) // DELETE /api/order_shipments/:id

export default router
