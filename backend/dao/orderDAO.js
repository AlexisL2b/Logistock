import Order from "../models/orderModel.js"
import OrderDetails from "../models/orderDetailsModel.js"

class OrderDAO {
  async findAllOrders() {
    return await Order.find().populate("acheteur_id", "nom prenom email")
  }

  async findAllWithDetails() {
    const orders = await Order.find().populate(
      "acheteur_id",
      "nom prenom email"
    )
  }
  async findAll() {
    return await Order.find().populate("acheteur_id", "nom prenom email")
  }
  // 🔥 Créer une nouvelle commande
  async createOrder(acheteur_id, totalAmount) {
    const newOrder = new Order({
      acheteur_id,
      statut: "en cours",
      totalAmount: totalAmount,
      stripePayment: { paymentIntentId: null, status: "pending" },
    })

    await newOrder.save()
    return newOrder
  }

  // 🔥 Mettre à jour une commande après paiement
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

  // 🔥 Récupérer toutes les commandes avec les détails de l'acheteur
  async findAll() {
    return await Order.find().populate("acheteur_id", "nom prenom email")
  }

  // 🔥 Récupérer une commande par son ID avec l'acheteur
  async findById(id) {
    return await Order.findById(id).populate("acheteur_id", "nom prenom email")
  }

  // 🔥 Supprimer une commande
  async delete(id) {
    return await Order.findByIdAndDelete(id)
  }
  async update(id, orderData) {
    return await Order.findByIdAndUpdate(id, orderData, {
      new: true,
      runValidators: true,
    })
  }
}

export default new OrderDAO()
