import mongoose from "mongoose"
import Product from "../models/productModel.js"
import Stock from "../models/stockModel.js" // Importer le modèle Stock
import OrderDetails from "../models/orderDetailsModel.js" // Importer le modèle Stock
import Order from "../models/orderModel.js"

// Récupérer tous les produits avec le stock lié
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categorie_id", "nom") // Remplace categorie_id par son nom
      .populate("supplier_id", "nom") // Remplace supplier_id par son nom
      .lean()

    // Récupérer tous les stocks en une seule fois
    const stocks = await Stock.find({}).lean()
    const stockMap = new Map(
      stocks.map((stock) => [
        stock.produit_id.toString(),
        stock.quantite_disponible || 0,
      ])
    )

    // Ajouter `quantite_disponible` pour chaque produit
    for (let product of products) {
      product.quantite_disponible = stockMap.get(product._id.toString()) || 0
    }

    res.json(products)
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des produits :",
      error.message,
      error.stack
    )
    res.status(500).json({
      message: "Erreur lors de la récupération des produits",
      error: error.message,
    })
  }
}

// Récupérer un produit par ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categorie_id", "nom")
      .populate("supplier_id", "nom")
      .populate("stock_id") // Inclure les informations du stock
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" })
    }
    res.status(200).json(product)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du produit", error })
  }
}
export const updateProductStock = async (req, res) => {
  try {
    const { quantite_disponible, quantite_reservee } = req.body

    // Trouver le produit et le stock associé
    const product = await Product.findById(req.params.id).populate("stock_id")
    if (!product || !product.stock_id) {
      return res.status(404).json({ message: "Produit ou stock introuvable" })
    }

    // Mettre à jour les quantités dans le stock
    const updatedStock = await Stock.findByIdAndUpdate(
      product.stock_id._id,
      { quantite_disponible, quantite_reservee },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      message: "Stock mis à jour avec succès from productController",
      data: updatedStock,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du stock :", error)
    res.status(500).json({
      message: "Erreur lors de la mise à jour du stock",
      error: error.message || error,
    })
  }
}

// Ajouter un produit

export const addProduct = async (req, res) => {
  const session = await Product.startSession()
  session.startTransaction()

  try {
    console.log("🔵 Début de transaction pour la création du produit")

    const { reference, quantite_disponible } = req.body
    console.log("ref🔵", reference)

    // Vérifier si un produit avec la même référence existe déjà
    const existingProduct = await Product.findOne({
      reference: reference,
    }).session(session)
    console.log("existingProduct", existingProduct)

    if (existingProduct) {
      console.log("🔄 Produit déjà existant, mise à jour du stock")

      if (!existingProduct.stock_id) {
        throw new Error(
          "❌ ERREUR: Le produit existant n'a pas de stock associé !"
        )
      }

      // Vérifie que l'ID existe bien en base avant de mettre à jour
      const stockExistsTest = await Stock.findById("6787ce455bdbd4e58759130a")
      console.log(
        "existingProduct.stock_id🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵",
        existingProduct.stock_id
      )

      const stockExists = await Stock.findById(existingProduct.stock_id)
      if (!stockExists) {
        throw new Error("❌ ERREUR: Stock introuvable en base !")
      }

      console.log("🔹 Stock trouvé avant mise à jour:", stockExists)

      // Mise à jour de la quantité
      const updatedStock = await Stock.findByIdAndUpdate(
        existingProduct.stock_id,
        { $inc: { quantite_disponible: Number(quantite_disponible) || 0 } },
        { session, new: true }
      )

      console.log("✅ Stock mis à jour :", updatedStock)

      if (!updatedStock) {
        throw new Error(
          "❌ ERREUR: Impossible de mettre à jour le stock existant !"
        )
      }

      await session.commitTransaction()
      session.endSession()

      return res.status(200).json({
        message: "Quantité mise à jour pour le produit existant",
        data: existingProduct,
      })
    }

    console.log("🆕 Création d'un nouveau produit et d'un nouveau stock")

    // Étape 1 : Créer un nouveau produit SANS stock_id
    const newProduct = new Product({
      ...req.body,
      stock_id: undefined, // S'assurer que stock_id est vide
    })
    const savedProduct = await newProduct.save({ session })
    console.log("✅ Produit créé :", savedProduct)

    if (!savedProduct._id) {
      throw new Error("❌ ERREUR: L'ID du produit est indéfini !")
    }

    // Étape 2 : Créer un stock lié au produit
    const quantiteStock = Number(quantite_disponible) || 0
    const newStock = new Stock({
      produit_id: savedProduct._id,
      quantite_disponible: quantiteStock,
      statut: "en_stock",
    })

    const savedStock = await newStock.save({ session })
    console.log("✅ Stock créé :", savedStock)

    if (!savedStock._id) {
      throw new Error("❌ ERREUR: L'ID du stock est indéfini !")
    }

    // Étape 3 : Mettre à jour le produit avec le stock_id
    const updatedProduct = await Product.findByIdAndUpdate(
      savedProduct._id,
      { $set: { stock_id: savedStock._id } },
      { session, new: true }
    )

    console.log("✅ Produit mis à jour avec stock_id :", updatedProduct)

    if (!updatedProduct.stock_id) {
      throw new Error(
        "❌ ERREUR: `stock_id` n'a pas été mis à jour dans le produit !"
      )
    }

    // Commit de la transaction
    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      message: "Produit et stock créés avec succès",
      data: updatedProduct,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    console.error("❌ Erreur lors de la création du produit :", error)

    res.status(500).json({
      message: "Erreur lors de la création du produit",
      error: error.message || error,
    })
  }
}

// Mettre à jour un produit
export const updateProduct = async (req, res) => {
  try {
    const { reference } = req.body
    const productId = req.params.id

    // Vérifier si un autre produit a déjà cette référence
    if (reference) {
      const existingProduct = await Product.findOne({
        reference,
        _id: { $ne: productId },
      })

      if (existingProduct) {
        return res.status(400).json({
          message: `Un autre produit (${existingProduct.nom}) possède déjà la référence "${reference}". Modification annulée.`,
        })
      }
    }

    // Mise à jour du produit
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return res.status(404).json({ message: "Produit non trouvé" })
    }

    res.status(200).json({
      message: "Produit mis à jour avec succès",
      data: updatedProduct,
    })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du produit",
      error: error.message || error,
    })
  }
}

