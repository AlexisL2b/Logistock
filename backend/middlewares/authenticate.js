import admin from "../config/firebase.js"

const authenticate = async (req, res, next) => {
  //("Middleware authenticate appelé") // Vérifie que le middleware est appelé

  const token = req.header("Authorization")?.split(" ")[1]
  //("Token reçu :", token) // Vérifie si le token est bien extrait

  if (!token) {
    //("Token manquant")
    return res.status(401).json({ message: "Token manquant. Accès refusé." })
  }

  try {
    //("Vérification du token en cours...")
    const decodedToken = await admin.auth().verifyIdToken(token)
    //("Utilisateur décodé :", decodedToken) // Vérifie si Firebase a bien validé le token
    req.user = decodedToken
    next() // Passe à la route suivante
  } catch (error) {
    console.error("Erreur lors de la validation du token :", error.message)
    res.status(403).json({ message: "Token invalide." })
  }
}

export default authenticate
