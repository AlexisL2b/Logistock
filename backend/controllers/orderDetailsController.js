import OrderDetails from "../models/orderDetailsModel.js"

// Récupérer tous les détails des commandes
export const getAllOrderDetails = async (req, res) => {
  try {
    const orderDetails = await OrderDetails.find()
      .populate("commande_id", "date_commande statut")
      .populate("produit_id", "nom prix")
    res.json(orderDetails)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des détails de commandes",
      error,
    })
  }
}

// Récupérer les détails d'une commande spécifique
export const getOrderDetailsById = async (req, res) => {
  try {
    const orderDetails = await OrderDetails.findById(req.params.id)
      .populate("commande_id", "date_commande statut")
      .populate("produit_id", "nom prix")
    if (!orderDetails)
      return res
        .status(404)
        .json({ message: "Détails de commande introuvables" })
    res.json(orderDetails)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des détails de la commande",
      error,
    })
  }
}

// Ajouter des détails de commande
export const addOrderDetails = async (req, res) => {
  try {
    const newOrderDetails = new OrderDetails(req.body)
    const savedOrderDetails = await newOrderDetails.save()
    res.status(201).json(savedOrderDetails)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout des détails de commande",
      error,
    })
  }
}

// Mettre à jour des détails de commande
export const updateOrderDetails = async (req, res) => {
  try {
    const updatedOrderDetails = await OrderDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Renvoie l'objet mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )
    if (!updatedOrderDetails)
      return res
        .status(404)
        .json({ message: "Détails de commande introuvables" })
    res.json(updatedOrderDetails)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour des détails de commande",
      error,
    })
  }
}

// Supprimer des détails de commande
export const deleteOrderDetails = async (req, res) => {
  try {
    const deletedOrderDetails = await OrderDetails.findByIdAndDelete(
      req.params.id
    )
    if (!deletedOrderDetails)
      return res
        .status(404)
        .json({ message: "Détails de commande introuvables" })
    res.json({ message: "Détails de commande supprimés avec succès" })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression des détails de commande",
      error,
    })
  }
}
