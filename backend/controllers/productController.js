import Product from "../models/productModel.js"

// Récupérer tous les produits
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categorie_id", "nom") // Remplace categorie_id par le champ `nom` de la catégorie
      .populate("supplier_id", "nom") // Remplace fournisseur_id par le champ `nom` du fournisseur

    res.json(products)
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error)
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des produits" })
  }
}
// Récupérer un produit par ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id) // Recherche par ID
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

// Ajouter un produit
export const addProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body) // Crée un nouveau produit avec les données envoyées
    res.status(201).json(newProduct) // Retourne le produit créé
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du produit", error })
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
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) {
      return res.status(404).json({ message: "Produit non trouvé" })
    }
    res.status(200).json({ message: "Produit supprimé avec succès" })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du produit", error })
  }
}
