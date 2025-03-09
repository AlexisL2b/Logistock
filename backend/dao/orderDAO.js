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
    // const newOrder = new Order({
    //   buyer: {
    //     _id: orderData.buyer._id,
    //     firstname: orderData.buyer.firstname,
    //     lastname: orderData.buyer.lastname,
    //     email: orderData.buyer.email,
    //     address: orderData.buyer.address,
    //   },
    //   statut: "en cours",
    //   totalAmount: orderData.totalAmount,
    //   date_order: new Date(),
    //   details: orderData.details.map((detail) => ({
    //     product_id: detail.product_id,
    //     name: detail.name,
    //     reference: detail.reference,
    //     quantity: detail.quantity,
    //     price: detail.price,
    //   })),
    //   shipment: orderData.shipment
    //     ? {
    //         transporter_id: orderData.shipment.transporter_id,
    //         date_shipment: orderData.shipment.date_shipment,
    //       }
    //     : null,
    // })

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
