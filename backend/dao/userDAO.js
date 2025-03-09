import User from "../models/userModel.js"
import Role from "../models/roleModel.js"

const UserDAO = {
  async findById(userId) {
    return await User.findById(userId)
  },

  async findAll() {
    return await User.find()
  },

  async findBuyers() {
    return await User.find({ "role.name": "Acheteur" })
  },

  async findBySalesPointId(sales_point_id) {
    return await User.find({ "sales_point.id": sales_point_id })
  },

  async findByEmail(email) {
    return await User.findOne({ email })
  },

  async createUser(userData) {
    console.log("🔹 Création d'utilisateur avec les données :", userData)

    if (
      !userData.sales_point ||
      !userData.sales_point._id ||
      !userData.sales_point.name
    ) {
      throw new Error("Le `sales_point` doit contenir un `id` et un `name`.")
    }
    console.log("userData", userData)
    // Création de l'utilisateur avec `role` en texte et `role_id` en référence
    const newUser = new User({
      userData,
      // Stocke directement le rôle en texte
    })

    return await newUser.save()
  },

  async updateUser(userId, updateData) {
    // Si `role_id` est mis à jour, récupérer le nouveau rôle
    if (updateData.role_id) {
      const role = await Role.findById(updateData.role_id)
      if (!role) throw new Error("Le rôle spécifié n'existe pas.")
      updateData.role = role.name // Mettre à jour le rôle en texte
    }

    return await User.findByIdAndUpdate(userId, updateData, { new: true })
  },

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId)
  },
}

export default UserDAO
