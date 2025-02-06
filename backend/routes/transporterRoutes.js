import express from "express"
import {
  getAllTransporters,
  getTransporterById,
  addTransporter,
  updateTransporter,
  deleteTransporter,
} from "../controllers/transporterController.js"
import validate from "../middlewares/validate.js"
import { transporterSchema } from "../validations/transporterValidation.js"

const router = express.Router()

router.get("/", getAllTransporters) // GET /api/transporters
router.get("/:id", getTransporterById) // GET /api/transporters/:id
router.post("/", validate(transporterSchema), addTransporter) // ✅ Validation ajoutée ici
router.put("/:id", validate(transporterSchema), updateTransporter) // ✅ Validation ajoutée ici
router.delete("/:id", deleteTransporter) // DELETE /api/transporters/:id

export default router
