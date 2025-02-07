import AuthService from "../services/authService.js"

// ✅ Inscription utilisateur
export const createUser = async (req, res) => {
  try {
    const currentUserRole = req.user?.role || "Acheteur" // 🔥 Vérifie qui fait la requête
    console.log(" 🔥 🔥 🔥 🔥req.user?.roles 🔥 🔥 🔥 🔥", req.user?.role)

    const newUser = await AuthService.createUser(req.body, currentUserRole)
    // console.log("// ✅ Inscription utilisateur", newUser)
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

    // 🔥 On récupère `result` depuis AuthService
    const result = await AuthService.loginUser(email, password)

    // ✅ Vérification que result contient bien le `customToken`
    if (!result.customToken) {
      return res.status(400).json({ message: "Token manquant dans la réponse" })
    }

    // ✅ Stocker le token en cookie HTTPOnly
    res.cookie("token", result.customToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1h
    })

    // 🔥 On renvoie aussi temporairement le token pour le frontend
    res.status(200).json({
      message: "Connexion réussie",
      customToken: result.customToken, // 👉 Firebase en a besoin pour `signInWithCustomToken`
    })
  } catch (error) {
    res.status(401).json({ message: error.message })
  }
}
export const storeToken = async (req, res) => {
  try {
    const { idToken } = req.body
    if (!idToken) {
      return res.status(400).json({ message: "ID Token manquant" })
    }

    // 🔥 Stocker le token en cookie HTTPOnly
    res.cookie("token", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000, // 1h
    })

    res.status(200).json({ message: "Token stocké avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message })
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
