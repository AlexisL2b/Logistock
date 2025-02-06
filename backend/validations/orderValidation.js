import Joi from "joi"

export const orderSchema = Joi.object({
  date_commande: Joi.date().default(Date.now).messages({
    "date.base": "La date de commande doit être une date valide.",
  }),
  statut: Joi.string()
    .valid("en cours", "validée", "expédiée", "annulée", "réceptionné")
    .default("en cours")
    .messages({
      "any.only":
        "Le statut doit être 'en cours', 'validée', 'expédiée', 'annulée' ou 'réceptionné'.",
    }),
  acheteur_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "L'ID de l'acheteur doit être un ObjectId MongoDB valide.",
      "any.required": "L'ID de l'acheteur est obligatoire.",
    }),
})
