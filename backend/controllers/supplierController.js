import SupplierService from "../services/supplierService.js"

const supplierController = {
  // 🔹 Récupérer tous les fournisseurs
  async getAll(req, res) {
    try {
      const suppliers = await SupplierService.getAllSuppliers()
      res.json(suppliers)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  // 🔹 Récupérer un fournisseur par ID
  async getById(req, res) {
    try {
      const supplier = await SupplierService.getSupplierById(req.params.id)
      res.json(supplier)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // 🔹 Ajouter un nouveau fournisseur
  async create(req, res) {
    try {
      const newSupplier = await SupplierService.addSupplier(req.body)
      res.status(201).json(newSupplier)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  // 🔹 Mettre à jour un fournisseur
  async update(req, res) {
    try {
      const updatedSupplier = await SupplierService.updateSupplier(
        req.params.id,
        req.body
      )
      res.json(updatedSupplier)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // 🔹 Supprimer un fournisseur
  async remove(req, res) {
    try {
      const result = await SupplierService.deleteSupplier(req.params.id)
      res.json(result)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },
}

export default supplierController
