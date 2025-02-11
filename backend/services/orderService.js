import stripe from "../config/stripeConfig.js"
import OrderDAO from "../dao/orderDAO.js"

class OrderService {
  async getAllOrders() {
    return await OrderDAO.findAllOrders()
  }
  async getAllOrdersWithDetails() {
    return await OrderDAO.findAllWithDetails()
  }
  async getOrdersByUserId(userId) {
    return await OrderDAO.findByUserId(userId)
  }
  async updateOrder(id, orderData) {
    const updatedOrder = await OrderDAO.update(id, orderData)
    if (!updatedOrder) {
      throw new Error("Commande introuvable")
    }
    return updatedOrder
  }
  // ✅ Étape 1 : Créer une commande et son PaymentIntent Stripe
  async addOrder(acheteur_id, totalAmount) {
    try {
      const montantTotal = Math.round(Number(totalAmount) * 100) // Convertir en centimes
      if (isNaN(montantTotal) || montantTotal <= 0) {
        throw new Error("Le montant total est invalide")
      }

      console.log("🔍 Montant total transformé :", montantTotal)

      // 🔥 Étape 1 : Créer la commande dans la base de données
      const newOrder = await OrderDAO.createOrder(acheteur_id, totalAmount)

      console.log("✅ Commande créée :", newOrder)

      // 🔥 Étape 2 : Créer un paiement Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: montantTotal, // Stripe exige un entier en centimes
        currency: "eur",
        metadata: { orderId: newOrder._id.toString() },
      })

      console.log("✅ Payment Intent créé :", paymentIntent.id)

      // 🔥 Étape 3 : Associer le PaymentIntent à la commande
      await OrderDAO.updateOrderPaymentStatus(
        newOrder._id,
        paymentIntent.id,
        "pending"
      )

      return { order: newOrder, clientSecret: paymentIntent.client_secret }
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
