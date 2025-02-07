import OrderDetailsDAO from "../dao/orderDetailsDAO.js"
import OrderDAO from "../dao/orderDAO.js"
import stripe from "../config/stripeConfig.js"

class OrderDetailsService {
  // ✅ Ajouter des détails de commande ET mettre à jour le paiement
  async addOrderDetails(orderDetails) {
    try {
      if (!orderDetails.commande_id) {
        throw new Error("Le champ 'commande_id' est requis.")
      }

      await OrderDetailsDAO.create(orderDetails)

      return { message: "Détails de commande ajoutés avec succès" }
    } catch (error) {
      console.error("❌ Erreur addOrderDetails :", error)
      throw error
    }
  }

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
