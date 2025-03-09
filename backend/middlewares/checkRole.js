export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("req.user", req.user)
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Accès refusé. Vous n'avez pas les permissions nécessaires.",
      })
    }
    next()
  }
}
