import Product from "../models/productModel.js"
import Stock from "../models/stockModel.js"

class ProductDAO {
  // ✅ Récupérer un produit par ID

  async findByReference(reference) {
    return await Product.findOne({ reference })
  }

  // ✅ Récupérer tous les produits avec options de filtrage et pagination
  async findAll() {
    // Récupérer tous les produits
    const products = await Product.find()
      .populate([
        { path: "categorie_id", model: "Category", select: "nom" },
        { path: "supplier_id", model: "Supplier", select: "nom" },
      ])
      .lean() // Utiliser `lean()` pour des objets JS purs

    // Pour chaque produit, chercher la quantité disponible dans `Stock`
    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const stock = await Stock.findOne({ produit_id: product._id }) // 🔥 Recherche du stock lié
        return {
          ...product,
          quantite_disponible: stock ? stock.quantite_disponible : 0, // 🔥 Ajoute `quantite_disponible`
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
