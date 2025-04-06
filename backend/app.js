// Import des routes
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import supplierRoutes from "./routes/supplierRoutes.js"
import salesPointRoutes from "./routes/salesPointRoutes.js"
import stockLogRoutes from "./routes/stockLogRoutes.js"
import transporterRoutes from "./routes/transporterRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import supplierOrderRoutes from "./routes/supplierOrderRoutes.js"
import orderShipmentRoutes from "./routes/orderShipmentRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import stockRoutes from "./routes/stockRoutes.js"
import roleRoutes from "./routes/roleRoutes.js"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import csrf from "csurf"

// Charger les variables d'environnement
// ... imports

dotenv.config()
connectDB()

export const app = express()

// 🛡️ Helmet – Sécurité des en-têtes
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
)

// 🌐 CORS – à placer AVANT les routes
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    credentials: true,
  })
)

// 🔍 Middlewares JSON & Form
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 🍪 Cookies & CSRF
app.use(cookieParser())
app.use(csrf({ cookie: true }))

// ✅ DEBUG CSRF – vérifie que tout est OK
// app.use((req, res, next) => {
//   try {
//     const csrfToken = req.csrfToken()
//     console.log("🛡️ CSRF token généré :", csrfToken)
//   } catch (e) {
//     console.warn("⚠️ CSRF token non généré :", e.message)
//   }
//   next()
// })

// 🌐 WebSocket config
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:8080"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
})
app.set("io", io)
io.on("connection", (socket) => {
  console.log(`🟢 Un client connecté : ${socket.id}`)

  socket.on("disconnect", () => {
    console.log(`🔴 Client déconnecté : ${socket.id}`)
  })

  socket.on("stocksUpdated", (data) => {
    io.emit("stocksUpdated", data)
  })
})
app.use((req, res, next) => {
  req.io = io
  next()
})

// 🚀 ROUTES
app.get("/api/csrf_token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
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
app.use("/api/suppliers_orders", supplierOrderRoutes)
app.use("/api/order_shipments", orderShipmentRoutes)
app.use("/api/stocks", stockRoutes)
app.use("/api/roles", roleRoutes)

// 🔎 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" })
})

// ❌ GESTION ERREURS
app.use((err, req, res, next) => {
  console.error("❌ Erreur app.js :", err.stack)
  res.status(500).json({
    message: "Une erreur interne est survenue",
    error: err.message,
  })
})

// 🚀 START SERVER
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
})
