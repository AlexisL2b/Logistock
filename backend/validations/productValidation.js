import Joi from "joi"

export const productSchema = Joi.object({
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
  description: Joi.string().min(10).max(500).required().messages({
    "string.min": "La description doit contenir au moins 10 caractères.",
    "string.max": "La description ne doit pas dépasser 500 caractères.",
    "any.required": "La description est obligatoire.",
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": "Le prix ne peut pas être négatif.",
    "any.required": "Le prix est obligatoire.",
  }),
  category_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "L'ID de la catégorie doit être un ObjectId MongoDB valide.",
      "any.required": "L'ID de la catégorie est obligatoire.",
    }),
  supplier_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "L'ID du fournisseur doit être un ObjectId MongoDB valide.",
      "any.required": "L'ID du fournisseur est obligatoire.",
    }),
})
