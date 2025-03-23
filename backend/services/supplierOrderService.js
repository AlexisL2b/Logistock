import supplierOrderDAO from "../dao/supplierOrderDAO.js"

const supplierOrderService = {
  create: async (data) => {
    return await supplierOrderDAO.create(data)
  },

  getAll: async () => {
    return await supplierOrderDAO.getAll()
  },

  getById: async (id) => {
    return await supplierOrderDAO.getById(id)
  },

  update: async (id, data) => {
    return await supplierOrderDAO.update(id, data)
  },

  delete: async (id) => {
    return await supplierOrderDAO.delete(id)
  },
}

export default supplierOrderService
