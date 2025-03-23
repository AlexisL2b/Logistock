import TransporterService from "../services/transporterService.js"

const transporterController = {
  // 🔹 Récupérer tous les transporteurs
  async getAll(req, res) {
    try {
      const transporters = await TransporterService.getAllTransporters()
      res.json({
        message: "Transporteurs récupérés avec succès",
        data: transporters,
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  // 🔹 Récupérer un transporteur par ID
  async getById(req, res) {
    try {
      const transporter = await TransporterService.getTransporterById(
        req.params.id
      )
      res.json({
        message: "Transporteur récupéré avec succès",
        data: transporter,
      })
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // 🔹 Ajouter un nouveau transporteur
  async create(req, res) {
    try {
      const newTransporter = await TransporterService.addTransporter(req.body)
      res.status(201).json({
        message: "Transporteur ajouté avec succès",
        data: newTransporter,
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  // 🔹 Mettre à jour un transporteur
  async update(req, res) {
    try {
      const updatedTransporter = await TransporterService.updateTransporter(
        req.params.id,
        req.body
      )
      res.json({
        message: "Transporteur mis à jour avec succès",
        data: updatedTransporter,
      })
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // 🔹 Supprimer un transporteur
  async remove(req, res) {
    try {
      const result = await TransporterService.deleteTransporter(req.params.id)
      res.json(result)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },
}

export default transporterController
