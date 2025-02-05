import orderService from "../services/orderService.js"

// Récupérer toutes les commandes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders()
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer une commande par ID
export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id)
    res.json(order)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Récupérer les commandes d'un utilisateur
export const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUserId(req.params.userId)
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Ajouter une nouvelle commande
export const addOrder = async (req, res) => {
  try {
    const newOrder = await orderService.addOrder(req.body)
    res.status(201).json(newOrder)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Mettre à jour une commande par ID
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await orderService.updateOrder(req.params.id, req.body)
    res.json(updatedOrder)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Supprimer une commande par ID
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await orderService.deleteOrder(req.params.id)
    res.json({ message: "Commande supprimée avec succès", data: deletedOrder })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Récupérer toutes les commandes avec leurs détails
export const getAllOrdersWithDetails = async (req, res) => {
  try {
    const ordersWithDetails = await orderService.getOrdersWithDetails()
    res.json(ordersWithDetails)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer les commandes avec détails d'un utilisateur
export const getOrdersWithDetails = async (req, res) => {
  try {
    const ordersWithDetails = await orderService.getOrdersWithDetails(
      req.params.userId
    )
    res.json(ordersWithDetails)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
