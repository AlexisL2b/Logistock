import Joi from "joi"

export const userSchema = Joi.object({
  // firebaseUid: Joi.string().required().messages({
  //   "any.required": "L'UID Firebase est obligatoire.",
  // }),

  lastname: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "Le nom doit contenir au moins 2 caractères.",
    "string.max": "Le nom ne doit pas dépasser 100 caractères.",
    "any.required": "Le nom est obligatoire.",
  }),

  firstname: Joi.string().min(2).max(100).trim().required().messages({
    "string.min": "Le prénom doit contenir au moins 2 caractères.",
    "string.max": "Le prénom ne doit pas dépasser 100 caractères.",
    "any.required": "Le prénom est obligatoire.",
  }),

  address: Joi.string().min(5).max(255).trim().required().messages({
    "string.min": "L'adresse doit contenir au moins 5 caractères.",
    "string.max": "L'adresse ne doit pas dépasser 255 caractères.",
    "any.required": "L'adresse est obligatoire.",
  }),

  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "L'adresse e-mail doit être valide.",
    "any.required": "L'adresse e-mail est obligatoire.",
  }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Le mot de passe doit contenir au moins 6 caractères.",
    "any.required": "Le mot de passe est obligatoire.",
  }),

  role_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "L'ID du rôle doit être un ObjectId MongoDB valide.",
      "any.required": "Le rôle est obligatoire.",
    }),

  sale_point_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "L'ID du point de vente doit être un ObjectId MongoDB valide.",
    }),
})
