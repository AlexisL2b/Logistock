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
      const { produit_id, quantite } = detail
      const stock = await StockDAO.findByProductId(produit_id)

      if (!stock || quantite > stock.quantite_disponible) {
        insufficientStock.push({
          produit_id,
          quantite,
          stockDisponible: stock ? stock.quantite_disponible : 0,
        })
      }
    }

    return { insufficientStock }
  }

  async addStock(stockData) {
    if (!stockData.produit_id) {
      throw new Error("Le champ 'produit_id' est requis")
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

  async updateStockByProductId(produit_id, stockData) {
    const updatedStock = await StockDAO.updateByProductId(produit_id, stockData)
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
  async incrementStock(id, quantite_disponible) {
    const incrementStock = await StockDAO.incrementStock(
      id,
      quantite_disponible
    )
    if (!incrementStock) {
      throw new Error("Stock introuvable")
    }
    return incrementStock
  }

  /**
   * Décrémente le stock en fonction des détails de commande
   * @param {Array} orderDetails - Liste des articles commandés
   * @param {Object} io - Socket.IO pour la mise à jour en temps réel
   */
  async decrementStockForOrder(orderDetails, io) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      if (!Array.isArray(orderDetails)) {
        throw new Error("Les détails de la commande doivent être un tableau.")
      }

      const updatedStocks = []

      for (const detail of orderDetails) {
        const { produit_id, quantite } = detail
        console.log("quantite from stockService", quantite)

        const stock = await StockDAO.findByProductId(produit_id)
        console.log("Stock actuel :", stock)

        if (!stock) {
          throw new Error(`Stock introuvable pour le produit ID: ${produit_id}`)
        }

        if (quantite > stock.quantite_disponible) {
          throw new Error(
            `Stock insuffisant pour le produit ID: ${produit_id}. Quantité demandée: ${quantite}, disponible: ${stock.quantite_disponible}`
          )
        }

        stock.quantite_disponible -= quantite
        await stock.save({ session })

        updatedStocks.push({
          produit_id: stock.produit_id,
          quantite_disponible: stock.quantite_disponible,
          stockId: stock._id,
        })
      }

      await session.commitTransaction()
      session.endSession()

      if (io) {
        io.emit("stocksUpdated", updatedStocks)
      }

      return {
        success: true,
        message: "Stocks mis à jour avec succès",
        updatedStocks,
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des stocks :", error.message)

      await session.abortTransaction()
      session.endSession()

      throw error
    }
  }
}

export default new StockService()
