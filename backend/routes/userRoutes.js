import express from "express"
import {
  getUserProfile,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../controllers/userController.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"
import { userSchema } from "../validations/userValidation.js"
import validate from "../middlewares/validate.js"

const router = express.Router()

router.get("/", protect, getAllUsers)
router.get("/profile", protect, getUserProfile)
router.post("/", protect, checkRole("admin"), validate(userSchema), createUser)
router.put("/:id", protect, checkRole("admin", "gestionnaire"), updateUser)
router.delete("/:id", protect, checkRole("admin"), deleteUser)

export default router
