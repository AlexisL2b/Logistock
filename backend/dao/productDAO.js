import mongoose from "mongoose"
import Product from "../models/productModel.js"
import Stock from "../models/stockModel.js"

class ProductDAO {
  // ✅ Récupérer un produit par ID

  async findByReference(reference) {
    return await Product.findOne({ reference })
  }
  async findByCategoryId(category_id) {
    if (!mongoose.Types.ObjectId.isValid(category_id)) {
      throw new Error("ID de catégorie invalide.") // ✅ Vérification de l'ID
    }

    const products = await Product.find({ category_id }) // 🔥 Optionnel : récupérer les infos de la catégorie
    console.log("products dans productsDAO findbycategorieId", products)
    return products
  }
  async findBySupplierId(supplier_id) {
    if (!mongoose.Types.ObjectId.isValid(supplier_id)) {
      throw new Error("ID de fournisseur invalide.") // ✅ Vérification de l'ID
    }

    const products = await Product.find({ supplier_id }) // 🔥 Optionnel : récupérer les infos de la catégorie
    console.log("products dans productsDAO findbySupplierId", products)
    return products
  }

  // ✅ Récupérer tous les produits avec options de filtrage et pagination
  async findAll() {
    // Récupérer tous les produits
    const products = await Product.find()
      .populate([
        { path: "category_id", model: "Category", select: "name" },
        { path: "supplier_id", model: "Supplier", select: "name" },
      ])
      .lean() // Utiliser `lean()` pour des objets JS purs

    // Pour chaque produit, chercher la quantité disponible dans `Stock`
    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const stock = await Stock.findOne({ product_id: product._id }) // 🔥 Recherche du stock lié
        return {
          ...product,
          quantity: stock ? stock.quantity : 0, // 🔥 Ajoute `quantite_disponible`
        }
      })
    )

    return productsWithStock
  }

  async findById(id) {
    return await Product.findById(id)
      .populate("stock_id", "quantite_disponible")
      .lean()
  }

  // ✅ Mettre à jour un produit
  async updateProduct(productId, updateData) {
    return await Product.findByIdAndUpdate(productId, updateData, { new: true })
  }
  async create(productData) {
    const newProduct = new Product(productData)
    return await newProduct.save()
  }
  // ✅ Supprimer un produit
  async deleteProduct(productId) {
    return await Product.findByIdAndDelete(productId)
  }
}

export default new ProductDAO()
