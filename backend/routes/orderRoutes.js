import express from "express"
import {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js"

const router = express.Router()

router.get("/", getAllOrders) // GET /api/orders
router.get("/:id", getOrderById) // GET /api/orders/:id
router.post("/", addOrder) // POST /api/orders
router.put("/:id", updateOrder) // PUT /api/orders/:id
router.delete("/:id", deleteOrder) // DELETE /api/orders/:id

export default router
