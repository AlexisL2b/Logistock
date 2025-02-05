import Order from "../models/orderModel.js"
import OrderDetails from "../models/orderDetailsModel.js"

class OrderDAO {
  async findAll() {
    return await Order.find().populate("acheteur_id", "nom prenom email")
  }

  async findById(id) {
    return await Order.findById(id).populate("acheteur_id", "nom prenom email")
  }

  async findByUserId(userId) {
    return await Order.find({ acheteur_id: userId }).sort({ date_commande: -1 })
  }

  async create(orderData) {
    const newOrder = new Order(orderData)
    return await newOrder.save()
  }

  async update(id, orderData) {
    return await Order.findByIdAndUpdate(id, orderData, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return await Order.findByIdAndDelete(id)
  }

  async findOrdersWithDetails(userId = null) {
    const query = userId ? { acheteur_id: userId } : {}
    const orders = await Order.find(query).sort({ date_commande: -1 })

    return await Promise.all(
      orders.map(async (order) => {
        const details = await OrderDetails.find({ commande_id: order._id })
        return {
          order_id: order._id,
          date_commande: order.date_commande,
          statut: order.statut,
          produitDetails: details,
        }
      })
    )
  }
}

export default new OrderDAO()
