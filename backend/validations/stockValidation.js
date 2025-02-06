import Joi from "joi"

export const stockSchema = Joi.object({
  produit_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "L'ID du produit doit être un ObjectId MongoDB valide.",
      "any.required": "L'ID du produit est obligatoire.",
    }),
  sales_point_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "L'ID du point de vente doit être un ObjectId MongoDB valide.",
      "any.required": "L'ID du point de vente est obligatoire.",
    }),
  quantite_disponible: Joi.number().min(0).required().messages({
    "number.min": "La quantité disponible ne peut pas être négative.",
    "any.required": "La quantité disponible est obligatoire.",
  }),
})
