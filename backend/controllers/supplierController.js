import mongoose from "mongoose"
import Product from "../models/productModel.js"
import Supplier from "../models/supplierModel.js"

export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
    res.json(suppliers)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des fournisseurs",
      error,
    })
  }
}

export const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
    if (!supplier)
      return res.status(404).json({ message: "Fournisseur introuvable" })
    res.json(supplier)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du fournisseur", error })
  }
}

export const addSupplier = async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body)
    const savedSupplier = await newSupplier.save()
    res.status(201).json(savedSupplier)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du fournisseur", error })
  }
}

export const updateSupplier = async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    if (!updatedSupplier)
      return res.status(404).json({ message: "Fournisseur introuvable" })
    res.json(updatedSupplier)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du fournisseur", error })
  }
}

export const deleteSupplier = async (req, res) => {
  try {
    // Convertir l'ID en ObjectId
    const supplierId = new mongoose.Types.ObjectId(req.params.id)

    // Vérifier si des produits sont associés au fournisseur
    const associatedProducts = await Product.find({
      fournisseur_id: supplierId,
    })
    //("associatedProducts:", associatedProducts)
    //("supplierId:", supplierId)

    if (associatedProducts.length > 0) {
      // Créer une liste des noms des produits associés
      const noms = associatedProducts.map((product) => product.nom).join(",")
      return res.status(400).json({
        message: `Impossible de supprimer le fournisseur, il est associé aux produits suivants : ${noms}`,
      })
    }

    // Supprimer le fournisseur
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id)
    if (!deletedSupplier) {
      return res.status(404).json({ message: "Fournisseur introuvable" })
    }

    res.json({ message: "Fournisseur supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du fournisseur :", error)
    res.status(500).json({
      message: "Erreur lors de la suppression du fournisseur",
      error,
    })
  }
}
