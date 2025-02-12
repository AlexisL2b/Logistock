import Joi from "joi"

export const salesPointSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min":
      "Le nom du point de vente doit contenir au moins 2 caractères.",
    "string.max":
      "Le nom du point de vente ne doit pas dépasser 100 caractères.",
    "any.required": "Le nom du point de vente est obligatoire.",
  }),
  address: Joi.string().min(5).max(255).required().messages({
    "string.min": "L'adresse doit contenir au moins 5 caractères.",
    "string.max": "L'adresse ne doit pas dépasser 255 caractères.",
    "any.required": "L'adresse est obligatoire.",
  }),
})
