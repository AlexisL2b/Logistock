import Order from "../models/orderModel.js"

// Récupérer toutes les commandes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "acheteur_id",
      "nom prenom email"
    )
    res.json(orders)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes",
      error,
    })
  }
}

// Récupérer une commande par ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "acheteur_id",
      "nom prenom email"
    )
    if (!order) return res.status(404).json({ message: "Commande introuvable" })
    res.json(order)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la commande",
      error,
    })
  }
}

// Ajouter une nouvelle commande
export const addOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body)
    const savedOrder = await newOrder.save()
    res.status(201).json(savedOrder)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout de la commande",
      error,
    })
  }
}

// Mettre à jour une commande par ID
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Renvoie l'objet mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )
    if (!updatedOrder)
      return res.status(404).json({ message: "Commande introuvable" })
    res.json(updatedOrder)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la commande",
      error,
    })
  }
}

// Supprimer une commande par ID
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id)
    if (!deletedOrder)
      return res.status(404).json({ message: "Commande introuvable" })
    res.json({ message: "Commande supprimée avec succès" })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la commande",
      error,
    })
  }
}
