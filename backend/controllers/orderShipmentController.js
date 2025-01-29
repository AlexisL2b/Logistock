import OrderShipment from "../models/orderShipmentModel.js"

// Récupérer tous les départs de commandes
export const getAllOrderShipments = async (req, res) => {
  try {
    const orderShipments = await OrderShipment.find()
      .populate("commande_id", "statut date_commande")
      .populate("transporteur_id", "nom telephone")
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

// 🔍 Vérifier si une expédition existe déjà pour une commande spécifique
export const getOrderShipmentByCommandeId = async (req, res) => {
  try {
    // console.log("req", req)
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        message: "L'identifiant de la commande est requis",
      })
    }

    const existingShipment = await OrderShipment.find({ commande_id: id })

    res.json(existingShipment)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la recherche d'une expédition",
      error,
    })
  }
}

// Ajouter un départ de commande
export const addOrderShipment = async (req, res) => {
  try {
    const { commande_id } = req.body

    // Vérifier si une expédition existe déjà pour cette commande
    const existingShipment = await OrderShipment.findOne({ commande_id })
    if (existingShipment) {
      return res.status(400).json({
        message: "Une expédition existe déjà pour cette commande",
      })
    }

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

// Mettre à jour un départ de commande
export const updateOrderShipment = async (req, res) => {
  try {
    const updatedOrderShipment = await OrderShipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
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
