import express from "express"
import {
  getAllOrderDetails,
  getOrderDetailsById,
  addOrderDetails,
  updateOrderDetails,
  deleteOrderDetails,
} from "../controllers/orderDetailsController.js"

const router = express.Router()

router.get("/", getAllOrderDetails) // GET /api/order_details
router.get("/:id", getOrderDetailsById) // GET /api/order_details/:id
router.post("/", addOrderDetails) // POST /api/order_details
router.put("/:id", updateOrderDetails) // PUT /api/order_details/:id
router.delete("/:id", deleteOrderDetails) // DELETE /api/order_details/:id

export default router
