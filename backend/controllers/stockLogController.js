import StockLog from "../models/stockLogModel.js"

// Récupérer tous les logs de stock
export const getAllStockLogs = async (req, res) => {
  try {
    const stockLogs = await StockLog.find().populate(
      "produit_id",
      "nom description"
    )
    res.json(stockLogs)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des logs de stock",
      error,
    })
  }
}

// Récupérer un log de stock par ID
export const getStockLogById = async (req, res) => {
  try {
    const stockLog = await StockLog.findById(req.params.id).populate(
      "produit_id",
      "nom description"
    )
    if (!stockLog)
      return res.status(404).json({ message: "Log de stock introuvable" })
    res.json(stockLog)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du log de stock",
      error,
    })
  }
}

// Ajouter un nouveau log de stock
export const addStockLog = async (req, res) => {
  try {
    const newStockLog = new StockLog(req.body)
    const savedStockLog = await newStockLog.save()
    res.status(201).json(savedStockLog)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du log de stock",
      error,
    })
  }
}

// Mettre à jour un log de stock par ID
export const updateStockLog = async (req, res) => {
  try {
    const updatedStockLog = await StockLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Renvoie l'objet mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )
    if (!updatedStockLog)
      return res.status(404).json({ message: "Log de stock introuvable" })
    res.json(updatedStockLog)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du log de stock",
      error,
    })
  }
}

// Supprimer un log de stock par ID
export const deleteStockLog = async (req, res) => {
  try {
    const deletedStockLog = await StockLog.findByIdAndDelete(req.params.id)
    if (!deletedStockLog)
      return res.status(404).json({ message: "Log de stock introuvable" })
    res.json({ message: "Log de stock supprimé avec succès" })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du log de stock",
      error,
    })
  }
}
