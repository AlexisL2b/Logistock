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
import checkRole from "../middlewares/checkRole.js"
import authenticate from "../middlewares/authenticate.js"

const router = express.Router()

router.get("/", getAllTransporters) // GET /api/transporters
router.get("/:id", getTransporterById) // GET /api/transporters/:id
router.post(
  "/",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  validate(transporterSchema),
  addTransporter
) // ✅ Validation ajoutée ici
router.put(
  "/:id",
  validate(transporterSchema),
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  updateTransporter
) // ✅ Validation ajoutée ici
router.delete(
  "/:id",
  authenticate,
  checkRole("Admin", "Gestionnaire"),
  deleteTransporter
) // DELETE /api/transporters/:id

export default router
