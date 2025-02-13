import User from "../models/userModel.js"

const UserDAO = {
  async findById(userId) {
    return await User.findById(userId).populate("role_id", "name")
  },

  async findAll() {
    return await User.find().populate([
      { path: "role_id", select: "name" },
      { path: "sale_point_id", select: "name" },
    ])
  },
  async findBuyers() {
    return await User.find({ role_id: "677cf977b39853e4a17727e3" }).populate([
      { path: "role_id", select: "name" },
      { path: "sale_point_id", select: "name" },
    ])
  },
  async findBySalesPointId(sale_point_id) {
    return await User.find({ sale_point_id })
  },

  async findByEmail(email) {
    return await User.findOne({ email }).populate("role_id", "name")
  },

  async createUser(userData) {
    console.log("🔹 Création d'utilisateur avec les données :", userData)
    const user = new User(userData)
    return await user.save()
  },

  async updateUser(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true })
  },

  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId)
  },
}

export default UserDAO
