import mongoose from "mongoose"
import Category from "../models/categoryModel.js"
import Product from "../models/productModel.js" // 🔥 Vérifie que tu as bien importé le modèle Produit

class CategoryDAO {
  async findAll() {
    return await Category.find()
  }

  async getById(id) {
    return await Category.findById(id)
  }

  async create(categoryData) {
    const newCategory = new Category(categoryData)
    return await newCategory.save()
  }

  async update(id, categoryData) {
    return await Category.findByIdAndUpdate(id, categoryData, {
      new: true,
      runValidators: true,
    })
  }

  // ✅ Vérifie si la catégorie est utilisée dans des produits
  async findAssociatedProducts(categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("ID de catégorie invalide.")
    }

    const count = await Product.countDocuments({ category_id: categoryId }) // 🔥 Vérifie si au moins un produit utilise cette catégorie
    return count > 0 // Retourne `true` si des produits existent, sinon `false`
  }

  // ✅ Bloque la suppression si la catégorie est utilisée
  async delete(id) {
    const isUsed = await this.findAssociatedProducts(id)

    if (isUsed) {
      throw new Error(
        "Impossible de supprimer cette catégorie, elle est encore utilisée par des produits."
      )
    }

    return await Category.findByIdAndDelete(id)
  }
}

export default new CategoryDAO()
