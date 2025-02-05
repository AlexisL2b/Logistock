import OrderDetailsDAO from "../dao/orderDetailsDAO.js"

class OrderDetailsService {
  async getAllOrderDetails() {
    return await OrderDetailsDAO.findAll()
  }

  async getOrderDetailsById(id) {
    const orderDetails = await OrderDetailsDAO.findById(id)
    if (!orderDetails) {
      throw new Error("Détails de commande introuvables")
    }
    return orderDetails
  }

  async addOrderDetails(orderDetailsData) {
    if (!orderDetailsData.commande_id || !orderDetailsData.produit_id) {
      throw new Error("Les champs 'commande_id' et 'produit_id' sont requis")
    }
    return await OrderDetailsDAO.create(orderDetailsData)
  }

  async updateOrderDetails(id, orderDetailsData) {
    const updatedOrderDetails = await OrderDetailsDAO.update(
      id,
      orderDetailsData
    )
    if (!updatedOrderDetails) {
      throw new Error("Détails de commande introuvables")
    }
    return updatedOrderDetails
  }

  async deleteOrderDetails(id) {
    const deletedOrderDetails = await OrderDetailsDAO.delete(id)
    if (!deletedOrderDetails) {
      throw new Error("Détails de commande introuvables")
    }
    return deletedOrderDetails
  }
}

export default new OrderDetailsService()
