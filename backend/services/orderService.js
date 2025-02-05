import OrderDAO from "../dao/orderDAO.js"

class OrderService {
  async getAllOrders() {
    return await OrderDAO.findAll()
  }

  async getOrderById(id) {
    const order = await OrderDAO.findById(id)
    if (!order) {
      throw new Error("Commande introuvable")
    }
    return order
  }

  async getOrdersByUserId(userId) {
    return await OrderDAO.findByUserId(userId)
  }

  async addOrder(orderData) {
    if (!orderData.acheteur_id) {
      throw new Error("Le champ 'acheteur_id' est requis")
    }
    return await OrderDAO.create(orderData)
  }

  async updateOrder(id, orderData) {
    const updatedOrder = await OrderDAO.update(id, orderData)
    if (!updatedOrder) {
      throw new Error("Commande introuvable")
    }
    return updatedOrder
  }

  async deleteOrder(id) {
    const deletedOrder = await OrderDAO.delete(id)
    if (!deletedOrder) {
      throw new Error("Commande introuvable")
    }
    return deletedOrder
  }

  async getOrdersWithDetails(userId = null) {
    return await OrderDAO.findOrdersWithDetails(userId)
  }
}

export default new OrderService()
