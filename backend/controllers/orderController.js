import OrderService from "../services/orderService.js"

// ✅ Récupérer toutes les commandes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders()
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const getAllOrdersWithDetails = async (req, res) => {
  try {
    const ordersWithDetails = await OrderService.getAllOrdersWithDetails()
    res.json(ordersWithDetails)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const updateOrder = async (req, res) => {
  try {
    console.log("req.params", req.params)
    console.log("req.body", req.body)

    const updatedOrder = await OrderService.updateOrder(req.params.id, req.body)
    console.log(updatedOrder)
    res.json(updatedOrder)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
// ✅ Ajouter une nouvelle commande (avec paiement)
export const addOrder = async (req, res) => {
  try {
    const { buyer_id, totalAmount } = req.body

    console.log("📥 Données reçues pour la commande :", req.body)
    console.log("🔍 Type de totalAmount :", typeof totalAmount)

    if (!buyer_id) {
      return res.status(400).json({ message: "L'ID de l'acheteur est requis." })
    }

    if (!totalAmount || isNaN(Number(totalAmount)) || totalAmount <= 0) {
      return res.status(400).json({ message: "Le montant total est invalide." })
    }

    const newOrder = await OrderService.addOrder(buyer_id, totalAmount)

    res.status(201).json({
      message: "Commande créée avec succès",
      order: newOrder.order,
      // clientSecret: newOrder.clientSecret,
    })
  } catch (error) {
    console.error("❌ Erreur addOrder controller :", error)
    res.status(500).json({ message: error.message })
  }
}
export const getOrdersByBuyer = async (req, res) => {
  try {
    const { buyer_id } = req.params
    console.log("buyerId", req.params)
    const orders = await OrderService.getOrdersByBuyerId(buyer_id)
    res.status(200).json(orders)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des commandes" })
  }
}

// ✅ Confirmer un paiement Stripe
export const confirmPayment = async (req, res) => {
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
}

// ✅ Récupérer une commande par ID
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id)
    res.json(order)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// ✅ Supprimer une commande
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await OrderService.deleteOrder(req.params.id)
    res.json({ message: "Commande supprimée avec succès", data: deletedOrder })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
