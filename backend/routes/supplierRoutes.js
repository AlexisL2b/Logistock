import express from "express"
import supplierController from "../controllers/supplierController.js"
import validate from "../middlewares/validate.js"
import { supplierSchema } from "../validations/supplierValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get("/", supplierController.getAll) // GET /api/suppliers
router.get("/:id", supplierController.getById) // GET /api/suppliers/:id

router.post(
  "/",
  validate(supplierSchema),
  protect,
  checkRole("Admin", "Gestionnaire"),
  supplierController.create
)

router.put(
  "/:id",
  validate(supplierSchema),
  protect,
  checkRole("Admin", "Gestionnaire"),
  supplierController.update
)

router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),
  supplierController.remove
)

export default router
