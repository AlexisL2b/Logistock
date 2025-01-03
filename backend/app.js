import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import productRoutes from "./routes/productRoutes.js"

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use("/api/products", productRoutes)

// Lancer le serveur
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
