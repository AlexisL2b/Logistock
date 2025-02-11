import express from "express"
import {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUserId,
  getAllOrdersWithDetails,
  confirmPayment, // ✅ Nouvelle route pour valider un paiement
} from "../controllers/orderController.js"
import validate from "../middlewares/validate.js"
import { orderSchema } from "../validations/orderValidation.js"
import authenticate from "../middlewares/authenticate.js"
import checkRole from "../middlewares/checkRole.js"

const router = express.Router()

router.get("/", getAllOrders) // GET /api/orders
router.get("/all-orders-details", getAllOrdersWithDetails) // GET all orders with details
router.get("/:id", getOrderById) // GET /api/orders/:id
router.post("/", validate(orderSchema), addOrder) // ✅ Création avec Stripe intégrée
router.post("/confirm-payment", authenticate, confirmPayment) // ✅ Nouvelle route pour valider un paiement Stripe
router.put(
  "/:id",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  validate(orderSchema),
  updateOrder
) // ✅ Modification avec validation
router.delete(
  "/:id",
  authenticate,
  checkRole("Admin", "Gestionnaire", "Acheteur"),
  deleteOrder
) // DELETE /api/orders/:id
router.get("/user/:userId", getOrdersByUserId) // GET orders by user ID

export default router
