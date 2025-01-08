import Transporter from "../models/transporterModel.js"

// Récupérer tous les transporteurs
export const getAllTransporters = async (req, res) => {
  try {
    const transporters = await Transporter.find()
    res.json({
      message: "Transporteurs récupérés avec succès",
      data: transporters,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des transporteurs",
      error,
    })
  }
}

// Récupérer un transporteur par ID
export const getTransporterById = async (req, res) => {
  try {
    const transporter = await Transporter.findById(req.params.id)
    if (!transporter) {
      return res.status(404).json({ message: "Transporteur introuvable" })
    }
    res.json({
      message: "Transporteur récupéré avec succès",
      data: transporter,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du transporteur",
      error,
    })
  }
}

// Ajouter un nouveau transporteur
export const addTransporter = async (req, res) => {
  try {
    const newTransporter = new Transporter(req.body)
    const savedTransporter = await newTransporter.save()
    res.status(201).json({
      message: "Transporteur ajouté avec succès",
      data: savedTransporter,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du transporteur",
      error,
    })
  }
}

// Mettre à jour un transporteur par ID
export const updateTransporter = async (req, res) => {
  try {
    const updatedTransporter = await Transporter.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Renvoie l'objet mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )
    if (!updatedTransporter) {
      return res.status(404).json({ message: "Transporteur introuvable" })
    }
    res.json({
      message: "Transporteur mis à jour avec succès",
      data: updatedTransporter,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du transporteur",
      error,
    })
  }
}

// Supprimer un transporteur par ID
export const deleteTransporter = async (req, res) => {
  try {
    const deletedTransporter = await Transporter.findByIdAndDelete(
      req.params.id
    )
    if (!deletedTransporter) {
      return res.status(404).json({ message: "Transporteur introuvable" })
    }
    res.json({
      message: "Transporteur supprimé avec succès",
      data: deletedTransporter,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du transporteur",
      error,
    })
  }
}
