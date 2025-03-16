import bcrypt from "bcryptjs"
import UserDAO from "../dao/userDAO.js"
import User from "../models/userModel.js"
import mongoose from "mongoose"

class UserService {
  // 📌 Récupérer le profil utilisateur
  async getUserProfile(userId) {
    const user = await UserDAO.findById(userId)
    if (!user) throw new Error("Utilisateur introuvable.")
    return user
  }

  // 📌 Récupérer tous les acheteurs
  async getBuyers() {
    const buyers = await UserDAO.findBuyers()
    if (!buyers.length) throw new Error("Aucun acheteur trouvé.")
    return buyers
  }

  // 📌 Créer un utilisateur
  async createUser(userData) {
    try {
      if (await User.findOne({ email: userData.email })) {
        throw new Error("L'adresse e-mail est déjà utilisée.")
      }

      if (!userData.role?._id) {
        throw new Error("Le rôle est obligatoire.")
      }
      if (
        userData.role._id === "677cf977b39853e4a17727e3" &&
        !userData.sale_point
      ) {
        throw new Error("Le point de vente est obligatoire pour les acheteurs.")
      }

      // Conversion des `ObjectId`
      userData.role._id = new mongoose.Types.ObjectId(userData.role._id)
      userData.sales_point._id = new mongoose.Types.ObjectId(
        userData.sales_point._id
      )

      const newUser = new User(userData)
      return await newUser.save()
    } catch (error) {
      console.error(
        "❌ Erreur lors de la création de l'utilisateur :",
        error.message
      )
      throw new Error(error.message)
    }
  }

  // 📌 Récupérer tous les utilisateurs
  async getAllUsers() {
    return await UserDAO.findAll()
  }

  // 📌 Mettre à jour un utilisateur
  async updateUser(userId, updateData) {
    try {
      const existingUser = await UserDAO.findById(userId)
      if (!existingUser) throw new Error("Utilisateur introuvable.")

      if (
        updateData.email &&
        (await User.findOne({ email: updateData.email }))
      ) {
        throw new Error("L'adresse e-mail est déjà utilisée.")
      }

      // Gestion du changement de mot de passe
      if (updateData.password) {
        if (!updateData.oldPassword) {
          throw new Error("L'ancien mot de passe est requis.")
        }

        const isMatch = await bcrypt.compare(
          updateData.oldPassword,
          existingUser.password
        )
        if (!isMatch) throw new Error("L'ancien mot de passe est incorrect.")

        updateData.password = await bcrypt.hash(
          updateData.password,
          await bcrypt.genSalt(10)
        )
        delete updateData.oldPassword
      }

      updateData.updatedAt = Date.now()
      const updatedUser = await UserDAO.updateUser(userId, updateData)

      if (!updatedUser) throw new Error("Mise à jour échouée.")
      return updatedUser
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // 📌 Supprimer un utilisateur
  async deleteUser(userId) {
    return await UserDAO.deleteUser(userId)
  }
}

export default new UserService()
