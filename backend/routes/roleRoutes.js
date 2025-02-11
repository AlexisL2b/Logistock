import express from "express"
import {
  getAllRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole,
} from "../controllers/roleController.js"
import validate from "../middlewares/validate.js"
import { roleSchema } from "../validations/roleValidation.js"

const router = express.Router()

router.get("/", getAllRoles) // GET /api/roles
router.get("/:id", getRoleById) // GET /api/roles/:id
router.post("/", validate(roleSchema), addRole) // ✅ Validation ajoutée ici
router.put("/:id", validate(roleSchema), updateRole) // ✅ Validation ajoutée ici
router.delete("/:id", deleteRole) // DELETE /api/roles/:id

export default router
