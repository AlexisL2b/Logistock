import express from "express"
import {
  getAllSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js"
import validate from "../middlewares/validate.js"
import { supplierSchema } from "../validations/supplierValidation.js"
import authenticate from "../middlewares/authenticate.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

router.get("/", getAllSuppliers) // GET /api/suppliers
router.get("/:id", getSupplierById) // GET /api/suppliers/:id
router.post(
  "/",
  validate(supplierSchema),
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  addSupplier
) // ✅ Validation ajoutée ici
router.put(
  "/:id",
  validate(supplierSchema),
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  updateSupplier
) // ✅ Validation ajoutée ici
router.delete(
  "/:id",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  deleteSupplier
) // DELETE /api/suppliers/:id

export default router
