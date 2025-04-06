import express from "express"
import transporterController from "../controllers/transporterController.js"
import validate from "../middlewares/validate.js"
import { transporterSchema } from "../validations/transporterValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get("/", transporterController.getAll) // ✅ GET /api/transporters
router.get("/:id", transporterController.getById) // ✅ GET /api/transporters/:id

router.post(
  "/",
  validate(transporterSchema),
  protect,
  checkRole("Admin", "Gestionnaire"),

  transporterController.create
) // ✅ POST /api/transporters

router.put(
  "/:id",
  validate(transporterSchema),
  protect,
  checkRole("Admin", "Gestionnaire"),

  transporterController.update
) // ✅ PUT /api/transporters/:id

router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),

  transporterController.remove
) // ✅ DELETE /api/transporters/:id

export default router
