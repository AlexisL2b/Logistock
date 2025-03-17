import StockDAO from "../dao/stockDAO.js"
import mongoose from "mongoose"

class StockService {
  async getAllStocks() {
    return await StockDAO.findAll()
  }
  async getAllStocksWithProducts() {
    return await StockDAO.findAllWithProducts()
  }

  async getStockById(id) {
    const stock = await StockDAO.findById(id)
    if (!stock) {
      throw new Error("Stock introuvable")
    }
    return stock
  }

  async checkStockAvailability(orderDetails) {
    if (!Array.isArray(orderDetails)) {
      throw new Error("Les détails de la commande doivent être un tableau.")
    }

    const insufficientStock = []

    for (const detail of orderDetails) {
      const { product_id, quantity } = detail
      const stock = await StockDAO.findByProductId(product_id)

      if (!stock || quantity > stock.quantity) {
        insufficientStock.push({
          product_id,
          quantity,
          stockDisponible: stock ? stock.quantity : 0,
        })
      }
    }

    return { insufficientStock }
  }

  async addStock(stockData) {
    if (!stockData.product_id) {
      throw new Error("Le champ 'product_id' est requis")
    }
    return await StockDAO.create(stockData)
  }

  async updateStock(id, stockData) {
    const updatedStock = await StockDAO.update(id, stockData)
    if (!updatedStock) {
      throw new Error("Stock introuvable")
    }
    return updatedStock
  }

  async updateStockByProductId(product_id, stockData) {
    const updatedStock = await StockDAO.updateByProductId(product_id, stockData)
    if (!updatedStock) {
      throw new Error("Stock introuvable pour ce produit")
    }
    return updatedStock
  }

  async deleteStock(id) {
    const deletedStock = await StockDAO.delete(id)
    if (!deletedStock) {
      throw new Error("Stock introuvable")
    }
    return deletedStock
  }
  async incrementStock(id, quantity) {
    const incrementStock = await StockDAO.incrementStock(id, quantity)
    if (!incrementStock) {
      throw new Error("Stock introuvable")
    }
    return incrementStock
  }

  async decrementStockForOrder(orderDetails, io) {
    try {
      if (!Array.isArray(orderDetails)) {
        throw new Error("Les détails de la commande doivent être un tableau.")
      }

      const updatedStocks = []

      for (const detail of orderDetails) {
        const { product_id, quantity } = detail
        const stock = await StockDAO.findByProductId(product_id)

        if (!stock)
          throw new Error(
            `❌ Stock introuvable pour le produit ID: ${product_id}`
          )
        if (quantity > stock.quantity)
          throw new Error(`⚠️ Stock insuffisant : ${product_id}`)

        stock.quantity -= quantity
        await stock.save()

        updatedStocks.push({
          product_id: stock.product_id,
          quantity: stock.quantity,
          stockId: stock._id,
        })
      }

      io.emit("stocksUpdated", updatedStocks)

      return { success: true, message: "Stocks mis à jour", updatedStocks }
    } catch (error) {
      console.error("❌ Erreur mise à jour stock :", error.message)
      throw error
    }
  }
}

export default new StockService()
