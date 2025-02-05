import orderDetailsService from "../services/orderDetailsService.js"

// Récupérer tous les détails des commandes
export const getAllOrderDetails = async (req, res) => {
  try {
    const orderDetails = await orderDetailsService.getAllOrderDetails()
    res.json(orderDetails)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer les détails d'une commande spécifique
export const getOrderDetailsById = async (req, res) => {
  try {
    const orderDetails = await orderDetailsService.getOrderDetailsById(
      req.params.id
    )
    res.json(orderDetails)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Ajouter des détails de commande
export const addOrderDetails = async (req, res) => {
  try {
    const newOrderDetails = await orderDetailsService.addOrderDetails(req.body)
    res.status(201).json(newOrderDetails)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Mettre à jour des détails de commande
export const updateOrderDetails = async (req, res) => {
  try {
    const updatedOrderDetails = await orderDetailsService.updateOrderDetails(
      req.params.id,
      req.body
    )
    res.json(updatedOrderDetails)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Supprimer des détails de commande
export const deleteOrderDetails = async (req, res) => {
  try {
    const deletedOrderDetails = await orderDetailsService.deleteOrderDetails(
      req.params.id
    )
    res.json({
      message: "Détails de commande supprimés avec succès",
      data: deletedOrderDetails,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
