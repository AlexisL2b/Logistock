import OrderShipmentDAO from "../dao/orderShipmentDAO.js"

class OrderShipmentService {
  async getAllOrderShipments() {
    return await OrderShipmentDAO.findAll()
  }

  async getOrderShipmentById(id) {
    const orderShipment = await OrderShipmentDAO.findById(id)
    if (!orderShipment) {
      throw new Error("Départ de commande introuvable")
    }
    return orderShipment
  }

  async getOrderShipmentByCommandeId(commandeId) {
    return await OrderShipmentDAO.findByCommandeId(commandeId)
  }

  async addOrderShipment(orderShipmentData) {
    if (!orderShipmentData.commande_id) {
      throw new Error("Le champ 'commande_id' est requis")
    }

    // Vérifier si une expédition existe déjà pour cette commande
    const existingShipment = await OrderShipmentDAO.findByCommandeId(
      orderShipmentData.commande_id
    )
    if (existingShipment.length > 0) {
      throw new Error("Une expédition existe déjà pour cette commande")
    }

    return await OrderShipmentDAO.create(orderShipmentData)
  }

  async updateOrderShipment(id, orderShipmentData) {
    const updatedOrderShipment = await OrderShipmentDAO.update(
      id,
      orderShipmentData
    )
    if (!updatedOrderShipment) {
      throw new Error("Départ de commande introuvable")
    }
    return updatedOrderShipment
  }

  async deleteOrderShipment(id) {
    const deletedOrderShipment = await OrderShipmentDAO.delete(id)
    if (!deletedOrderShipment) {
      throw new Error("Départ de commande introuvable")
    }
    return deletedOrderShipment
  }
}

export default new OrderShipmentService()
