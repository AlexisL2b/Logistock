import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import Role from "../models/roleModel.js"

class AuthService {
  /**
   * 🔹 Génération d'un Token JWT
   */
  async generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role_id.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )
  }

  /**
   * 🔹 Création d'un utilisateur avec un rôle lié par ObjectId
   */
  async createUser(userData, currentUserRole) {
    try {
      const { email, password, prenom, nom, adresse, salesPoint, role_id } =
        userData

      // Vérifier si l'utilisateur existe déjà
      const userExists = await User.findOne({ email })
      if (userExists) {
        throw new Error("L'utilisateur existe déjà !")
      }

      // 🔹 Vérifier si le rôle existe en base
      const assignedRole = await Role.findById(role_id)
      if (!assignedRole) {
        throw new Error("Le rôle spécifié n'existe pas !")
      }

      // 🔹 Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10)

      // 🔹 Enregistrement de l'utilisateur en MongoDB
      const newUser = new User({
        email,
        password: hashedPassword,
        role_id: assignedRole._id,
        prenom,
        nom,
        adresse,
        ...(salesPoint && { point_vente_id: salesPoint }),
      })

      await newUser.save()
      return { message: "Utilisateur créé avec succès !" }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * 🔹 Connexion utilisateur et récupération du rôle
   */
  async loginUser(email, password, res) {
    // 🔥 Ajouter `res` comme paramètre
    try {
      const user = await User.findOne({ email }).populate("role_id", "name")
      if (!user) {
        throw new Error("Utilisateur introuvable.")
      }

      const assignedRole = await Role.findById(user.role_id._id)
      if (!assignedRole) {
        throw new Error("Le rôle spécifié n'existe pas !")
      }

      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        throw new Error("Mot de passe incorrect.")
      }

      // 🔹 Générer le token JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role_id.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      )

      // 🔹 Stocker le token dans un Cookie HTTPOnly sécurisé
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 3600000, // Expiration : 1 heure
      })

      return {
        message: "Connexion réussie",
        user: {
          id: user._id,
          email: user.email,
          role: user.role_id.name,
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
