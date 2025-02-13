import Joi from "joi"

export const roleSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.min": "Le nom du rôle doit contenir au moins 2 caractères.",
    "string.max": "Le nom du rôle ne doit pas dépasser 50 caractères.",
    "any.required": "Le nom du rôle est obligatoire.",
  }),
})
