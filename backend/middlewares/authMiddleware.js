import jwt from "jsonwebtoken"

export const protect = (req, res, next) => {
  let token = req.headers.authorization

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé, token manquant !" })
  }

  try {
    token = token.split(" ")[1] // Récupérer uniquement le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Ajouter l'utilisateur décodé à req.user
    next()
  } catch (error) {
    res.status(401).json({ message: "Token invalide !" })
  }
}
