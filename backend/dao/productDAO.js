import Product from "../models/productModel.js"

class ProductDAO {
  // ✅ Récupérer un produit par ID
  async findById(productId) {
    return await Product.findById(productId)
  }
  async findByReference(reference) {
    return await Product.findOne({ reference })
  }

  // ✅ Récupérer tous les produits avec options de filtrage et pagination
  async findAll(filter = {}, page = 1, limit = 10) {
    return await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
  }

  // ✅ Créer un nouveau produit
  async createProduct(productData) {
    const product = new Product(productData)
    return await product.save()
  }

  // ✅ Mettre à jour un produit
  async updateProduct(productId, updateData) {
    return await Product.findByIdAndUpdate(productId, updateData, { new: true })
  }

  // ✅ Supprimer un produit
  async deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId)
  }
}

export default new ProductDAO()
