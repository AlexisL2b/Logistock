import CategoryDAO from "../dao/categoryDAO.js"

class CategoryService {
  async getAllCategories() {
    return await CategoryDAO.findAll()
  }

  async getCategoryById(id) {
    const category = await CategoryDAO.findById(id)
    if (!category) {
      throw new Error("Catégorie introuvable")
    }
    return category
  }

  async addCategory(categoryData) {
    if (!categoryData.nom) {
      throw new Error("Le champ 'nom' est requis")
    }
    return await CategoryDAO.create(categoryData)
  }

  async updateCategory(id, categoryData) {
    const updatedCategory = await CategoryDAO.update(id, categoryData)
    if (!updatedCategory) {
      throw new Error("Catégorie introuvable")
    }
    return updatedCategory
  }

  async deleteCategory(id) {
    // Vérifier si la catégorie est associée à des produits avant de supprimer
    const associatedProducts = await CategoryDAO.findAssociatedProducts(id)
    if (associatedProducts.length > 0) {
      const noms = associatedProducts.map((p) => p.nom).join(", ")
      throw new Error(
        `Impossible de supprimer la catégorie. Elle est associée aux produits suivants : ${noms}`
      )
    }

    const deletedCategory = await CategoryDAO.delete(id)
    if (!deletedCategory) {
      throw new Error("Catégorie introuvable")
    }
    return deletedCategory
  }
}

export default new CategoryService()
