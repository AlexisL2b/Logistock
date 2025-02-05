import express from "express"
import {
  getAllRoles,
  getRoleById,
  addRole,
  updateRole,
  deleteRole,
} from "../controllers/roleController.js"

const router = express.Router()

router.get("/", getAllRoles) // GET /api/roles
router.get("/:id", getRoleById) // GET /api/roles/:id
router.post("/", addRole) // POST /api/roles
router.put("/:id", updateRole) // PUT /api/roles/:id
router.delete("/:id", deleteRole) // DELETE /api/roles/:id

export default router
