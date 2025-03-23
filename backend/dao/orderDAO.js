import Order from "../models/orderModel.js"

class OrderDAO {
  // 🔥 Récupérer toutes les commandes avec détails et expédition
  async findAllOrders() {
    return await Order.find()
  }

  // 🔥 Récupérer une commande par ID
  async findById(id) {
    return await Order.findById(id)
  }

  // 🔥 Récupérer toutes les commandes d'un utilisateur donné
  async findByUserId(buyer_id) {
    return await Order.find({ "buyer._id": buyer_id })
  }

  // 🔥 Créer une nouvelle commande avec détails et expédition intégrés
  async createOrder(orderData) {
    const newOrder = new Order(orderData)

    await newOrder.save()
    return newOrder
  }

  // 🔥 Mettre à jour une commande
  async updateOrder(id, orderData) {
    return await Order.findByIdAndUpdate(id, orderData, {
      new: true,
      runValidators: true,
    })
  }

  // 🔥 Supprimer une commande
  async delete(id) {
    return await Order.findByIdAndDelete(id)
  }

  // 🔥 Mettre à jour le statut de paiement Stripe
  async updateOrderPaymentStatus(orderId, paymentIntentId, status = "pending") {
    return await Order.findByIdAndUpdate(
      orderId,
      {
        "stripePayment.paymentIntentId": paymentIntentId,
        "stripePayment.status": status,
      },
      { new: true, runValidators: true }
    )
  }
}

export default new OrderDAO()