// Supprimer un produit

export const deleteProduct = async (req, res) => {
  const session = await Product.startSession()
  session.startTransaction()

  try {
    const productId = req.params.id

    // 🔎 Étape 1 : Vérifier si le produit est utilisé dans des commandes non expédiées ou annulées
    const orderDetails = await OrderDetails.find({ produit_id: productId })
    const orderIds = orderDetails.map((detail) => detail.commande_id) // Liste des IDs de commandes associées

    const pendingOrders = await Order.find({
      _id: { $in: orderIds },
      statut: { $nin: ["expédiée", "annulée"] }, // Exclure les commandes expédiées ou annulées
    })

    if (pendingOrders.length > 0) {
      const pendingOrderIds = pendingOrders.map((order) => order._id)
      return res.status(400).json({
        message: `Impossible de supprimer le produit. Il est utilisé dans les commandes en cours.`,
        commandes: pendingOrderIds,
      })
    }

    // 🗑️ Étape 2 : Supprimer le produit
    const deletedProduct = await Product.findByIdAndDelete(productId, {
      session,
    })

    if (!deletedProduct) {
      return res.status(404).json({ message: "Produit non trouvé" })
    }

    // 🗑️ Étape 3 : Supprimer le stock lié au produit
    await Stock.findOneAndDelete({ produit_id: productId }, { session })

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({ message: "Produit et stock supprimés avec succès" })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    console.error("❌ Erreur lors de la suppression du produit :", error)

    res.status(500).json({
      message: "Erreur lors de la suppression du produit",
      error: error.message || error,
    })
  }
}
