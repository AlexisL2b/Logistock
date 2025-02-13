import express from "express"
import {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
  getAllOrdersWithDetails,
  confirmPayment,
  getOrdersByBuyer, // ✅ Nouvelle route pour valider un paiement
} from "../controllers/orderController.js"
import validate from "../middlewares/validate.js"
import { orderSchema } from "../validations/orderValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get("/", getAllOrders) // GET /api/orders
router.get("/all-orders-details", getAllOrdersWithDetails) // GET all orders with details
router.get("/:id", getOrderById) // GET /api/orders/:id
router.post("/", validate(orderSchema), addOrder) // ✅ Création avec Stripe intégrée
// router.post("/confirm-payment", protect, confirmPayment) // ✅ Nouvelle route pour valider un paiement Stripe
router.put(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  // validate(orderSchema),
  updateOrder
) // ✅ Modification avec validation
router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire", "Acheteur"),
  deleteOrder
) // DELETE /api/orders/:id
router.get(
  "/user/:buyer_id",
  // protect,
  // checkRole("Admin", "Gestionnaire", "Acheteur"),
  getOrdersByBuyer
) // GET orders by user ID

export default router
