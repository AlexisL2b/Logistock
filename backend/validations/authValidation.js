import Joi from "joi"

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "L'adresse e-mail doit être valide.",
    "any.required": "L'adresse e-mail est obligatoire.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Le mot de passe doit contenir au moins 6 caractères.",
    "any.required": "Le mot de passe est obligatoire.",
  }),
  nom: Joi.string().min(2).max(100).required().messages({
    "string.min": "Le nom doit contenir au moins 2 caractères.",
    "string.max": "Le nom ne doit pas dépasser 100 caractères.",
    "any.required": "Le nom est obligatoire.",
  }),
  prenom: Joi.string().min(2).max(100).required().messages({
    "string.min": "Le prénom doit contenir au moins 2 caractères.",
    "string.max": "Le prénom ne doit pas dépasser 100 caractères.",
    "any.required": "Le prénom est obligatoire.",
  }),
  adresse: Joi.string().min(5).max(255).required().messages({
    "string.min": "L'adresse doit contenir au moins 5 caractères.",
    "string.max": "L'adresse ne doit pas dépasser 255 caractères.",
    "any.required": "L'adresse est obligatoire.",
  }),
  role_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base":
        "L'ID du rôle doit être un ObjectId MongoDB valide.",
      "any.required": "Le rôle est obligatoire.",
    }),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "L'adresse e-mail doit être valide.",
    "any.required": "L'adresse e-mail est obligatoire.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Le mot de passe est obligatoire.",
  }),
})
