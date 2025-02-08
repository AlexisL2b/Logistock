import StockLog from "../models/stockLogModel.js"
import Stock from "../models/stockModel.js"

class StockDAO {
  async findAll() {
    return await Stock.find().populate().lean()
  }
  async findAllWithProducts() {
    // 🔍 Étape 1 : Récupérer les stocks avec leurs produits (et supplier/categorie)
    const stocks = await Stock.find()
      .populate({
        path: "produit_id",
        populate: [
          { path: "supplier_id", model: "Supplier", select: "nom" },
          { path: "categorie_id", model: "Category", select: "nom" },
        ],
        model: "Product",
        select: "nom reference prix supplier_id categorie_id",
      })
      .lean() // ✅ Assure que Mongoose retourne des objets purs

    // 🔍 Étape 2 : Récupérer tous les stockLogs
    const stockLogs = await StockLog.find().lean()
    console.log("stockLogs récupérés :", stockLogs)

    // 🔍 Étape 3 : Associer chaque stockLog à son stock correspondant
    const stocksWithLogs = stocks.map((stock) => {
      const logs = stockLogs.filter(
        (log) => log.stock_id.toString() === stock._id.toString()
      )
      return { ...stock, stockLogs: logs }
    })

    return stocksWithLogs
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
  async deleteByProductId(produitId) {
    return await Stock.findOneAndDelete({ produit_id: produitId })
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
