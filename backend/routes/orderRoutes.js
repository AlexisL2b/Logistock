import express from "express"
import {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
  getOrdersWithDetails,
  getAllOrdersWithDetails,
} from "../controllers/orderController.js"
import validate from "../middlewares/validate.js"
import { orderSchema } from "../validations/orderValidation.js"

const router = express.Router()

router.get("/", getAllOrders) // GET /api/orders
router.get("/all-orders-details", getAllOrdersWithDetails) // GET all orders with details
router.get("/:id", getOrderById) // GET /api/orders/:id
router.post("/", validate(orderSchema), addOrder) // ✅ Validation ajoutée ici
router.put("/:id", validate(orderSchema), updateOrder) // ✅ Validation ajoutée ici
router.delete("/:id", deleteOrder) // DELETE /api/orders/:id
router.get("/user/:userId", getOrdersByUserId) // GET orders by user ID
router.get("/user/:userId/orders-details", getOrdersWithDetails) // GET orders with details by user ID

export default router
