import express from "express"
import {
  getAllTransporters,
  getTransporterById,
  addTransporter,
  updateTransporter,
  deleteTransporter,
} from "../controllers/transporterController.js"

const router = express.Router()

router.get("/", getAllTransporters) // GET /api/transporters
router.get("/:id", getTransporterById) // GET /api/transporters/:id
router.post("/", addTransporter) // POST /api/transporters
router.put("/:id", updateTransporter) // PUT /api/transporters/:id
router.delete("/:id", deleteTransporter) // DELETE /api/transporters/:id

export default router
