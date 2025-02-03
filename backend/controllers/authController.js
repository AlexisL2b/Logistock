import axios from "axios"
import admin from "../config/firebase.js" // Firebase Admin SDK
import User from "../models/userModel.js" // Modèle MongoDB pour les utilisateurs

export const createUser = async (req, res) => {
  try {
    // Étape 1 : Extraire les données du corps de la requête
    const { email, password, prenom, nom, adresse, salesPoint, roles } =
      req.body
    console.log("req.body", req.body)
    // Étape 2 : Créer l'utilisateur dans Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    })

    //("Utilisateur créé dans Firebase :", userRecord.password)

    // Étape 3 : Enregistrer l'utilisateur dans MongoDB
    const newUser = new User({
      firebaseUid: userRecord.uid, // UID de Firebase
      email: userRecord.email,
      role_id: roles, // Rôle par défaut
      prenom,
      nom,
      adresse,
      ...(salesPoint && { point_vente_id: salesPoint }), // Ajoute seulement si salesPoint existe
    })

    const savedUser = await newUser.save()

    // Étape 4 : Répondre au client
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      data: savedUser,
    })
  } catch (error) {
    console.error(
      "Erreur lors de la création de l'utilisateur :",
      error.message
    )

    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message,
    })
  }
}
// Connexion

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Authentifier l'utilisateur avec Firebase REST API
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    )

    // Vérifier si l'utilisateur existe dans MongoDB
    const dbUser = await User.findOne({ email: email })
    if (!dbUser) {
      return res.status(404).json({
        message: "Utilisateur introuvable dans MongoDB.",
      })
    }

    // ✅ Générer un `customToken` à partir de Firebase Admin
    const customToken = await admin.auth().createCustomToken(dbUser.firebaseUid)

    // Réponse avec le `customToken` (PAS `idToken`)
    res.status(200).json({
      message: "Connexion réussie",
      customToken, // C'est ce token qu'on doit utiliser pour `signInWithCustomToken()`
      user: {
        email: dbUser.email,
        role: dbUser.role,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        address: dbUser.address,
        sale_point: dbUser.sale_point,
      },
    })
  } catch (error) {
    console.error(
      "Erreur lors de la connexion :",
      error.response?.data || error.message
    )
    res.status(401).json({
      message: "Identifiants incorrects",
      error: error.response?.data || error.message,
    })
  }
}
