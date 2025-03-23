import User from "../models/userModel.js"
import Role from "../models/roleModel.js"

class UserDAO {
  async findById(userId) {
    return await User.findById(userId)
  }
  async findAll() {
    return await User.find()
  }
  async findBuyers() {
    return await User.find({ "role.name": "Acheteur" })
  }
  async findBySalesPointId(sales_point_id) {
    return await User.find({ "sales_point._id": sales_point_id })
  }
  async findByEmail(email) {
    return await User.findOne({ email })
  }
  async createUser(userData) {
    if (!userData.sales_point?._id || !userData.sales_point?.name) {
      throw new Error("Le `sales_point` doit contenir un `id` et un `name`.")
    }
    const newUser = new User(userData)
    return await newUser.save()
  }
  async updateUser(userId, updateData) {
    const role = await Role.findById(updateData.role_id)
    // if (!role) throw new Error("Le rôle spécifié n'existe pas.")
    // updateData.role = {
    //   _id: role._id,
    //   name: role.name,
    // }
    return await User.findByIdAndUpdate(userId, updateData, { new: true })
  }
  async deleteUser(userId) {
    return await User.findByIdAndDelete(userId)
  }
}

export default new UserDAO()
