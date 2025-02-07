import Joi from "joi"

export const orderSchema = Joi.object({
  acheteur_id: Joi.string().required(),
  statut: Joi.string()
    .valid("en cours", "validée", "expédiée", "annulée", "réceptionné")
    .default("en cours"),
  totalAmount: Joi.number().precision(2).required(), // ✅ Gère les décimales
  stripePayment: Joi.object({
    paymentIntentId: Joi.string().allow(null, ""),
    status: Joi.string()
      .valid("pending", "succeeded", "failed")
      .default("pending"),
  }).default({ status: "pending" }),
})
