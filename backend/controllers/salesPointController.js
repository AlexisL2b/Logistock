import salesPointService from "../services/salesPointService.js"

const salesPointController = {
  // 🔹 Récupérer tous les points de vente
  async getAll(req, res) {
    try {
      const salesPoints = await salesPointService.getAllSalesPoints()
      res.json(salesPoints)
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des points de vente" })
    }
  },

  // 🔹 Récupérer un point de vente par ID
  async getById(req, res) {
    try {
      const salesPoint = await salesPointService.getSalesPointById(
        req.params.id
      )
      res.json({
        message: "Point de vente récupéré avec succès",
        data: salesPoint,
      })
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // 🔹 Ajouter un nouveau point de vente
  async create(req, res) {
    try {
      const newSalesPoint = await salesPointService.addSalesPoint(req.body)
      res.status(201).json({
        message: "Point de vente ajouté avec succès",
        data: newSalesPoint,
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  // 🔹 Mettre à jour un point de vente
  async update(req, res) {
    try {
      const updatedSalesPoint = await salesPointService.updateSalesPoint(
        req.params.id,
        req.body
      )
      res.json({
        message: "Point de vente mis à jour avec succès",
        data: updatedSalesPoint,
      })
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // 🔹 Supprimer un point de vente
  async remove(req, res) {
    try {
      const deletedSalesPoint = await salesPointService.deleteSalesPoint(
        req.params.id
      )
      res.json({
        message: "Point de vente supprimé avec succès",
        data: deletedSalesPoint,
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  // 🔹 Récupérer les points de vente sans utilisateur
  async getWithoutUsers(req, res) {
    try {
      const salesPoints = await salesPointService.getSalesPointsWithoutUsers()
      res.json({
        message: "Points de vente sans utilisateur récupérés avec succès",
        data: salesPoints,
      })
    } catch (error) {
      res.status(500).json({
        message:
          "Erreur lors de la récupération des points de vente sans utilisateur",
      })
    }
  },
}

export default salesPointController
