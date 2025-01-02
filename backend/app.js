import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import itemRoutes from "./routes/itemRoutes.js"

// Créer une instance de l'application Express
const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())

//Ajouter la route
app.use("/api/items", itemRoutes)

// Route de test
app.get("/", (req, res) => {
  res.send("Backend is running!")
})

// Démarrer le serveur
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
