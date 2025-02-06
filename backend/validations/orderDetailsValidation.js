import Joi from "joi"

export const orderDetailsSchema = Joi.object({
  commande_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "L'ID de la commande doit être un ObjectId valide.",
      "any.required": "L'ID de la commande est obligatoire.",
    }),
  produit_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "L'ID du produit doit être un ObjectId valide.",
      "any.required": "L'ID du produit est obligatoire.",
    }),
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Le nom du produit doit contenir au moins 2 caractères.",
    "string.max": "Le nom du produit ne doit pas dépasser 100 caractères.",
    "any.required": "Le nom du produit est obligatoire.",
  }),
  reference: Joi.string().min(2).max(50).required().messages({
    "string.min": "La référence doit contenir au moins 2 caractères.",
    "string.max": "La référence ne doit pas dépasser 50 caractères.",
    "any.required": "La référence est obligatoire.",
  }),
  quantite: Joi.number().min(1).required().messages({
    "number.min": "La quantité doit être d'au moins 1.",
    "any.required": "La quantité est obligatoire.",
  }),
  prix_unitaire: Joi.number().min(0).required().messages({
    "number.min": "Le prix unitaire ne peut pas être négatif.",
    "any.required": "Le prix unitaire est obligatoire.",
  }),
})
