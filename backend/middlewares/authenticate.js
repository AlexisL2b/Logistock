import admin from "../config/firebase.js"

const authenticate = async (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, aucun token trouvé" })
  }

  try {
    // 🔥 Vérifier l'ID Token
    const decodedToken = await admin.auth().verifyIdToken(token)

    // 🔥 Récupérer l'utilisateur complet depuis Firebase (pour avoir le rôle)
    const userRecord = await admin.auth().getUser(decodedToken.uid)
    const customClaims = userRecord.customClaims || {}

    // 📌 Ajouter les informations dans `req.user`

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: customClaims.role || "Acheteur", // 🔥 Rôle par défaut si inexistant
    }

    next()
  } catch (err) {
    console.error("❌ Erreur de vérification Firebase :", err)
    res.status(403).json({ message: "Token invalide ou expiré" })
  }
}

export default authenticate
