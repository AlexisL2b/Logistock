import roleService from "../services/roleService.js"

const roleController = {
  // 🔹 Récupérer tous les rôles
  async getAll(req, res) {
    try {
      const roles = await roleService.getAllRoles()
      res.json(roles)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  // 🔹 Récupérer un rôle par ID
  async getById(req, res) {
    try {
      const role = await roleService.getRoleById(req.params.id)
      res.json(role)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // 🔹 Ajouter un rôle
  async create(req, res) {
    try {
      const newRole = await roleService.addRole(req.body)
      res.status(201).json(newRole)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  // 🔹 Mettre à jour un rôle
  async update(req, res) {
    try {
      const updatedRole = await roleService.updateRole(req.params.id, req.body)
      res.json(updatedRole)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // 🔹 Supprimer un rôle
  async remove(req, res) {
    try {
      const deletedRole = await roleService.deleteRole(req.params.id)
      res.json({ message: "Rôle supprimé avec succès", data: deletedRole })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}

export default roleController
