import Joi from "joi"

export const transporterSchema = Joi.object({
  nom: Joi.string().min(2).max(100).required().messages({
    "string.min": "Le nom du transporteur doit contenir au moins 2 caractères.",
    "string.max": "Le nom du transporteur ne doit pas dépasser 100 caractères.",
    "any.required": "Le nom du transporteur est obligatoire.",
  }),
  telephone: Joi.string()
    .pattern(/^\+?[0-9\s-]{7,20}$/)
    .optional()
    .messages({
      "string.pattern.base": "Le numéro de téléphone doit être valide.",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "L'adresse e-mail doit être valide.",
  }),
})
