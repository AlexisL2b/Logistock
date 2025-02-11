import SupplierService from "../services/supplierService.js"

// Récupérer tous les fournisseurs
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await SupplierService.getAllSuppliers()
    res.json(suppliers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer un fournisseur par ID
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await SupplierService.getSupplierById(req.params.id)
    res.json(supplier)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Ajouter un nouveau fournisseur
export const addSupplier = async (req, res) => {
  try {
    const newSupplier = await SupplierService.addSupplier(req.body)
    res.status(201).json(newSupplier)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Mettre à jour un fournisseur par ID
export const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await SupplierService.updateSupplier(
      req.params.id,
      req.body
    )
    res.json(updatedSupplier)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Supprimer un fournisseur par ID
export const deleteSupplier = async (req, res) => {
  try {
    const result = await SupplierService.deleteSupplier(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
