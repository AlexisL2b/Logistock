import Product from "../models/productModel.js"
import Stock from "../models/stockModel.js" // Importer le modèle Stock

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
      message: "Stock mis à jour avec succès",
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
    // Étape 1 : Créer le produit
    const newProduct = new Product(req.body)
    const savedProduct = await newProduct.save({ session })

    // Étape 2 : Créer un stock lié au produit
    const newStock = new Stock({
      produit_id: savedProduct._id,
      quantite_totale: req.body.quantite_stock || 0,
      quantite_disponible: req.body.quantite_stock || 0,
      quantite_reservee: 0,
      statut: "en_stock", // Par défaut
    })

    const savedStock = await newStock.save({ session })

    // Étape 3 : Mettre à jour le produit avec le stock_id
    savedProduct.stock_id = savedStock._id
    await savedProduct.save({ session })

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      message: "Produit et stock créés avec succès",
      data: savedProduct,
    })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    res
      .status(500)
      .json({ message: "Erreur lors de la création du produit", error })
  }
}

// Mettre à jour un produit
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Retourne le produit mis à jour et applique les validations du modèle
    )
    if (!updatedProduct) {
      return res.status(404).json({ message: "Produit non trouvé" })
    }
    res.status(200).json(updatedProduct)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du produit", error })
  }
}

// Supprimer un produit
export const deleteProduct = async (req, res) => {
  const session = await Product.startSession()
  session.startTransaction()

  try {
    // Étape 1 : Supprimer le produit
    const deletedProduct = await Product.findByIdAndDelete(req.params.id, {
      session,
    })

    if (!deletedProduct) {
      return res.status(404).json({ message: "Produit non trouvé" })
    }

    // Étape 2 : Supprimer le stock lié
    await Stock.findOneAndDelete(
      { produit_id: deletedProduct._id },
      { session }
    )

    await session.commitTransaction()
    session.endSession()

    res.status(200).json({ message: "Produit et stock supprimés avec succès" })
  } catch (error) {
    await session.abortTransaction()
    session.endSession()

    res.status(500).json({
      message: "Erreur lors de la suppression du produit",
      error,
    })
  }
}
