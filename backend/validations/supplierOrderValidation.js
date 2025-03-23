import Joi from "joi"
import mongoose from "mongoose"

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid")
  }
  return value
}

export const supplierOrderValidation = Joi.object({
  supplier_id: Joi.string().custom(objectIdValidator).required(),

  statut: Joi.string().valid("En attente de traitement", "Reçue").required(),

  details: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.string().custom(objectIdValidator).required(),
        name: Joi.string().required(),
        reference: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        category: Joi.string().required(),
        stock_id: Joi.string().custom(objectIdValidator).required(),
      })
    )
    .min(1)
    .required(),

  orderedAt: Joi.date().optional(),
  receivedAt: Joi.date().optional(),

  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
})
