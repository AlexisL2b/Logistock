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

const router = express.Router()

router.get("/", getAllSuppliers) // GET /api/suppliers
router.get("/:id", getSupplierById) // GET /api/suppliers/:id
router.post("/", validate(supplierSchema), addSupplier) // ✅ Validation ajoutée ici
router.put("/:id", validate(supplierSchema), updateSupplier) // ✅ Validation ajoutée ici
router.delete("/:id", deleteSupplier) // DELETE /api/suppliers/:id

export default router
