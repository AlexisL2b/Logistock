import Stock from "../models/stockModel.js"

class StockDAO {
  async findAll() {
    return await Stock.find().populate().lean()
  }

  async findById(id) {
    return await Stock.findById(id).populate("produit_id")
  }

  async findByProductId(produit_id) {
    return await Stock.findOne({ produit_id })
  }

  async createStock(stockData) {
    const newStock = new Stock(stockData)
    return await newStock.save()
  }

  async update(id, stockData) {
    return await Stock.findByIdAndUpdate(id, stockData, {
      new: true,
      runValidators: true,
    })
  }

  async updateByProductId(produit_id, stockData) {
    return await Stock.findOneAndUpdate({ produit_id }, stockData, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return await Stock.findByIdAndDelete(id)
  }

  async incrementStock(stock_id, quantite_disponible) {
    return await Stock.findByIdAndUpdate(
      stock_id,
      { $inc: { quantite_disponible: Number(quantite_disponible) || 0 } },
      { new: true }
    )
  }
}

export default new StockDAO()
