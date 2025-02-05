import express from "express"
import { createUser, loginUser } from "../controllers/authController.js"
import authenticate from "../middlewares/authenticate.js"
import User from "../models/userModel.js"

const router = express.Router()

// Route d'inscription
router.post("/register", createUser)

// Route de connexion
router.post("/login", loginUser)

// Route pour récupérer les informations utilisateur via le firebaseUid
router.get("/profile", authenticate, async (req, res) => {
  try {
    const firebaseUid = req.user.uid

    const user = await User.findOne({ firebaseUid })
    if (!user) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable dans MongoDB" })
    }
    res.status(200).json({
      message: "Informations utilisateur récupérées avec succès",
      user,
    })
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'utilisateur depuiis authRoutes :",
      error
    )
    res.status(500).json({ message: "Erreur serveur" })
  }
})

export default router
