import OrderShipment from "../models/orderShipmentModel.js"

// Récupérer tous les départs de commandes
export const getAllOrderShipments = async (req, res) => {
  try {
    const orderShipments = await OrderShipment.find()
      .populate("commande_id", "statut date_commande") // Populate les détails de la commande
      .populate("transporteur_id", "nom telephone") // Populate les détails du transporteur
    res.json(orderShipments)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des départs de commandes",
      error,
    })
  }
}

// Récupérer un départ de commande par ID
export const getOrderShipmentById = async (req, res) => {
  try {
    const orderShipment = await OrderShipment.findById(req.params.id)
      .populate("commande_id", "statut date_commande")
      .populate("transporteur_id", "nom telephone")
    if (!orderShipment)
      return res.status(404).json({ message: "Départ de commande introuvable" })
    res.json(orderShipment)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du départ de commande",
      error,
    })
  }
}

export const addOrderShipment = async (req, res) => {
  try {
    const newOrderShipment = new OrderShipment(req.body)
    const savedOrderShipment = await newOrderShipment.save()
    res.status(201).json(savedOrderShipment)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du départ de commande",
      error,
    })
  }
}

export const updateOrderShipment = async (req, res) => {
  try {
    const updatedOrderShipment = await OrderShipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Renvoie l'objet mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )
    if (!updatedOrderShipment)
      return res.status(404).json({ message: "Départ de commande introuvable" })
    res.json(updatedOrderShipment)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du départ de commande",
      error,
    })
  }
}

// Supprimer un départ de commande par ID
export const deleteOrderShipment = async (req, res) => {
  try {
    const deletedOrderShipment = await OrderShipment.findByIdAndDelete(
      req.params.id
    )
    if (!deletedOrderShipment)
      return res.status(404).json({ message: "Départ de commande introuvable" })
    res.json({ message: "Départ de commande supprimé avec succès" })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du départ de commande",
      error,
    })
  }
}
