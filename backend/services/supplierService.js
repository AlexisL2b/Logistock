import SupplierDAO from "../dao/supplierDAO.js"

class SupplierService {
  async getAllSuppliers() {
    return await SupplierDAO.findAll()
  }

  async getSupplierById(id) {
    const supplier = await SupplierDAO.findById(id)
    if (!supplier) {
      throw new Error("Fournisseur introuvable")
    }
    return supplier
  }

  async addSupplier(supplierData) {
    if (!supplierData.nom) {
      throw new Error("Le champ 'nom' est requis")
    }
    return await SupplierDAO.create(supplierData)
  }

  async updateSupplier(id, supplierData) {
    const updatedSupplier = await SupplierDAO.update(id, supplierData)
    if (!updatedSupplier) {
      throw new Error("Fournisseur introuvable")
    }
    return updatedSupplier
  }

  async deleteSupplier(id) {
    const associatedProducts = await SupplierDAO.findAssociatedProducts(id)

    if (associatedProducts.length > 0) {
      const noms = associatedProducts.map((product) => product.nom).join(", ")
      throw new Error(
        `Impossible de supprimer le fournisseur, il est associé aux produits suivants : ${noms}`
      )
    }

    const deletedSupplier = await SupplierDAO.delete(id)
    if (!deletedSupplier) {
      throw new Error("Fournisseur introuvable")
    }
    return { message: "Fournisseur supprimé avec succès" }
  }
}

export default new SupplierService()
