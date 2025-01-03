import User from "../models/userModel.js"
import bcrypt from "bcrypt"

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("point_vente_id", "nom adresse")
    res.json(users)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs",
      error,
    })
  }
}

// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "point_vente_id",
      "nom adresse"
    )
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" })
    res.json(user)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      error,
    })
  }
}

// Ajouter un nouvel utilisateur
export const addUser = async (req, res) => {
  try {
    const { mot_de_passe, ...rest } = req.body
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10) // Hachage du mot de passe
    const newUser = new User({ ...rest, mot_de_passe: hashedPassword })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout de l'utilisateur",
      error,
    })
  }
}

// Mettre à jour un utilisateur par ID
export const updateUser = async (req, res) => {
  try {
    const { mot_de_passe, ...rest } = req.body
    const updatedData = { ...rest }

    if (mot_de_passe) {
      updatedData.mot_de_passe = await bcrypt.hash(mot_de_passe, 10) // Hachage du nouveau mot de passe
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!updatedUser)
      return res.status(404).json({ message: "Utilisateur introuvable" })
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error,
    })
  }
}

// Supprimer un utilisateur par ID
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    if (!deletedUser)
      return res.status(404).json({ message: "Utilisateur introuvable" })
    res.json({ message: "Utilisateur supprimé avec succès" })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
      error,
    })
  }
}
