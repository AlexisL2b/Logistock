import roleService from "../services/roleService.js"

// Récupérer tous les rôles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles()
    res.json(roles)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer un rôle par ID
export const getRoleById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id)
    res.json(role)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Ajouter un rôle
export const addRole = async (req, res) => {
  try {
    const newRole = await roleService.addRole(req.body)
    res.status(201).json(newRole)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Mettre à jour un rôle
export const updateRole = async (req, res) => {
  try {
    const updatedRole = await roleService.updateRole(req.params.id, req.body)
    res.json(updatedRole)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Supprimer un rôle
export const deleteRole = async (req, res) => {
  try {
    const deletedRole = await roleService.deleteRole(req.params.id)
    res.json({ message: "Rôle supprimé avec succès", data: deletedRole })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
