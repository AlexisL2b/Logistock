import stockService from "../services/stockService.js"

// Récupérer tous les stocks
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await stockService.getAllStocks()
    res.json({ message: "Stocks récupérés avec succès", data: stocks })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const getStocksWithProducts = async (req, res) => {
  try {
    const stocksProducts = await stockService.getAllStocksWithProducts()
    res.json({
      message: "Stock.Products récupérés avec succès ",
      data: stocksProducts,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer un stock par ID
export const getStockById = async (req, res) => {
  try {
    const stock = await stockService.getStockById(req.params.id)
    res.json({ message: "Stock récupéré avec succès", data: stock })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Vérifier la disponibilité du stock pour une commande
export const checkStockAvailability = async (req, res) => {
  try {
    const result = await stockService.checkStockAvailability(
      req.body.orderDetails
    )
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Ajouter un nouveau stock
export const addStock = async (req, res) => {
  try {
    const newStock = await stockService.addStock(req.body)
    res
      .status(201)
      .json({ message: "Stock ajouté avec succès", data: newStock })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Mettre à jour un stock par ID
export const updateStock = async (req, res) => {
  try {
    const updatedStock = await stockService.updateStock(req.params.id, req.body)
    res.json({ message: "Stock mis à jour avec succès", data: updatedStock })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Mettre à jour un stock par l'ID du produit
export const updateStockByProductId = async (req, res) => {
  try {
    const updatedStock = await stockService.updateStockByProductId(
      req.params.produit_id,
      req.body
    )
    res.json({
      message: "Stock mis à jour avec succès pour le produit",
      data: updatedStock,
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Décrémente le stock pour une commande
export const decrementStockForOrder = async (req, res) => {
  try {
    console.log("🔹 Order details reçus :", req.body)

    //Je récupère @io dans ma requete.
    const io = req.io

    if (!io) {
      console.warn(
        "⚠️ io n'est pas défini dans req, l'événement ne sera pas émis."
      )
    }
    if (!req.body) {
      console.error("❌ ERREUR : req.body est undefined !")
      return res
        .status(400)
        .json({ message: "Le corps de la requête est vide." })
    }
    const { orderDetails } = req.body

    if (!orderDetails || !Array.isArray(orderDetails)) {
      console.error("❌ ERREUR : orderDetails est invalide !")
      return res.status(400).json({
        message: "Les détails de la commande sont invalides.",
        req,
        body: req.body,
      })
    }

    const result = await stockService.decrementStockForOrder(orderDetails, io)
    res.json(result)
  } catch (error) {
    console.error("❌ Erreur dans decrementStockForOrder :", error.message)
    res.status(400).json({ message: error.message })
  }
}

// Supprimer un stock par ID
export const deleteStock = async (req, res) => {
  try {
    const deletedStock = await stockService.deleteStock(req.params.id)
    res.json({ message: "Stock supprimé avec succès", data: deletedStock })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const incrementStock = async (req, res) => {
  try {
    const { id } = req.params
    const { quantite_disponible } = req.body

    // ✅ Vérifier si `stock_id` et `quantite_disponible` sont valides
    if (!quantite_disponible || quantite_disponible <= 0) {
      return res
        .status(400)
        .json({ message: "Données invalides pour l'incrémentation du stock" })
    }

    const result = await stockService.incrementStock(id, quantite_disponible)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
