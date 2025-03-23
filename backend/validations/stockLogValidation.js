import Joi from "joi"

export const stockLogSchema = Joi.object({
  event: Joi.string()
    .valid("entrée", "sortie", "suppression", "création", "commandé")
    .required()
    .messages({
      "any.only":
        "L'événement doit être 'entrée', 'sortie', 'supprssion', 'commandé' ou création.",
      "any.required": "L'événement est obligatoire.",
    }),
  quantity: Joi.number().min(1).required().messages({
    "number.min": "La quantité doit être d'au moins 1.",
    "any.required": "La quantité est obligatoire.",
  }),
  date_event: Joi.date().default(Date.now).messages({
    "date.base": "La date de l'événement doit être une date valide.",
  }),
  stock_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "L'ID du stock  doit être un ObjectId MongoDB valide.",
      "any.required": "L'ID du produit est obligatoire.",
    }),
})
