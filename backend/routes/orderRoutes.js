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

const router = express.Router()

router.get("/", getAllOrders) // GET /api/orders
router.get("/all-orders-details", getAllOrdersWithDetails) // GET all orders with details
router.get("/:id", getOrderById) // GET /api/orders/:id
router.post("/", addOrder) // POST /api/orders
router.put("/:id", updateOrder) // PUT /api/orders/:id
router.delete("/:id", deleteOrder) // DELETE /api/orders/:id
router.get("/user/:userId", getOrdersByUserId) // GET orders by user ID
router.get("/user/:userId/orders-details", getOrdersWithDetails) // GET orders with details by user ID

export default router
