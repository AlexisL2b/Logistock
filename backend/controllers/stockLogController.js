import stockLogService from "../services/stockLogService.js"

const stockLogController = {
  // 🔹 Récupérer tous les logs de stock
  async getAll(req, res) {
    try {
      const stockLogs = await stockLogService.getAllStockLogs()
      res.json(stockLogs)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  // 🔹 Récupérer un log de stock par ID
  async getById(req, res) {
    try {
      const stockLog = await stockLogService.getStockLogById(req.params.id)
      res.json(stockLog)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // 🔹 Ajouter un nouveau log de stock
  async create(req, res) {
    try {
      console.log("req.body depuis stockLogController.js", req.body)
      const newStockLog = await stockLogService.addStockLog(req.body)
      res.status(201).json(newStockLog)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  // 🔹 Mettre à jour un log de stock
  async update(req, res) {
    try {
      const updatedStockLog = await stockLogService.updateStockLog(
        req.params.id,
        req.body
      )
      res.json(updatedStockLog)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // 🔹 Supprimer un log de stock
  async remove(req, res) {
    try {
      await stockLogService.deleteStockLog(req.params.id)
      res.json({ message: "Log de stock supprimé avec succès" })
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },
}

export default stockLogController
