import express from "express"
import {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getUserProfile,
  getUserByUid,
} from "../controllers/userController.js"
import authenticate from "../middlewares/authenticate.js"

const router = express.Router()

router.get("/", getAllUsers) // GET /api/users
router.get("/:id", getUserById) // GET /api/users/:id
router.post("/", addUser) // POST /api/users
router.put("/:id", updateUser) // PUT /api/users/:id
router.delete("/:id", deleteUser) // DELETE /api/users/:id
router.get("/profile", authenticate, getUserProfile)

export default router
