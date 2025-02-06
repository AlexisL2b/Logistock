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

const router = express.Router()

router.get("/", getAllOrderDetails) // GET /api/order_details
router.get("/:id", getOrderDetailsById) // GET /api/order_details/:id
router.post("/", validate(orderDetailsSchema), addOrderDetails) // ✅ Validation ajoutée ici
router.put("/:id", validate(orderDetailsSchema), updateOrderDetails) // ✅ Validation ajoutée ici
router.delete("/:id", deleteOrderDetails) // DELETE /api/order_details/:id

export default router
