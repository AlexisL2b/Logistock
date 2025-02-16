import categoryDAO from "../dao/categoryDAO.js"
import CategoryDAO from "../dao/categoryDAO.js"
import productDAO from "../dao/productDAO.js"

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
    if (!categoryData.name) {
      throw new Error("Le champ 'nom' est requis")
    }
    const categories = await categoryDAO.findAll()

    const existe = categories.some((item) => {
      console.log("item", item) // ✅ Vérifie chaque item parcouru
      return item.name === categoryData.name // ✅ Ajoute `return` pour que `some()` fonctionne
    })

    if (!existe) {
      console.log("existe", existe)
      console.log("categoryData", categoryData)

      return await CategoryDAO.create(categoryData)
    } else {
      throw new Error("Cette catégorie existe déjàzzzz!")
    }
  }

  async updateCategory(id, categoryData) {
    // if (!updatedCategory) {
    //   throw new Error("Catégorie introuvable")
    // }
    const categories = await categoryDAO.findAll()

    const existe = categories.some((item) => {
      return item.name === categoryData.name // ✅ Ajoute `return` pour que `some()` fonctionne
    })
    if (!existe) {
      const updatedCategory = await CategoryDAO.update(id, categoryData)

      return updatedCategory
    } else {
      throw new Error("Cette catégorie existe déjà!")
    }
  }

  async deleteCategory(id) {
    // Vérifier si la catégorie est associée à des produits avant de supprimer
    const products = await productDAO.findByCategoryId(id)
    console.log(products)
    if (products.length > 0) {
      const noms = products.map((p) => p.name).join(", ")
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
