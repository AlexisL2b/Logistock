import OrderService from "../services/orderService.js"

const orderController = {
  // ✅ Récupérer toutes les commandes
  async getAll(req, res) {
    try {
      const orders = await OrderService.getAllOrders()
      res.json(orders)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  // ✅ Ajouter une nouvelle commande
  async create(req, res) {
    try {
      if (
        !req.body.buyer_id ||
        !req.body.details ||
        req.body.details.length === 0
      ) {
        return res.status(400).json({
          message: "L'acheteur et les détails de commande sont requis.",
        })
      }

      const newOrder = await OrderService.addOrder(req.body)

      res.status(201).json({
        message: "Commande créée avec succès",
        order: newOrder.order,
      })
    } catch (error) {
      console.error("❌ Erreur addOrder controller :", error)
      res.status(500).json({ message: error.message })
    }
  },

  // ✅ Mettre à jour une commande
  async update(req, res) {
    try {
      const updatedOrder = await OrderService.updateOrder(
        req.params.id,
        req.body
      )

      res.json({
        message: "Commande mise à jour avec succès",
        order: updatedOrder,
      })
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // ✅ Récupérer les commandes d'un acheteur donné
  async getByBuyer(req, res) {
    try {
      const { buyer_id } = req.params
      const orders = await OrderService.getOrdersByBuyerId(buyer_id)
      res.status(200).json(orders)
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des commandes" })
    }
  },

  // ✅ Confirmer un paiement Stripe
  async confirmPayment(req, res) {
    try {
      const { orderId, paymentIntentId } = req.body

      if (!orderId || !paymentIntentId) {
        return res
          .status(400)
          .json({ message: "orderId et paymentIntentId requis." })
      }

      const updatedOrder = await OrderService.confirmPayment(
        orderId,
        paymentIntentId
      )

      res.json({ message: "Paiement confirmé", order: updatedOrder })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  // ✅ Récupérer une commande par ID
  async getById(req, res) {
    try {
      const order = await OrderService.getOrderById(req.params.id)
      res.json(order)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // ✅ Supprimer une commande
  async remove(req, res) {
    try {
      const deletedOrder = await OrderService.deleteOrder(req.params.id)
      res.json({
        message: "Commande supprimée avec succès",
        data: deletedOrder,
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}

export default orderController
