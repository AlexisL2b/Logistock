import User from "../models/userModel.js"
import bcrypt from "bcryptjs"

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

  async findByEmail(email) {
    return await User.findOne({ email }).populate("role_id", "name")
  },

  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = new User({ ...userData, password: hashedPassword })
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
