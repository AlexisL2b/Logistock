import OrderDetails from "../models/orderDetailsModel.js"

class OrderDetailsDAO {
  async findAll() {
    return await OrderDetails.find()
      .populate("commande_id", "date_order statut")
      .populate("product_id", "nom prix")
  }

  async findById(id) {
    return await OrderDetails.findById(id)
      .populate("commande_id", "date_order statut")
      .populate("product_id", "nom prix")
  }

  async create(orderDetailsData) {
    const newOrderDetails = new OrderDetails(orderDetailsData)
    return await newOrderDetails.save()
  }

  async update(id, orderDetailsData) {
    return await OrderDetails.findByIdAndUpdate(id, orderDetailsData, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return await OrderDetails.findByIdAndDelete(id)
  }
}

export default new OrderDetailsDAO()
