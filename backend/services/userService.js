import bcrypt from "bcryptjs"
import UserDAO from "../dao/userDAO.js"
import User from "../models/userModel.js"
import Role from "../models/roleModel.js"

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
      throw new Error("Utilisateur introuvable.")
    }
    return buyers
  },

  async createUser(userData, currentUserRole) {
    try {
      const { email, password, prenom, nom, adresse, sale_point_id, role_id } =
        userData

      const userExists = await User.findOne({ email })
      if (userExists) {
        throw new Error("L'utilisateur existe déjà !")
      }

      const assignedRole = role_id
        ? await Role.findById(role_id)
        : { _id: "677cf977b39853e4a17727e3" }
      if (!assignedRole) {
        throw new Error("Le rôle spécifié n'existe pas !")
      }

      const newUser = new User({
        email,
        password: userData.password,
        role_id: assignedRole._id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        address: userData.address,
        ...(sale_point_id && { sale_point_id: userData.sale_point_id }),
      })

      await newUser.save()
      console.log("✅ Utilisateur créé avec succès :", newUser)
      return { message: "Utilisateur créé avec succès !" }
    } catch (error) {
      console.error(
        "❌ Erreur lors de la création de l'utilisateur :",
        error.message
      )
      throw new Error(error.message)
    }
  },

  async getAllUsers() {
    return await UserDAO.findAll()
  },

  async updateUser(userId, updateData) {
    // ✅ Si l'utilisateur met à jour son mot de passe, on le hash avant de l'enregistrer
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(updateData.password, salt)
      console.log("🔹 Mot de passe hashé mis à jour :", updateData.password)
    }

    return await UserDAO.updateUser(userId, updateData)
  },

  async deleteUser(userId) {
    return await UserDAO.deleteUser(userId)
  },
}

export default UserService
