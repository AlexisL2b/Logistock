import ProductDAO from "../dao/productDAO.js"
import stockDAO from "../dao/stockDAO.js"
import StockDAO from "../dao/stockDAO.js"
import stockLogDAO from "../dao/stockLogDAO.js"

class ProductService {
  // ✅ Récupérer un produit avec gestion d'erreur
  async getAllProducts() {
    // console.log("zzzz", ProductDAO.findAll())
    return await ProductDAO.findAll()
  }

  async getProductById(id) {
    const product = await ProductDAO.findById(id)
    if (!product) {
      throw new Error("Produit introuvable")
    }
    return product
  }
  // ✅ Créer un produit avec validation
  async createProduct(productData) {
    try {
      console.log("🔵 Début de la création du produit", productData)

      const { reference, quantity } = productData
      let product = await ProductDAO.findByReference(reference)
      console.log(
        "🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵",
        product,
        "🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵"
      )
      if (product) {
        console.log("🔄 Produit existant, mise à jour du stock")
        let existingStock = await StockDAO.findByProductId(product._id)
        if (existingStock) {
          console.log(
            "📈 Stock déjà existant, mise à jour au lieu de créer un nouveau."
          )
          await StockDAO.incrementStock(existingStock._id, quantity)
        } else {
          console.log("🆕 Création d'un nouveau stock")
          let stock = await StockDAO.createStock({
            product_id: product._id,
            quantity,
            statut: "en_stock",
          })

          await stockLogDAO.create({
            event: "création",
            quantity: quantity,
            stock_id: stock._id,
          })
        }

        return { message: "Produit existant, stock créé", data: product }
      }

      console.log("🆕 productData", productData)
      product = await ProductDAO.create(productData)
      console.log(
        "//////////////////////////////product//////////////////////////////",
        product._id
      )

      let stock = await StockDAO.createStock({
        product_id: product._id,
        quantity,
        statut: "en_stock",
      })
      let stockLog = await stockLogDAO.create({
        event: "création",
        quantity: quantity,
        stock_id: stock._id,
      })
      return { message: "Produit et stock créés", data: product }
    } catch (error) {
      console.error("❌ Erreur lors de la création du produit :", error)
      throw new Error(
        `Erreur lors de la création du produit : ${error.message}`
      )
    }
  }
  // async createProduct(productData) {
  //   try {
  //     console.log("🔵 Début de la création du produit", productData)
  //     const { reference, quantity } = productData

  //     // 🔍 1️⃣ Vérifier si le produit avec cette référence existe déjà
  //     let product = await ProductDAO.findByReference(reference)
  //     console.log("🔵 Produit", product)

  //     if (product) {
  //       console.log("🔄 Produit existant, mise à jour du stock")

  //       // 🔍 2️⃣ Vérifier si un stock existe pour ce produit
  //       let existingStock = await StockDAO.findByProductId(product._id)

  //       if (existingStock) {
  //         console.log("📈 Mise à jour du stock existant")
  //         await StockDAO.incrementStock(existingStock._id, quantity)
  //         return { message: "Quantité mise à jour", data: product }
  //       }

  //       console.log("⚠️ Aucun stock trouvé, création d'un nouveau stock")
  //       await StockDAO.createStock({
  //         product_id: product._id,
  //         quantity,
  //         statut: "en_stock",
  //       })

  //       return { message: "Produit existant, stock créé", data: product }
  //     }

  //     // 🆕 3️⃣ Si le produit n'existe pas, on le crée avec un stock initial
  //     console.log("🆕 Création d'un nouveau produit")
  //     product = await ProductDAO.create(productData)

  //     await StockDAO.createStock({
  //       product_id: product._id,
  //       quantity,
  //       statut: "en_stock",
  //     })

  //     return { message: "Produit et stock créés", data: product }
  //   } catch (error) {
  //     console.error("❌ Erreur lors de la création du produit :", error)
  //     throw new Error(
  //       `Erreur lors de la création du produit : ${error.message}`
  //     )
  //   }
  // }

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
    console.log("productId", productId)
    const stockToDelete = await stockDAO.findByProductId(productId)

    await stockLogDAO.create({
      stock_id: stockToDelete._id,
      quantity: 0,
      event: "suppression",
    })
    await stockDAO.deleteByProductId(productId)
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
