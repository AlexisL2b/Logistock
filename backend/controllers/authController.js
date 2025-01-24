import admin from "../config/firebase.js" // Firebase Admin SDK
import User from "../models/userModel.js" // Modèle MongoDB pour les utilisateurs

export const createUser = async (req, res) => {
  try {
    // Étape 1 : Extraire les données du corps de la requête
    const { email, password, prenom, nom, adresse, salesPoint, role_id } =
      req.body

    // Étape 2 : Créer l'utilisateur dans Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    })

    console.log("Utilisateur créé dans Firebase :", userRecord.password)

    // Étape 3 : Enregistrer l'utilisateur dans MongoDB
    const newUser = new User({
      firebaseUid: userRecord.uid, // UID de Firebase
      email: userRecord.email,
      role_id: "677cf977b39853e4a17727e3", // Rôle par défaut
      prenom,
      nom,
      adresse,
      point_vente_id: salesPoint || "", // Valeur par défaut : adresse
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
    // Étape 1 : Authentifier l'utilisateur via Firebase Authentication
    const user = await admin.auth().getUserByEmail(email)

    // Vérification de l'email trouvé
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." })
    }

    // Étape 2 : Récupérer les données supplémentaires depuis MongoDB
    const dbUser = await User.findOne({ email: email })

    if (!dbUser) {
      return res.status(404).json({
        message: "Utilisateur introuvable dans MongoDB depuis AuthController.",
      })
    }

    // Étape 3 : Générer un token Firebase (ID Token)
    const customToken = await admin.auth().createCustomToken(user.uid)

    // Étape 4 : Réponse avec le token et les informations utilisateur
    res.status(200).json({
      message: "Connexion réussie",
      token: customToken,
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
    console.error("Erreur lors de la connexion :", error.message)
    res.status(500).json({
      message: "Erreur lors de la connexion",
      error: error.message,
    })
  }
}
