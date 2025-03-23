import orderDAO from "../dao/orderDAO.js"
import ProductDAO from "../dao/productDAO.js"
import StockDAO from "../dao/stockDAO.js"
import StockLogDAO from "../dao/stockLogDAO.js"
import Order from "../models/orderModel.js"

import sanitize from "mongo-sanitize" // 🔹 Évite les injections NoSQL
import validator from "validator" // 🔹 Vérifie et nettoie les entrées

class ProductService {
  // ✅ Récupérer tous les produits
  async getAllProducts() {
    return await ProductDAO.findAll()
  }

  // ✅ Récupérer un produit par ID avec sanitization
  async getProductById(id) {
    const sanitizedId = sanitize(id)
    const product = await ProductDAO.findById(sanitizedId)
    if (!product) {
      throw new Error("Produit introuvable")
    }
    return product
  }

  // ✅ Créer un produit avec sanitization et validation
  async createProduct(productData) {
    try {
      // 🛡️ Sanitize les entrées utilisateur
      const sanitizedData = {
        name: sanitize(productData.name?.trim()),
        reference: sanitize(productData.reference?.trim()),
        description: sanitize(productData.description?.trim()),
        price: sanitize(productData.price),
        category_id: sanitize(productData.category_id),
        supplier_id: sanitize(productData.supplier_id),
        quantity: sanitize(productData.quantity),
      }
      const { quantity, ...productDataSanitized } = sanitizedData

      // 🔍 Validation des champs
      if (
        !sanitizedData.name ||
        !validator.isLength(sanitizedData.name, { min: 3, max: 100 })
      ) {
        throw new Error(
          "Le nom du produit doit contenir entre 3 et 100 caractères."
        )
      }
      if (
        !sanitizedData.reference ||
        !validator.isAlphanumeric(sanitizedData.reference)
      ) {
        throw new Error("La référence doit être alphanumérique.")
      }
      if (
        !sanitizedData.price ||
        !validator.isNumeric(String(sanitizedData.price))
      ) {
        throw new Error("Le prix doit être un nombre valide.")
      }
      if (
        !sanitizedData.quantity ||
        !validator.isInt(String(sanitizedData.quantity), { min: 0 })
      ) {
        throw new Error("La quantité doit être un nombre entier positif.")
      }

      // 🔍 Vérifier si le produit existe déjà
      let product = await ProductDAO.findByReference(sanitizedData.reference)
      if (product) {
        let existingStock = await StockDAO.findByProductId(product._id)
        if (existingStock) {
          console.log(
            "📈 Stock déjà existant, mise à jour au lieu de créer un nouveau."
          )
          await StockDAO.incrementStock(
            existingStock._id,
            sanitizedData.quantity
          )
        } else {
          let stock = await StockDAO.createStock({
            product_id: product._id,
            quantity: sanitizedData.quantity,
            statut: "en_stock",
          })

          await StockLogDAO.create({
            event: "création",
            quantity: sanitizedData.quantity,
            stock_id: stock._id,
          })
        }
        return { message: "Produit existant, stock mis à jour", data: product }
      }

      // 🆕 Si le produit n'existe pas, on le crée avec un stock initial
      console.log(
        "productDataSanitized depuis productService.js",
        productDataSanitized
      )
      product = await ProductDAO.create(productDataSanitized)

      let stock = await StockDAO.createStock({
        product_id: product._id,
        quantity: sanitizedData.quantity,
        statut: "en_stock",
      })

      await StockLogDAO.create({
        event: "création",
        quantity: sanitizedData.quantity,
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

  // ✅ Mettre à jour un produit avec sanitization et validation
  async updateProduct(productId, updateData) {
    const sanitizedId = sanitize(productId)
    const sanitizedUpdateData = {
      name: sanitize(updateData.name?.trim()),
      reference: sanitize(updateData.reference?.trim()),
      description: sanitize(updateData.description?.trim()),
      price: sanitize(updateData.price),
      category_id: sanitize(updateData.category_id),
      supplier_id: sanitize(updateData.supplier_id),
    }

    if (
      sanitizedUpdateData.price &&
      !validator.isNumeric(String(sanitizedUpdateData.price))
    ) {
      throw new Error("Le prix doit être un nombre valide.")
    }

    const updatedProduct = await ProductDAO.updateProduct(
      sanitizedId,
      sanitizedUpdateData
    )
    if (!updatedProduct) {
      throw new Error(
        `Échec de la mise à jour. Produit introuvable avec l'ID: ${sanitizedId}`
      )
    }
    return updatedProduct
  }

  async deleteProduct(productId) {
    const sanitizedId = sanitize(productId)

    const commandesEnCours = await orderDAO.findOrdersByStatusAndProductId(
      "en cours",
      sanitizedId
    )

    if (commandesEnCours.length > 0) {
      throw new Error(
        "Impossible de supprimer ce/ces produit(s) : il est/sont encore utilisé(s) dans des commandes en cours."
      )
    }

    const stockToDelete = await StockDAO.findByProductId(sanitizedId)
    if (!stockToDelete) {
      throw new Error("Aucun stock trouvé pour ce produit.")
    }

    await StockLogDAO.create({
      stock_id: stockToDelete._id,
      quantity: 0,
      event: "suppression",
    })

    await StockDAO.deleteByProductId(sanitizedId)
    const deletedProduct = await ProductDAO.deleteProduct(sanitizedId)

    if (!deletedProduct) {
      throw new Error(
        `Échec de la suppression. Produit introuvable avec l'ID: ${sanitizedId}`
      )
    }

    return { message: "Produit supprimé avec succès", deletedProduct }
  }
}

export default new ProductService()
