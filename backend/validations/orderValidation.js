import Joi from "joi"

export const orderSchemaPost = Joi.object({
  buyer_id: Joi.object().required(),
  statut: Joi.string()
    .valid("en cours", "validée", "expédiée", "annulée", "réceptionné")
    .default("en cours"),
  totalAmount: Joi.number().precision(2).required(),
  details: Joi.array().required(), // ✅ Gère les décimales
  orderedAt: Joi.date().optional(),
})
export const orderSchemaPut = Joi.object({
  statut: Joi.string()
    .valid("en cours", "validée", "expédiée", "annulée", "réceptionné")
    .default("en cours"),

  confirmedAt: Joi.date().optional(),
  shippedAt: Joi.date().optional(),
  receivedAt: Joi.date().optional(),
})
