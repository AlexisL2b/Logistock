import Order from "../models/orderModel.js"
import OrderDetails from "../models/orderDetailsModel.js"
import OrderShipment from "../models/orderShipmentModel.js"

class OrderDAO {
  async findAllOrders() {
    return await Order.find().populate("buyer_id", "lastname firstname email")
  }

  async findAllWithDetails() {
    try {
      const orders = await Order.find().lean()

      if (!orders.length) {
        return []
      }

      // Récupérer tous les IDs de commandes
      const orderIds = orders.map((order) => order._id)

      // Récupérer tous les détails des commandes correspondant aux IDs
      const orderDetails = await OrderDetails.find({
        order_id: { $in: orderIds },
      }).lean()
      const orderShipments = await OrderShipment.find({
        order_id: { $in: orderIds },
      }).lean()

      const ordersWithDetails = orders.map((order) => {
        // Filtrer les produits liés à cette commande
        const produitDetails = orderDetails.filter(
          (detail) => detail.order_id.toString() === order._id.toString()
        )

        // Trouver la première expédition liée à cette commande
        const shipment = orderShipments.find(
          (shipment) => shipment.order_id.toString() === order._id.toString()
        )

        return {
          ...order,
          produitDetails,
          ...(order.statut === "expédiée" && shipment
            ? {
                transporter_id: shipment.transporter_id,
                date_shipment: shipment.date_shipment,
              }
            : {}),
        }
      })

      return ordersWithDetails
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error)
      throw new Error("Impossible de récupérer les commandes")
    }
  }
  async findAll() {
    return await Order.find().populate("buyer_id", "name firstname email")
  }
  // 🔥 Créer une nouvelle commande
  async createOrder(buyer_id, totalAmount) {
    const newOrder = new Order({
      buyer_id: buyer_id,
      statut: "en cours",
      totalAmount: totalAmount,
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
    return await Order.find().populate("buyer_id", "name firstname email")
  }

  // 🔥 Récupérer une commande par son ID avec l'acheteur
  async findById(id) {
    return await Order.findById(id).populate(
      "buyer_id",
      "lastname firstname email"
    )
  }
  async findByUserId(buyer_id) {
    return await Order.find({ buyer_id })
  }
  async findOrdersByBuyerId(buyerId) {
    try {
      const orders = await Order.find({ buyer_id: buyerId }).lean()

      if (!orders.length) {
        return []
      }

      // Récupérer tous les IDs de commandes
      const orderIds = orders.map((order) => order._id)

      // Récupérer tous les détails des commandes correspondant aux IDs
      const orderDetails = await OrderDetails.find({
        order_id: { $in: orderIds },
      }).lean()

      // Mapper les détails des commandes dans chaque commande
      const ordersWithDetails = orders.map((order) => ({
        ...order,
        produitDetails: orderDetails.filter(
          (detail) => detail.order_id.toString() === order._id.toString()
        ),
      }))

      return ordersWithDetails
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error)
      throw new Error("Impossible de récupérer les commandes")
    }
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
