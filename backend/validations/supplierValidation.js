import Joi from "joi"

export const supplierSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Le nom du fournisseur doit contenir au moins 2 caractères.",
    "string.max": "Le nom du fournisseur ne doit pas dépasser 100 caractères.",
    "any.required": "Le nom du fournisseur est obligatoire.",
  }),
  contact: Joi.string().optional().messages({
    "string.base": "Le contact doit être une chaîne de caractères.",
  }),
  phone: Joi.string()
    .pattern(/^\+?[0-9\s-]{7,20}$/)
    .optional()
    .messages({
      "string.pattern.base": "Le numéro de téléphone doit être valide.",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "L'adresse e-mail doit être valide.",
  }),
})
