import Joi from "joi"

export const orderShipmentSchema = Joi.object({
  order_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "L'ID de la commande doit être un ObjectId MongoDB valide.",
      "any.required": "L'ID de la commande est obligatoire.",
    }),
  transporter_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "L'ID du transporteur doit être un ObjectId MongoDB valide.",
      "any.required": "L'ID du transporteur est obligatoire.",
    }),
  date_shipment: Joi.date().default(Date.now).messages({
    "date.base": "La date de départ doit être une date valide.",
  }),
})
