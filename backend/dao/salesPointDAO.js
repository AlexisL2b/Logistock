import SalesPoint from "../models/salesPointModel.js"
import User from "../models/userModel.js"

class SalesPointDAO {
  async findAll() {
    return await SalesPoint.find()
  }

  async findById(id) {
    return await SalesPoint.findById(id)
  }

  async create(salesPointData) {
    const newSalesPoint = new SalesPoint(salesPointData)
    return await newSalesPoint.save()
  }

  async update(id, salesPointData) {
    return await SalesPoint.findByIdAndUpdate(id, salesPointData, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return await SalesPoint.findByIdAndDelete(id)
  }
  async findWithoutUsers() {
    const salesPointsWithUsers = await User.aggregate([
      { $match: { "sales_point._id": { $exists: true } } },
      { $group: { _id: "$sales_point._id" } },
    ])

    // 👉 Extraire uniquement les IDs
    const usedIds = salesPointsWithUsers.map((sp) => sp._id)

    // 👉 Retourner les sales points qui ne sont pas utilisés
    return await SalesPoint.find({ _id: { $nin: usedIds } })
  }
}

export default new SalesPointDAO()
