import Joi from "joi"

export const stockLogSchema = Joi.object({
  produit_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "L'ID du produit doit être un ObjectId MongoDB valide.",
      "any.required": "L'ID du produit est obligatoire.",
    }),
  evenement: Joi.string()
    .valid("entree", "sortie", "ajustement")
    .required()
    .messages({
      "any.only": "L'événement doit être 'entree', 'sortie' ou 'ajustement'.",
      "any.required": "L'événement est obligatoire.",
    }),
  quantite: Joi.number().min(1).required().messages({
    "number.min": "La quantité doit être d'au moins 1.",
    "any.required": "La quantité est obligatoire.",
  }),
  date_evenement: Joi.date().default(Date.now).messages({
    "date.base": "La date de l'événement doit être une date valide.",
  }),
})
