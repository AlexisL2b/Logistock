import mongoose from "mongoose"

const connectDB = async () => {
  try {
    // Vérifie si la connexion est déjà établie pour éviter les reconnections inutiles
    if (mongoose.connection.readyState === 1) {
      console.log("✅ MongoDB est déjà connecté !")
      return mongoose.connection
    }

    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`✅ MongoDB Connecté: ${conn.connection.host}`)
    return conn.connection
  } catch (error) {
    console.error(`❌ Erreur MongoDB : ${error.message}`)
    process.exit(1) // Arrête le processus si la connexion échoue
  }
}

// Gérer la déconnexion proprement en cas d'arrêt du serveur
process.on("SIGINT", async () => {
  await mongoose.connection.close()
  console.log("🔌 Connexion MongoDB fermée proprement.")
  process.exit(0)
})

export default connectDB
