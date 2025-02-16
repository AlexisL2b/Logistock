import OrderDAO from "../dao/orderDAO.js"

class OrderService {
  async getAllOrders() {
    return await OrderDAO.findAllOrders()
  }
  async getAllOrdersWithDetails() {
    return await OrderDAO.findAllWithDetails()
  }
  async getOrdersByBuyerId(buyerId) {
    return await OrderDAO.findOrdersByBuyerId(buyerId)
  }
  async updateOrder(id, orderData) {
    const updatedOrder = await OrderDAO.update(id, orderData)
    if (!updatedOrder) {
      throw new Error("Commande introuvable")
    }
    return updatedOrder
  }
  async addOrder(buyer_id, totalAmount) {
    try {
      const montantTotal = Math.round(Number(totalAmount) * 100) // Convertir en centimes
      if (isNaN(montantTotal) || montantTotal <= 0) {
        throw new Error("Le montant total est invalide")
      }

      console.log("🔍 Montant total transformé :", montantTotal)

      // 🔥 Étape 1 : Créer la commande dans la base de données
      const newOrder = await OrderDAO.createOrder(buyer_id, totalAmount)

      console.log("✅ Commande créée :", newOrder)

      // 🔥 Étape 3 : Associer le PaymentIntent à la commande

      return { order: newOrder }
    } catch (error) {
      console.error("❌ Erreur addOrder service :", error)
      throw error
    }
  }

  // ✅ Confirmer un paiement Stripe et mettre à jour la commande
  async confirmPayment(orderId, paymentIntentId) {
    try {
      return await OrderDAO.updateOrderPaymentStatus(
        orderId,
        paymentIntentId,
        "succeeded"
      )
    } catch (error) {
      console.error("❌ Erreur lors de la confirmation du paiement :", error)
      throw new Error("Erreur lors de la confirmation du paiement")
    }
  }

  // ✅ Récupérer une commande par ID
  async getOrderById(id) {
    const order = await OrderDAO.findById(id)
    if (!order) {
      throw new Error("Commande introuvable")
    }
    return order
  }

  // ✅ Supprimer une commande
  async deleteOrder(id) {
    const deletedOrder = await OrderDAO.delete(id)
    if (!deletedOrder) {
      throw new Error("Commande introuvable")
    }
    return deletedOrder
  }
}

export default new OrderService()
