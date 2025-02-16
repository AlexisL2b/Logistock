import Joi from "joi"

export const categorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.min": "Le nom de la catégorie doit contenir au moins 2 caractères.",
    "string.max": "Le nom de la catégorie ne doit pas dépasser 50 caractères.",
    "any.required": "Le nom de la catégorie est obligatoire.",
  }),
})
