import ProductDAO from "../dao/productDAO.js"
import StockDAO from "../dao/stockDAO.js"

class ProductService {
  // ✅ Récupérer un produit avec gestion d'erreur
  async getProductById(productId) {
    const product = await ProductDAO.findById(productId)
    if (!product) {
      throw new Error(`Produit introuvable avec l'ID: ${productId}`)
    }
    return product
  }

  // ✅ Récupérer tous les produits avec pagination et filtres
  async getAllProducts(filter = {}, page = 1, limit = 10) {
    return await ProductDAO.findAll(filter, page, limit)
  }

  // ✅ Créer un produit avec validation
  async createProduct(productData) {
    try {
      console.log("🔵 Début de la création du produit")

      const { reference, quantite_disponible } = productData
      let product = await ProductDAO.findByReference(reference)
      console.log(productData)
      if (product) {
        console.log("🔄 Produit existant, mise à jour du stock")
        let existingStock = await StockDAO.findByProductId(product._id)

        if (existingStock) {
          console.log("📈 Mise à jour du stock existant")
          await StockDAO.incrementStock(existingStock._id, quantite_disponible)
          return { message: "Quantité mise à jour", data: product }
        }

        console.log("⚠️ Aucun stock trouvé, création d'un nouveau stock")
        await StockDAO.createStock({
          produit_id: product._id,
          quantite_disponible,
          sales_point_id: productData.sales_point_id,

          statut: "en_stock",
        })
      }
      // return { message: "Produit existant, stock créé", data: product }
      //   }

      console.log("🆕 Création du produit et du stock associé")
      product = await ProductDAO.createProduct(productData)

      await StockDAO.createStock({
        produit_id: product._id,
        quantite_disponible,
        sales_point_id: productData.sales_point_id,
        statut: "en_stock",
      })

      return { message: "Produit et stock créés", data: product }
    } catch (error) {
      console.error("❌ Erreur lors de la création du produit :", error)
      throw new Error(
        `Erreur lors de la création du produit : ${error.message}`
      )
    }
  }

  // ✅ Mettre à jour un produit avec validation
  async updateProduct(productId, updateData) {
    const updatedProduct = await ProductDAO.updateProduct(productId, updateData)
    if (!updatedProduct) {
      throw new Error(
        `Échec de la mise à jour. Produit introuvable avec l'ID: ${productId}`
      )
    }
    return updatedProduct
  }

  // ✅ Supprimer un produit avec vérification
  async deleteProduct(productId) {
    const deletedProduct = await ProductDAO.deleteProduct(productId)
    if (!deletedProduct) {
      throw new Error(
        `Échec de la suppression. Produit introuvable avec l'ID: ${productId}`
      )
    }
    return { message: "Produit supprimé avec succès", deletedProduct }
  }
}

export default new ProductService()
