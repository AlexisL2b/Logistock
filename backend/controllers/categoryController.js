import categoryService from "../services/categoryService.js"

// Récupérer toutes les catégories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer une catégorie par ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id)
    res.json({ message: "Catégorie récupérée avec succès", data: category })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Ajouter une nouvelle catégorie
export const addCategory = async (req, res) => {
  try {
    const newCategory = await categoryService.addCategory(req.body)
    res
      .status(201)
      .json({ message: "Catégorie ajoutée avec succès", data: newCategory })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Mettre à jour une catégorie par ID
export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      req.body
    )
    res.json({
      message: "Catégorie mise à jour avec succès",
      data: updatedCategory,
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Supprimer une catégorie par ID
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await categoryService.deleteCategory(req.params.id)
    res.json({
      message: "Catégorie supprimée avec succès",
      data: deletedCategory,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
