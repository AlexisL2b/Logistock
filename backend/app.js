import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import connectDB from "./config/db.js"

// Import des routes
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import supplierRoutes from "./routes/supplierRoutes.js"
import salesPointRoutes from "./routes/salesPointRoutes.js"
import stockLogRoutes from "./routes/stockLogRoutes.js"
import transporterRoutes from "./routes/transporterRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import orderDetailsRoutes from "./routes/orderDetailsRoutes.js"
import orderShipmentRoutes from "./routes/orderShipmentRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import admin from "./config/firebase.js"

// Configuration de l'application
dotenv.config()
connectDB()

// try {
//   const user = await admin.auth().createUser({
//     email: "test@example.com",
//     password: "securepassword",
//   })
//   console.log("Utilisateur créé avec succès :", user)
// } catch (error) {
//   console.error("Erreur lors de la création de l'utilisateur :", error.message)
// }
const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Définition des routes
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api/suppliers", supplierRoutes)
console.log("Fichier salesPointRoutes chargé")

app.use("/api/sales_points", salesPointRoutes)

app.use("/api/stock_logs", stockLogRoutes)
app.use("/api/transporters", transporterRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/order_details", orderDetailsRoutes)
app.use("/api/order_shipments", orderShipmentRoutes)

// Gestion des routes non trouvées
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" })
})

// Middleware global pour la gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack)
  res
    .status(500)
    .json({ message: "Une erreur interne est survenue", error: err.message })
})

// Lancement du serveur
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
})
