import orderShipmentService from "../services/orderShipmentService.js"

// Récupérer tous les départs de commandes
export const getAllOrderShipments = async (req, res) => {
  try {
    const orderShipments = await orderShipmentService.getAllOrderShipments()
    console.log(
      "🟢 🟢 🟢 🟢 🟢 🟢🟢 🟢 🟢 🟢 🟢 🟢🟢 🟢 🟢 🟢 🟢 🟢 controller"
    )

    res.json(orderShipments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer un départ de commande par ID
export const getOrderShipmentById = async (req, res) => {
  try {
    const orderShipment = await orderShipmentService.getOrderShipmentById(
      req.params.id
    )
    res.json(orderShipment)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Récupérer un départ de commande par ID de commande
export const getOrderShipmentByCommandeId = async (req, res) => {
  try {
    const existingShipment =
      await orderShipmentService.getOrderShipmentByCommandeId(req.params.id)
    res.json(existingShipment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Ajouter un départ de commande
export const addOrderShipment = async (req, res) => {
  try {
    const newOrderShipment = await orderShipmentService.addOrderShipment(
      req.body
    )
    res.status(201).json(newOrderShipment)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Mettre à jour un départ de commande
export const updateOrderShipment = async (req, res) => {
  try {
    const updatedOrderShipment = await orderShipmentService.updateOrderShipment(
      req.params.id,
      req.body
    )
    res.json(updatedOrderShipment)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Supprimer un départ de commande par ID
export const deleteOrderShipment = async (req, res) => {
  try {
    const deletedOrderShipment = await orderShipmentService.deleteOrderShipment(
      req.params.id
    )
    res.json({
      message: "Départ de commande supprimé avec succès",
      data: deletedOrderShipment,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
