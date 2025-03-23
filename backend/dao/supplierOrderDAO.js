import SupplierOrder from "../models/supplierOrderModel.js"

const supplierOrderDAO = {
  create: async (data) => {
    try {
      const newOrder = new SupplierOrder(data)
      return await newOrder.save()
    } catch (error) {
      throw new Error(
        `Erreur lors de la création de la commande fournisseur : ${error.message}`
      )
    }
  },

  getAll: async () => {
    try {
      return await SupplierOrder.find().populate("supplier_id")
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des commandes fournisseur : ${error.message}`
      )
    }
  },

  getById: async (id) => {
    try {
      return await SupplierOrder.findById(id).populate("supplier_id")
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de la commande fournisseur : ${error.message}`
      )
    }
  },

  update: async (id, data) => {
    try {
      return await SupplierOrder.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
    } catch (error) {
      throw new Error(
        `Erreur lors de la mise à jour de la commande fournisseur : ${error.message}`
      )
    }
  },

  delete: async (id) => {
    try {
      return await SupplierOrder.findByIdAndDelete(id)
    } catch (error) {
      throw new Error(
        `Erreur lors de la suppression de la commande fournisseur : ${error.message}`
      )
    }
  },
}

export default supplierOrderDAO
