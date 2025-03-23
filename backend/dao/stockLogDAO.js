import StockLog from "../models/stockLogModel.js"
import Stock from "../models/stockModel.js"

class StockLogDAO {
  async findAll() {
    return await StockLog.find()
  }
  async findAllWithProduct() {
    return await StockLog.find().populate("product_id", "nom description")
  }

  async findById(id) {
    return await StockLog.findById(id)
  }

  async deleteByProductId(produitId) {
    const stock = await Stock.findOne({ product_id: produitId })
    if (!stock) return null
    return await StockLog.findOneAndDelete({ stock_id: stock._id })
  }

  async create(stockLogData) {
    const newStockLog = new StockLog(stockLogData)
    return await newStockLog.save()
  }

  async update(id, stockLogData) {
    return await StockLog.findByIdAndUpdate(id, stockLogData, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return await StockLog.findByIdAndDelete(id)
  }
}

export default new StockLogDAO()
