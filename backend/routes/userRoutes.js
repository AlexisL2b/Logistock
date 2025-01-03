import express from "express"
import {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js"

const router = express.Router()

router.get("/", getAllUsers) // GET /api/users
router.get("/:id", getUserById) // GET /api/users/:id
router.post("/", addUser) // POST /api/users
router.put("/:id", updateUser) // PUT /api/users/:id
router.delete("/:id", deleteUser) // DELETE /api/users/:id

export default router
