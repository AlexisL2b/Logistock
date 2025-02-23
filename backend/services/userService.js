import bcrypt from "bcryptjs"
import UserDAO from "../dao/userDAO.js"
import User from "../models/userModel.js"

const UserService = {
  async getUserProfile(userId) {
    const user = await UserDAO.findById(userId)
    if (!user) {
      throw new Error("Utilisateur introuvable.")
    }
    return user
  },

  async getBuyers() {
    const buyers = await UserDAO.findBuyers()
    if (!buyers) {
      throw new Error("Aucun acheteur trouvé.")
    }
    return buyers
  },

  async createUser(userData) {
    try {
      const salt = await bcrypt.genSalt(10)
      userData.password = await bcrypt.hash(userData.password, salt)
      return await UserDAO.createUser(userData)
    } catch (error) {
      console.error(
        "❌ Erreur lors de la création de l'utilisateur depuis le service :",
        error.message
      )
      throw new Error(error.message)
    }
  },

  async getAllUsers() {
    return await UserDAO.findAll()
  },

  async updateUser(userId, updateData) {
    try {
      // Récupérer l'utilisateur existant
      const existingUser = await User.findById(userId)
      if (!existingUser) throw new Error("Utilisateur introuvable.")

      // Vérification si l'utilisateur veut modifier son mot de passe
      if (updateData.password) {
        if (!updateData.oldPassword) {
          throw new Error("L'ancien mot de passe est requis pour le modifier.")
        }

        const isMatch = await bcrypt.compare(
          updateData.oldPassword,
          existingUser.password
        )
        if (!isMatch) {
          throw new Error("L'ancien mot de passe est incorrect.")
        }

        // Hashage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10)
        updateData.password = await bcrypt.hash(updateData.password, salt)
        delete updateData.oldPassword // On ne stocke pas l'ancien mot de passe
      }

      // Mise à jour seulement des champs envoyés
      updateData.updatedAt = Date.now()

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData }, // Met à jour uniquement les champs fournis
        { new: true, runValidators: true } // Retourne l'utilisateur mis à jour avec validation
      )

      if (!updatedUser) throw new Error("Mise à jour échouée.")

      return updatedUser
    } catch (error) {
      throw new Error(error.message)
    }
  },

  async deleteUser(userId) {
    return await UserDAO.deleteUser(userId)
  },
}

export default UserService
