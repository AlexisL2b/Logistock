import Joi from "joi"

// Middleware générique pour valider les requêtes avec Joi
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }) // Valide toutes les erreurs avant de s'arrêter
    if (error) {
      return res.status(400).json({
        message: "Erreur de validation",
        errors: error.details.map((err) => err.message), // Liste des erreurs détectées
      })
    }
    next()
  }
}

export default validate
