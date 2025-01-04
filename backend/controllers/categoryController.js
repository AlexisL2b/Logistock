import Category from "../models/categoryModel.js"

// Récupérer toutes les catégories
export const getAllCategories = async (req, res) => {
  try {
    console.log("Requête reçue pour récupérer les catégories")
    const categories = await Category.find()
    res.json(categories)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des catégories",
      error,
    })
  }
}

// Récupérer une catégorie par ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category)
      return res.status(404).json({ message: "Catégorie introuvable" })
    res.json(category)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la catégorie",
      error,
    })
  }
}

// Ajouter une nouvelle catégorie
export const addCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body)
    const savedCategory = await newCategory.save()
    res.status(201).json(savedCategory)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout de la catégorie",
      error,
    })
  }
}

// Mettre à jour une catégorie par ID
export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Renvoie l'objet mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )
    if (!updatedCategory)
      return res.status(404).json({ message: "Catégorie introuvable" })
    res.json(updatedCategory)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la catégorie",
      error,
    })
  }
}

// Supprimer une catégorie par ID
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id)
    if (!deletedCategory)
      return res.status(404).json({ message: "Catégorie introuvable" })
    res.json({ message: "Catégorie supprimée avec succès" })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la catégorie",
      error,
    })
  }
}
