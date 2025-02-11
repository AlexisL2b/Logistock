import SalesPoint from "../models/salesPointModel.js"

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
}

export default new SalesPointDAO()
