import express from "express"
import {
  getAllOrderDetails,
  getOrderDetailsById,
  addOrderDetails,
  updateOrderDetails,
  deleteOrderDetails,
} from "../controllers/orderDetailsController.js"
import validate from "../middlewares/validate.js"
import { orderDetailsSchema } from "../validations/orderDetailsValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get("/", getAllOrderDetails) // GET /api/order_details
router.get("/:id", getOrderDetailsById) // GET /api/order_details/:id
router.post(
  "/",
  validate(orderDetailsSchema),
  protect,
  checkRole("Admin", "Gestionnaire", "Acheteur"),
  addOrderDetails
) // ✅ Validation ajoutée ici
router.put(
  "/:id",
  validate(orderDetailsSchema),
  protect,
  checkRole("Admin", "Gestionnaire"),
  updateOrderDetails
) // ✅ Validation ajoutée ici
router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),
  deleteOrderDetails
) // DELETE /api/order_details/:id

export default router
