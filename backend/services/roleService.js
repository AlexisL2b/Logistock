import RoleDAO from "../dao/roleDAO.js"

class RoleService {
  async getAllRoles() {
    return await RoleDAO.findAll()
  }

  async getRoleById(id) {
    const role = await RoleDAO.findById(id)
    if (!role) {
      throw new Error("Rôle introuvable")
    }
    return role
  }

  async addRole(roleData) {
    if (!roleData.nom) {
      throw new Error("Le champ 'nom' est requis")
    }
    return await RoleDAO.create(roleData)
  }

  async updateRole(id, roleData) {
    const updatedRole = await RoleDAO.update(id, roleData)
    if (!updatedRole) {
      throw new Error("Rôle introuvable")
    }
    return updatedRole
  }

  async deleteRole(id) {
    const deletedRole = await RoleDAO.delete(id)
    if (!deletedRole) {
      throw new Error("Rôle introuvable")
    }
    return deletedRole
  }
}

export default new RoleService()
