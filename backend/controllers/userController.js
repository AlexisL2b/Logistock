import User from "../models/userModel.js"
import UserService from "../services/userService.js"
import mongoose from "mongoose"
/**
 * 🔹 Récupérer le profil utilisateur
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await UserService.getUserProfile(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." })
    }
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur. Impossible de récupérer l'utilisateur.",
    })
  }
}

/**
 * 🔹 Récupérer tous les utilisateurs
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur. Impossible de récupérer les utilisateurs.",
    })
  }
}

/**
 * 🔹 Récupérer tous les acheteurs
 */
export const getBuyers = async (req, res) => {
  try {
    const buyers = await UserService.getBuyers()
    res.status(200).json({ buyers })
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur. Impossible de récupérer les acheteurs.",
    })
  }
}

export const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body)
    res.status(201).json({ message: "Utilisateur créé avec succès", user })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * 🔹 Mettre à jour un utilisateur
 */
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body)
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable." })
    }
    res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user: updatedUser,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

/**
 * 🔹 Supprimer un utilisateur
 */
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await UserService.deleteUser(req.params.id)

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable." })
    }

    res.status(200).json({ message: "Utilisateur supprimé avec succès" })
  } catch (error) {
    console.error(
      "❌ Erreur lors de la suppression de l'utilisateur :",
      error.message
    )
    res.status(500).json({
      message: "Erreur serveur. Impossible de supprimer l'utilisateur.",
    })
  }
}
