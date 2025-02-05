import axios from "axios"
import admin from "../config/firebase.js" // Firebase Admin SDK
import User from "../models/userModel.js" // Modèle MongoDB pour les utilisateurs

class AuthService {
  // ✅ Création d'un utilisateur (Firebase + MongoDB)
  async createUser(userData) {
    const { email, password, prenom, nom, adresse, salesPoint, roles } =
      userData

    // Étape 1 : Création de l'utilisateur dans Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
    })

    // Étape 2 : Enregistrement dans MongoDB
    const newUser = new User({
      firebaseUid: userRecord.uid, // UID Firebase
      email: userRecord.email,
      role_id: roles, // Rôle par défaut
      prenom,
      nom,
      adresse,
      ...(salesPoint && { point_vente_id: salesPoint }), // Ajoute uniquement si salesPoint existe
    })

    return await newUser.save()
  }

  // ✅ Connexion de l'utilisateur (Firebase + Vérification MongoDB)
  async loginUser(email, password) {
    try {
      // Étape 1 : Authentifier avec Firebase
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )

      // Étape 2 : Vérifier l'existence de l'utilisateur dans MongoDB
      const dbUser = await User.findOne({ email })
      if (!dbUser) {
        throw new Error("Utilisateur introuvable dans MongoDB.")
      }

      // ✅ Étape 3 : Générer un `customToken` Firebase
      const customToken = await admin
        .auth()
        .createCustomToken(dbUser.firebaseUid)

      return {
        message: "Connexion réussie",
        customToken,
        user: {
          email: dbUser.email,
          role: dbUser.role_id,
          prenom: dbUser.prenom,
          nom: dbUser.nom,
          adresse: dbUser.adresse,
          point_vente_id: dbUser.point_vente_id,
        },
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.message)
      throw new Error("Identifiants incorrects")
    }
  }

  // ✅ Récupérer les infos utilisateur par `firebaseUid`
  async getUserProfile(firebaseUid) {
    const user = await User.findOne({ firebaseUid }).populate(
      "point_vente_id",
      "nom adresse"
    )

    if (!user) {
      throw new Error("Utilisateur introuvable dans MongoDB")
    }

    return user
  }
}

export default new AuthService()
