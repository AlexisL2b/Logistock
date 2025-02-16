import Joi from "joi"

export const orderSchema = Joi.object({
  buyer_id: Joi.string().required(),
  statut: Joi.string()
    .valid("en cours", "validée", "expédiée", "annulée", "réceptionné")
    .default("en cours"),
  totalAmount: Joi.number().precision(2).required(), // ✅ Gère les décimales
})
