import StockLogService from "../services/stockLogService.js"

// Récupérer tous les logs de stock
export const getAllStockLogs = async (req, res) => {
  try {
    const stockLogs = await StockLogService.getAllStockLogs()
    res.json(stockLogs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer un log de stock par ID
export const getStockLogById = async (req, res) => {
  try {
    const stockLog = await StockLogService.getStockLogById(req.params.id)
    res.json(stockLog)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Ajouter un nouveau log de stock
export const addStockLog = async (req, res) => {
  try {
    const newStockLog = await StockLogService.create(req.body)
    res.status(201).json(newStockLog)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Mettre à jour un log de stock par ID
export const updateStockLog = async (req, res) => {
  try {
    const updatedStockLog = await StockLogService.updateStockLog(
      req.params.id,
      req.body
    )
    res.json(updatedStockLog)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Supprimer un log de stock par ID
export const deleteStockLog = async (req, res) => {
  try {
    await StockLogService.deleteStockLog(req.params.id)
    res.json({ message: "Log de stock supprimé avec succès" })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
