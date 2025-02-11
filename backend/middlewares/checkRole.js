const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Accès interdit. Rôle non défini." })
    }

    // Vérifie si l'utilisateur a l'un des rôles autorisés
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Accès interdit. Rôle insuffisant." })
    }

    next() // ✅ Passe à l'action suivante si l'utilisateur a le bon rôle
  }
}

export default checkRole
