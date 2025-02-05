import express from "express"
import {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getUserByUid,
  // getUserByEmail,
} from "../controllers/userController.js"
import authenticate from "../middlewares/authenticate.js"
import User from "../models/userModel.js"

const router = express.Router()
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid }) // Cherche l'utilisateur par son UID Firebase
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message })
  }
})
router.get("/", getAllUsers) // GET /api/users
router.get("/:id", getUserById) // GET /api/users/:id
// router.get("/email/:email", getUserByEmail) // GET /api/users/:id
router.get("/uid/:uid", getUserByUid) // GET /api/users/:id
router.post("/", addUser) // POST /api/users
router.put("/:id", updateUser) // PUT /api/users/:id
router.delete("/:id", deleteUser) // DELETE /api/users/:id

export default router
