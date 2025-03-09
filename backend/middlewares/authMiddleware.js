import jwt from "jsonwebtoken"

export const protect = (req, res, next) => {
  const token = req.cookies.authToken
  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant !" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // 🔹 Associe l'utilisateur décodé à `req.user`
    next()
  } catch (error) {
    res.status(401).json({ message: "Token invalide !" })
  }
}
