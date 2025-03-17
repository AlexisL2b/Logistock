import OrderDAO from "../dao/orderDAO.js"
import UserDAO from "../dao/userDAO.js"

class OrderService {
  // 🔥 Récupérer toutes les commandes
  async getAllOrders() {
    return await OrderDAO.findAllOrders()
  }

  // 🔥 Récupérer une commande par ID
  async getOrderById(id) {
    const order = await OrderDAO.findById(id)
    if (!order) {
      throw new Error("Commande introuvable")
    }
    return order
  }

  // 🔥 Récupérer toutes les commandes d'un acheteur donné
  async getOrdersByBuyerId(buyerId) {
    return await OrderDAO.findByUserId(buyerId)
  }

  // 🔥 Ajouter une commande avec `details` et `shipment`
  async addOrder(orderData) {
    try {
      // Vérifier l'acheteur
      const buyer = await UserDAO.findById(orderData.buyer_id)
      if (!buyer) {
        throw new Error("Acheteur introuvable")
      }
      // Construire l'objet `order`
      const newOrderData = {
        buyer: {
          _id: buyer._id,
          firstname: `${buyer.firstname}`,
          lastname: `${buyer.lastname}`,
          address: `${buyer.address}`,
          sales_point: `${buyer.sales_point.name}`,
          email: `${buyer.email}`,
        },
        statut: "en cours",
        totalAmount: orderData.totalAmount,
        date_order: new Date(),
        details: orderData.details.map((detail) => ({
          product_id: detail.product_id,
          name: detail.name,
          reference: detail.reference,
          quantity: detail.quantity,
          price: detail.price,
        })),
        orderedAt: orderData.orderedAt,
        shipment: orderData.shipment
          ? {
              transporter_id: orderData.shipment.transporter_id,
              date_shipment: orderData.shipment.date_shipment,
            }
          : null,
      }

      // 🔹 Créer la commande
      const newOrder = await OrderDAO.createOrder(newOrderData)
      return { order: newOrder }
    } catch (error) {
      console.error("❌ Erreur addOrder service :", error)
      throw error
    }
  }

  // 🔥 Mettre à jour une commande
  async updateOrder(id, orderData) {
    const updatedOrder = await OrderDAO.updateOrder(id, orderData)
    if (!updatedOrder) {
      throw new Error("Commande introuvable")
    }
    return updatedOrder
  }

  // 🔥 Confirmer un paiement Stripe et mettre à jour la commande
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

  // 🔥 Supprimer une commande
  async deleteOrder(id) {
    const deletedOrder = await OrderDAO.delete(id)
    if (!deletedOrder) {
      throw new Error("Commande introuvable")
    }
    return deletedOrder
  }
}

export default new OrderService()
