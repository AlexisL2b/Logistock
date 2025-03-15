import dotenv from "dotenv"
import mongoose from "mongoose"
import User from "../models/userModel.js" // Assure-toi que le chemin est correct
import connectDB from "../config/db.js"

dotenv.config({ path: "../.env" })

const testConnection = async () => {
  try {
    await connectDB() // Connexion à MongoDB

    // Vérifier si la connexion est bien active
    if (mongoose.connection.readyState !== 1) {
      throw new Error("❌ MongoDB n'est pas connecté !")
    }

    // Test : Création d'un utilisateur temporaire
    const testUser = new User({
      nom: "Dupont",
      prenom: "Jean",
      adresse: "123 Rue de Paris",
      email: "jean.dupont@example.com",
      password: "SecurePass123",
      role_id: new mongoose.Types.ObjectId(), // Simule un rôle pour le test
    })

    await testUser.save()

    // Fermer la connexion proprement après le test
    await mongoose.connection.close()
  } catch (error) {
    console.error("❌ Erreur :", error)
  }
}

testConnection()
