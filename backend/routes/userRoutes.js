import express from "express"
import {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getUserByUid,
  getAllBuyers,
} from "../controllers/userController.js"
import authenticate from "../middlewares/authenticate.js"
import User from "../models/userModel.js"
import checkRole from "../middlewares/checkRole.js"

const router = express.Router()

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid })
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message })
  }
})

router.get("/", getAllUsers)
router.get("/buyers", getAllBuyers) // 🔥 Route pour récupérer uniquement les acheteur
router.get("/:id", getUserById)
router.get("/uid/:uid", getUserByUid)
router.post(
  "/",
  authenticate,
  checkRole("Admin", "admin", "Gestionnaire"),
  addUser
)
router.put(
  "/:id",
  authenticate,
  checkRole("Admin", "admin", "Gestionnaire"),
  updateUser
)
router.delete(
  "/:id",
  authenticate,
  checkRole("Admin", "admin", "Gestionnaire"),
  deleteUser
)

export default router
