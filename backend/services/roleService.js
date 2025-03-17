import RoleDAO from "../dao/roleDAO.js"
import User from "../models/userModel.js"

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
    if (!roleData.name) {
      throw new Error("Le champ 'nom' est requis")
    }
    return await RoleDAO.create(roleData)
  }

  async updateRole(id, roleData) {
    // 1️⃣ Mettre à jour le rôle dans la collection `roles`
    const updatedRole = await RoleDAO.update(id, roleData)
    if (!updatedRole) {
      throw new Error("Rôle introuvable")
    }

    // 2️⃣ Mettre à jour tous les utilisateurs qui ont ce rôle
    await User.updateMany(
      { "role._id": id }, // Trouver les utilisateurs ayant ce rôle
      { $set: { "role.name": updatedRole.name } } // Modifier le nom du rôle
    )

    return updatedRole
  }

  async deleteRole(id) {
    const deletedRole = await RoleDAO.delete(id)
    if (!deletedRole) {
      throw new Error("Rôle introuvable")
    }

    // Optionnel : Supprimer aussi le rôle chez les utilisateurs
    await User.updateMany(
      { "role._id": id },
      { $unset: { role: "" } } // Supprime le champ `role`
    )

    return deletedRole
  }
}

export default new RoleService()
