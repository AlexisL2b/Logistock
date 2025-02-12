import UserDAO from "../dao/userDAO.js"

const UserService = {
  async getUserProfile(userId) {
    const user = await UserDAO.findById(userId)
    if (!user) {
      throw new Error("Utilisateur introuvable.")
    }
    return user
  },

  async createUser(userData) {
    return await UserDAO.createUser(userData)
  },
  async getAllUsers() {
    return await UserDAO.findAll()
  },

  async updateUser(userId, updateData) {
    return await UserDAO.updateUser(userId, updateData)
  },

  async deleteUser(userId) {
    return await UserDAO.deleteUser(userId)
  },
}

export default UserService
