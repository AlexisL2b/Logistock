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
import authenticate from "../middlewares/authenticate.js"
import checkRole from "../middlewares/checkRole.js"

const router = express.Router()

router.get("/", getAllOrders) // GET /api/orders
router.get("/all-orders-details", getAllOrdersWithDetails) // GET all orders with details
router.get("/:id", getOrderById) // GET /api/orders/:id
router.post("/", validate(orderSchema), addOrder) // ✅ Validation ajoutée ici
router.put(
  "/:id",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  validate(orderSchema),
  updateOrder
) // ✅ Validation ajoutée ici
router.delete(
  "/:id",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  deleteOrder
) // DELETE /api/orders/:id
router.get("/user/:userId", getOrdersByUserId) // GET orders by user ID
router.get(
  "/user/:userId/orders-details",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  getOrdersWithDetails
) // GET orders with details by user ID

export default router
