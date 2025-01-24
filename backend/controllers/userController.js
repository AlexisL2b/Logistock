import User from "../models/userModel.js"
import SalesPoint from "../models/salesPointModel.js" // Importez correctement le modèle SalesPoint
import bcrypt from "bcrypt"
import mongoose from "mongoose"

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    // Utilisez populate pour inclure les données des points de vente
    const users = await User.find().populate("point_vente_id", "nom adresse")
    res.json(users)
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error)
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs",
      error,
    })
  }
}

// Récupérer le profil utilisateur par UID Firebase
export const getUserByUid = async (req, res) => {
  try {
    const firebaseUid = req.params.id // Récupération de l'UID depuis les paramètres

    if (!firebaseUid) {
      console.log("Valeur de req.params.id :", req.params.id)
      return res.status(400).json({ message: "UID manquant ou invalide" })
    }

    // Recherche de l'utilisateur dans MongoDB par UID Firebase
    const user = await User.findOne({ firebaseUid }).populate(
      "point_vente_id",
      "nom adresse"
    )

    if (!user) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable avec cet UID" })
    }

    const objectId = user._id // Récupération de l'ObjectId
    console.log("ObjectId de l'utilisateur :", objectId)

    res.json({
      message: "Utilisateur récupéré avec succès",
      user: {
        ...user.toObject(), // Conversion du document Mongoose en objet JS
        objectId,
      },
    })
  } catch (error) {
    console.error("Erreur attrapée :", error)
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      error,
    })
  }
}

// Récupérer un utilisateur par ObjectId
export const getUserById = async (req, res) => {
  try {
    const firebaseUid = req.params.id // Récupération de l'UID Firebase

    if (!firebaseUid) {
      console.log("Valeur de req.params.id :", req.params.id)
      return res.status(400).json({ message: "UID manquant ou invalide" })
    }

    // Recherche de l'utilisateur dans MongoDB par UID Firebase
    const user = await User.findOne({ firebaseUid }).populate(
      "point_vente_id",
      "nom adresse"
    )

    if (!user) {
      return res.status(404).json({
        message: `Utilisateur introuvable avec cet UID : ${firebaseUid}`,
      })
    }

    const objectId = user._id // Récupération de l'ObjectId
    console.log("ObjectId de l'utilisateur :", objectId)

    res.json({
      ...user.toObject(), // Conversion du document Mongoose en objet JS
      objectId,
    })
  } catch (error) {
    console.error("Erreur attrapée :", error)
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      error,
    })
  }
}

export const getUserProfile = async (req, res) => {
  console.log("Bonour")
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
    console.error("Erreur lors de l'ajout de l'utilisateur :", error)
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
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error)
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
    console.error("Erreur lors de la suppression de l'utilisateur :", error)
    res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
      error,
    })
  }
}
