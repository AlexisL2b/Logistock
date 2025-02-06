import admin from "../config/firebase.js"

const authenticate = async (req, res, next) => {
  console.log("🔹 Cookies reçus :", req.cookies)

  const token = req.cookies.token
  console.log("🔍 Token récupéré pour vérification :", token)

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, aucun token trouvé" })
  }

  try {
    // 🔥 Vérifier que le token est bien un ID Token
    const decodedToken = await admin.auth().verifyIdToken(token)
    console.log("✅ Token vérifié, utilisateur :", decodedToken)
    req.user = decodedToken
    next()
  } catch (err) {
    console.error("❌ Erreur de vérification Firebase :", err)
    res.status(403).json({ message: "Token invalide ou expiré" })
  }
}

export default authenticate
