import StockLogDAO from "../dao/stockLogDAO.js"

class StockLogService {
  /**
   * ✅ Récupérer tous les logs de stock
   */
  async getAllStockLogs() {
    return await StockLogDAO.findAll()
  }

  /**
   * ✅ Récupérer un log de stock par ID
   */
  async getStockLogById(id) {
    const stockLog = await StockLogDAO.findById(id)
    if (!stockLog) {
      throw new Error("Log de stock introuvable")
    }
    return stockLog
  }

  /**
   * ✅ Ajouter un log de stock
   */
  async addStockLog(stockLogData) {
    if (
      !stockLogData.stock_id ||
      !stockLogData.quantity ||
      !stockLogData.event
    ) {
      throw new Error(
        "Tous les champs 'product_id', 'quantity' et 'event' sont requis"
      )
    }

    return await StockLogDAO.create(stockLogData)
  }

  /**
   * ✅ Mettre à jour un log de stock
   */
  async updateStockLog(id, stockLogData) {
    const updatedStockLog = await StockLogDAO.update(id, stockLogData)
    if (!updatedStockLog) {
      throw new Error("Log de stock introuvable")
    }
    return updatedStockLog
  }

  /**
   * ✅ Supprimer un log de stock
   */
  async deleteStockLog(id) {
    const deletedStockLog = await StockLogDAO.delete(id)
    if (!deletedStockLog) {
      throw new Error("Log de stock introuvable")
    }
    return deletedStockLog
  }
}

export default new StockLogService()
