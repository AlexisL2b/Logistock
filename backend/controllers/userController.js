import User from "../models/userModel.js"
import SalesPoint from "../models/salesPointModel.js" // Importez correctement le modèle SalesPoint
import bcrypt from "bcrypt"
import mongoose from "mongoose"
import { getAuth } from "firebase-admin/auth" // Firebase Admin SDK
import admin from "../config/firebase.js"

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
    console.log("req.params", req.params)
    const firebaseUid = req.params.uid // Récupération de l'UID depuis les paramètres

    if (!firebaseUid) {
      //("Valeur de req.params.id :", req.params.id)
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
    //("ObjectId de l'utilisateur :", objectId)

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
      //("Valeur de req.params.id :", req.params.id)
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
    //("ObjectId de l'utilisateur :", objectId)

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
  //("Bonour")
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
// export const updateUser = async (req, res) => {
//   try {
//     const { mot_de_passe, ...rest } = req.body
//     const updatedData = { ...rest }

//     if (mot_de_passe) {
//       updatedData.mot_de_passe = await bcrypt.hash(mot_de_passe, 10) // Hachage du nouveau mot de passe
//     }
//     console.log(req.body)
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       updatedData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     )

//     if (!updatedUser)
//       return res.status(404).json({ message: "Utilisateur introuvable" })

//     res.json(updatedUser)
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour de l'utilisateur :", error)
//     res.status(500).json({
//       message: "Erreur lors de la mise à jour de l'utilisateur",
//       error,
//     })
//   }

export const updateUser = async (req, res) => {
  try {
    const { mot_de_passe, email, ...rest } = req.body
    const updatedData = { ...rest }

    if (mot_de_passe) {
      updatedData.mot_de_passe = await bcrypt.hash(mot_de_passe, 10) // Hachage du nouveau mot de passe
    }

    console.log("Données reçues :", req.body)

    const userId = req.params.id

    // Vérifier si l'utilisateur existe en base MongoDB
    const existingUser = await User.findById(userId)
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" })
    }

    // ⚠️ Si l'email change, mise à jour d'abord dans Firebase
    if (email && email !== existingUser.email) {
      try {
        const auth = getAuth()
        await auth.updateUser(existingUser.firebaseUid.toString(), { email }) // Mise à jour Firebase
        updatedData.email = email // Mise à jour MongoDB après succès Firebase
      } catch (firebaseError) {
        console.error("Erreur Firebase :", firebaseError)
        return res.status(400).json({
          message: "Impossible de modifier l'email sur Firebase",
          error: firebaseError.message,
          error_code: firebaseError.code,
        })
      }
    }

    // Mise à jour de l'utilisateur en base de données MongoDB
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    })

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable après mise à jour" })
    }

    res.json(updatedUser)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error)
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error,
    })
  }
}
// Récupérer un utilisateur par email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params // Récupérer l'email depuis l'URL

    if (!email) {
      return res.status(400).json({ message: "Email manquant ou invalide" })
    }

    // Recherche de l'utilisateur dans MongoDB par email
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(200)
        .json({ message: `Utilisateur avec l'email ${email} introuvable` })
    }

    res.json(user)
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'utilisateur par email :",
      error
    )
    res.status(500).json({
      message: "Erreur lors de la récupération de l'utilisateur",
      error,
    })
  }
}

// Supprimer un utilisateur par ID
// export const deleteUser = async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id)
//     const deletedUserByUid = await User.find(req.params.id)

//     if (!deletedUser)
//       return res.status(404).json({ message: "Utilisateur introuvable" })

//     res.json({ message: "Utilisateur supprimé avec succès" })
//   } catch (error) {
//     console.error("Erreur lors de la suppression de l'utilisateur :", error)
//     res.status(500).json({
//       message: "Erreur lors de la suppression de l'utilisateur",
//       error,
//     })
//   }
// }
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id // Récupération de l'ID MongoDB

    // Vérifier si l'utilisateur existe en base MongoDB
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" })
    }

    const firebaseUid = user.firebaseUid // Récupérer l'UID Firebase

    // 🔥 Suppression de l'utilisateur dans Firebase Auth
    try {
      await admin.auth().deleteUser(firebaseUid)
      console.log(
        `✅ Utilisateur Firebase ${firebaseUid} supprimé avec succès.`
      )
    } catch (firebaseError) {
      console.error(
        "❌ Erreur lors de la suppression de Firebase :",
        firebaseError.message
      )
      return res.status(500).json({
        message: "Erreur lors de la suppression dans Firebase",
        error: firebaseError.message,
      })
    }

    // 🗑 Suppression de l'utilisateur en base de données MongoDB
    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable en base MongoDB" })
    }

    res.json({
      message: "Utilisateur supprimé avec succès dans Firebase et MongoDB",
    })
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'utilisateur :", error)
    res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message,
    })
  }
}
