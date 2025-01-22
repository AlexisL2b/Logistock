import express from "express"
import { createUser, loginUser } from "../controllers/authController.js"
import authenticate from "../middlewares/authenticate.js"
import User from "../models/userModel.js"

const router = express.Router()

// Route d'inscription
router.post("/register", createUser)

// Route de connexion
router.post("/login", loginUser)
// router.get("/profile", authenticate, (req, res) => {
//   console.log("Route /profile exécutée")
//   res.json({
//     message: "Bienvenue dans votre profil !",
//     user: req.user, // Informations utilisateur décodées depuis le token
//   })
// })

// Route pour récupérer les informations utilisateur via le firebaseUid
router.get("/profile", authenticate, async (req, res) => {
  try {
    // `req.user` contient le token décodé grâce au middleware authenticate
    const firebaseUid = req.user.uid

    // Rechercher l'utilisateur dans MongoDB
    const user = await User.findOne({ firebaseUid })
    // console.log(user)
    if (!user) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable dans MongoDB" })
    }

    // Retourner les informations utilisateur
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
