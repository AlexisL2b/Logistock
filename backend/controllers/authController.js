import AuthService from "../services/authService.js"

/**
 * 🔹 Inscription utilisateur
 */
export const createUser = async (req, res) => {
  try {
    const currentUserRole = req.user?.role || "Acheteur" // Rôle par défaut si non défini
    console.log("🔹 Rôle du créateur :", currentUserRole)

    const newUser = await AuthService.createUser(req.body, currentUserRole)

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      data: newUser,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * 🔹 Connexion utilisateur
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Authentification avec JWT
    const result = await AuthService.loginUser(email, password)

    // ✅ Stocker le token JWT dans un cookie HTTPOnly sécurisé
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // Expiration : 1h
    })

    res.status(200).json({
      message: "Connexion réussie",
      token: result.token,
      user: result.user,
    })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

/**
 * 🔹 Récupération du profil utilisateur (JWT)
 */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await AuthService.getUserProfile(userId)

    res.status(200).json({
      message: "Profil utilisateur récupéré avec succès",
      user,
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
