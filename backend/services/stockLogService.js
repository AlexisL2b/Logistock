import StockLog from "../models/stockLogModel.js"

class StockLogDAO {
  async findAll() {
    return await StockLog.find().populate("product_id", "nom description")
  }

  async findById(id) {
    return await StockLog.findById(id).populate("product_id", "nom description")
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
