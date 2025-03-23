import supplierOrderService from "../services/supplierOrderService.js"

const supplierOrderController = {
  async create(req, res) {
    try {
      const newOrder = await supplierOrderService.create(req.body)
      res.status(201).json(newOrder)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  async getAll(req, res) {
    try {
      const orders = await supplierOrderService.getAll()
      res.status(200).json(orders)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  async getById(req, res) {
    try {
      const order = await supplierOrderService.getById(req.params.id)
      if (!order) {
        return res
          .status(404)
          .json({ message: "Commande fournisseur introuvable" })
      }
      res.status(200).json(order)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  async update(req, res) {
    try {
      const updatedOrder = await supplierOrderService.update(
        req.params.id,
        req.body
      )
      if (!updatedOrder) {
        return res
          .status(404)
          .json({ message: "Commande fournisseur introuvable" })
      }
      res.status(200).json(updatedOrder)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  async delete(req, res) {
    try {
      const deletedOrder = await supplierOrderService.delete(req.params.id)
      if (!deletedOrder) {
        return res
          .status(404)
          .json({ message: "Commande fournisseur introuvable" })
      }
      res
        .status(200)
        .json({ message: "Commande fournisseur supprimée avec succès" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
}

export default supplierOrderController
