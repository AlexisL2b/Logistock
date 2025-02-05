import SalesPoint from "../models/salesPointModel.js"

// Récupérer tous les points de vente
export const getAllSalesPoints = async (req, res) => {
  try {
    const salesPoints = await SalesPoint.find()
    res.json(salesPoints)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des points de vente",
      error,
    })
  }
}

// Récupérer un point de vente par ID
export const getSalesPointById = async (req, res) => {
  try {
    const salesPoint = await SalesPoint.findById(req.params.id)
    if (!salesPoint) {
      return res.status(404).json({ message: "Point de vente introuvable" })
    }
    res.json({
      message: "Point de vente récupéré avec succès",
      data: salesPoint,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du point de vente",
      error,
    })
  }
}

// Ajouter un nouveau point de vente
export const addSalesPoint = async (req, res) => {
  try {
    const newSalesPoint = new SalesPoint(req.body)
    const savedSalesPoint = await newSalesPoint.save()
    res.status(201).json({
      message: "Point de vente ajouté avec succès",
      data: savedSalesPoint,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du point de vente",
      error,
    })
  }
}

// Mettre à jour un point de vente par ID
export const updateSalesPoint = async (req, res) => {
  try {
    const updatedSalesPoint = await SalesPoint.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Renvoie l'objet mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )
    if (!updatedSalesPoint) {
      return res.status(404).json({ message: "Point de vente introuvable" })
    }
    res.json({
      message: "Point de vente mis à jour avec succès",
      data: updatedSalesPoint,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du point de vente",
      error,
    })
  }
}

// Supprimer un point de vente par ID
export const deleteSalesPoint = async (req, res) => {
  try {
    const deletedSalesPoint = await SalesPoint.findByIdAndDelete(req.params.id)
    if (!deletedSalesPoint) {
      return res.status(404).json({ message: "Point de vente introuvable" })
    }
    res.json({
      message: "Point de vente supprimé avec succès",
      data: deletedSalesPoint,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du point de vente",
      error,
    })
  }
}
