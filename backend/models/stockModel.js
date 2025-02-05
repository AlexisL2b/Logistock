import mongoose from "mongoose"

const stockSchema = new mongoose.Schema({
  produit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true, // Un stock par produit
  },
  sales_point_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesPoint",
    required: true,
  },
  quantite_disponible: { type: Number, required: true, default: 0 },
})

// Middleware pour calculer automatiquement le statut

const Stock = mongoose.model("Stock", stockSchema)
export default Stock
