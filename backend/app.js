import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io" // Import de Socket.IO
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
import stockRoutes from "./routes/stockRoutes.js"
import roleRoutes from "./routes/roleRoutes.js"
import admin from "./config/firebase.js"

// Configuration de l'application
dotenv.config()
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Définition des routes
app.use((req, res, next) => {
  //(`Requête entrante : ${req.method} ${req.path}`)
  next()
})
app.use((req, res, next) => {
  req.io = io // Injecte l'instance Socket.IO dans chaque requête
  next()
})
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] // Extraire le token du header
  req.token = token // Stocker dans req.token pour l’utiliser plus tard
  next()
})
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
// Gestion des routes non trouvées

// Middleware global pour la gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack)
  res
    .status(500)
    .json({ message: "Une erreur interne est survenue", error: err.message })
})

// Création du serveur HTTP pour Express
const server = createServer(app)

// Configuration de Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Autorise toutes les origines (à personnaliser selon tes besoins)
    methods: ["GET", "POST"],
  },
})

// Gestion des connexions Socket.IO
io.on("connection", (socket) => {
  //("//////////////////////////////Un utilisateur est connecté")

  // Exemple : Envoyer un message de bienvenue au client
  socket.emit("welcome", "Bienvenue sur le serveur Socket.IO")

  // Écouter un événement personnalisé
  socket.on("message", (data) => {
    //("Message reçu du client :", data)

    // Répondre au client ou notifier d'autres clients
    socket.broadcast.emit("message", data)
  })
  // socket.emit("stocksUpdated", data)
  socket.on("stocksUpdated", (data) => {
    //("Mise à jour des stocks reçue :", data)

    // Notifie tous les clients connectés des nouvelles données
    io.emit("stocksUpdated", data)
  })

  // Déconnexion
  socket.on("disconnect", () => {
    //("Un utilisateur s'est déconnecté")
  })
})

// Lancement du serveur
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  //(`Serveur en cours d'exécution sur le port ${PORT}`)
})
