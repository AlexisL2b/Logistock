import orderShipmentService from "../services/orderShipmentService.js"

const orderShipmentController = {
  // ✅ Récupérer tous les départs de commandes
  async getAll(req, res) {
    try {
      const orderShipments = await orderShipmentService.getAllOrderShipments()
      console.log("🟢 Départs de commandes récupérés")
      res.json(orderShipments)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  // ✅ Récupérer un départ de commande par ID
  async getById(req, res) {
    try {
      const orderShipment = await orderShipmentService.getOrderShipmentById(
        req.params.id
      )
      res.json(orderShipment)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // ✅ Récupérer un départ de commande par ID de commande
  async getByCommandeId(req, res) {
    try {
      const existingShipment =
        await orderShipmentService.getOrderShipmentByCommandeId(req.params.id)
      res.json(existingShipment)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  // ✅ Ajouter un départ de commande
  async create(req, res) {
    try {
      const newOrderShipment = await orderShipmentService.addOrderShipment(
        req.body
      )
      res.status(201).json(newOrderShipment)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  // ✅ Mettre à jour un départ de commande
  async update(req, res) {
    try {
      const updatedOrderShipment =
        await orderShipmentService.updateOrderShipment(req.params.id, req.body)
      res.json(updatedOrderShipment)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // ✅ Supprimer un départ de commande
  async remove(req, res) {
    try {
      const deletedOrderShipment =
        await orderShipmentService.deleteOrderShipment(req.params.id)
      res.json({
        message: "Départ de commande supprimé avec succès",
        data: deletedOrderShipment,
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}

export default orderShipmentController
