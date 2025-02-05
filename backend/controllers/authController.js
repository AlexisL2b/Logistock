import AuthService from "../services/authService.js"

// ✅ Inscription utilisateur
export const createUser = async (req, res) => {
  try {
    const newUser = await AuthService.createUser(req.body)
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      data: newUser,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ Connexion utilisateur
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await AuthService.loginUser(email, password)
    res.status(200).json(result)
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}

// ✅ Récupérer le profil utilisateur via Firebase UID
export const getUserProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.uid
    const user = await AuthService.getUserProfile(firebaseUid)
    res.status(200).json({
      message: "Informations utilisateur récupérées avec succès",
      user,
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
