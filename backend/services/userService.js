import bcrypt from "bcryptjs"
import UserDAO from "../dao/userDAO.js"
import User from "../models/userModel.js"
import mongoose from "mongoose"

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
      console.log(
        "Données reçues dans UserService :",
        JSON.stringify(userData, null, 2)
      )

      // ✅ Hashage du mot de passe

      // ✅ Conversion des ObjectId pour Mongoose
      const existingUser = await User.findOne({ email: userData.email })
      if (existingUser) {
        throw new Error("L'adresse e-mail est déjà utilisée.")
      }
      userData.role = {
        _id: new mongoose.Types.ObjectId(userData.role._id),
        name: userData.role.name,
      }

      userData.sales_point = {
        _id: new mongoose.Types.ObjectId(userData.sales_point._id),
        name: userData.sales_point.name,
      }

      // ✅ Création et sauvegarde de l'utilisateur
      const user = new User(userData)
      await user.save()

      console.log("✅ Utilisateur sauvegardé :", JSON.stringify(user, null, 2))
      return user
    } catch (error) {
      console.error(
        "❌ Erreur lors de la création de l'utilisateur from service :",
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
      console.log("updateData depuis userService.js", updateData)
      const existingUser = await User.findById(userId)
      if (!existingUser) throw new Error("Utilisateur introuvable.")
      const existingEmail = await User.findOne({ email: updateData.email })
      if (existingEmail) {
        throw new Error("L'adresse e-mail est déjà utilisée.")
      }
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
