import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import Role from "../models/roleModel.js"

class AuthService {
  /**
   * 🔹 Génération d'un Token JWT
   */

  async loginUser(email, password, res) {
    // 🔥 Ajouter `res` comme paramètre
    try {
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error("Utilisateur introuvable.")
      }

      const assignedRole = await Role.findById(user.role._id)
      if (!assignedRole) {
        throw new Error("Le rôle spécifié n'existe pas !")
      }

      // Vérification du mot de passe

      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        throw new Error("Mot de passe incorrect.")
      }

      // 🔹 Générer le token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      )

      // 🔹 Stocker le token dans un Cookie HTTPOnly sécurisé
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: true, // ✅ Obligatoire pour SameSite=None
        sameSite: "None", // ✅ Permet l’envoi en contexte intersite
        maxAge: 3600000, // 1 heure
      })

      return {
        message: "Connexion réussie",
        user: {
          id: user._id,
          role: user.role.name,
        },
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async logout(res) {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    return { message: "Déconnexion réussie" }
  }

  /**
   * 🔹 Récupérer le profil utilisateur avec son rôle
   */
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId)
        .populate("role_id", "nom") // Récupérer le rôle et ses permissions
        .populate("point_vente_id", "nom adresse")

      if (!user) {
        throw new Error("Utilisateur introuvable.")
      }

      return user
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default new AuthService()
