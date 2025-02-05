import Role from "../models/roleModel.js"

class RoleDAO {
  async findAll() {
    return await Role.find()
  }

  async findById(id) {
    return await Role.findById(id)
  }

  async create(roleData) {
    const newRole = new Role(roleData)
    return await newRole.save()
  }

  async update(id, roleData) {
    return await Role.findByIdAndUpdate(id, roleData, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return await Role.findByIdAndDelete(id)
  }
}

export default new RoleDAO()
