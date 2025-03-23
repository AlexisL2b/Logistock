import express from "express"
import roleController from "../controllers/roleController.js"
import validate from "../middlewares/validate.js"
import { roleSchema } from "../validations/roleValidation.js"

const router = express.Router()

// ✅ Routes pour la gestion des rôles
router.get("/", roleController.getAll)
router.get("/:id", roleController.getById)
router.post("/", validate(roleSchema), roleController.create)
router.put("/:id", validate(roleSchema), roleController.update)
router.delete("/:id", roleController.remove)

export default router
