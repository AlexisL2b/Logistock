import Role from "../models/roleModel.js"

// Récupérer tous les rôles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find()
    res.json({
      message: "Rôles récupérés avec succès",
      data: roles,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des rôles",
      error,
    })
  }
}

// Récupérer un rôle par ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
    if (!role) {
      return res.status(404).json({ message: "Rôle introuvable" })
    }
    res.json({
      message: "Rôle récupéré avec succès",
      data: role,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du rôle",
      error,
    })
  }
}

// Ajouter un nouveau rôle
export const addRole = async (req, res) => {
  try {
    const newRole = new Role(req.body)
    const savedRole = await newRole.save()
    res.status(201).json({
      message: "Rôle ajouté avec succès",
      data: savedRole,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout du rôle",
      error,
    })
  }
}

// Mettre à jour un rôle par ID
export const updateRole = async (req, res) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!updatedRole) {
      return res.status(404).json({ message: "Rôle introuvable" })
    }
    res.json({
      message: "Rôle mis à jour avec succès",
      data: updatedRole,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du rôle",
      error,
    })
  }
}

// Supprimer un rôle par ID
export const deleteRole = async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id)
    if (!deletedRole) {
      return res.status(404).json({ message: "Rôle introuvable" })
    }
    res.json({
      message: "Rôle supprimé avec succès",
      data: deletedRole,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du rôle",
      error,
    })
  }
}

// Routes associées
