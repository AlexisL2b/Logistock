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
import stockRoutes from "./routes/stockRoutes.js"
import roleRoutes from "./routes/roleRoutes.js"
import admin from "./config/firebase.js"

import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"

// Charger les variables d’environnement
dotenv.config()
console.log(
  "🔍 FIREBASE_PRIVATE_KEY:",
  process.env.FIREBASE_PRIVATE_KEY ? "Définie" : "NON définie"
)

connectDB()
const app = express()
// Pour lire les JSON
app.use(cookieParser())
// ✅ Configuration CORS unique (placée AVANT les routes)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)
const server = createServer(app)

// ✅ Correction des requêtes OPTIONS (preflight)
app.options("*", cors())
app.use(express.json()) // ✅ Middleware pour parser les JSON
app.use(express.urlencoded({ extended: true })) // ✅ Gère les requêtes URL encodées
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
})
app.set("io", io)
io.on("connection", (socket) => {
  console.log(`🟢 Un client s'est connecté : ${socket.id}`)

  socket.on("disconnect", () => {
    console.log(`🔴 Utilisateur déconnecté : ${socket.id}`)
  })

  socket.on("stock:update", (data) => {
    console.log("🔄 Mise à jour du stock :", data)
    io.emit("stock:update", data) // Envoie à tous les clients connectés
  })
})
app.use((req, res, next) => {
  req.io = io
  next()
})

// Middleware global pour la gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack)
  res
    .status(500)
    .json({ message: "Une erreur interne est survenue", error: err.message })
})
// Définition des routes
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api/suppliers", supplierRoutes)
app.use("/api/sales_points", salesPointRoutes)
app.use("/api/stock_logs", stockLogRoutes)
app.use("/api/transporters", transporterRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/order_details", orderDetailsRoutes)
app.use("/api/order_shipments", orderShipmentRoutes)
app.use("/api/stocks", stockRoutes)
app.use("/api/roles", roleRoutes)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" })
})
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
})
