import mongoose from "mongoose"

const stockSchema = new mongoose.Schema({
  produit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    unique: true, // Un stock par produit
  },
  quantite_disponible: { type: Number, required: true, default: 0 },
})

// Middleware pour calculer automatiquement le statut
stockSchema.pre("save", function (next) {
  this.statut =
    this.quantite_totale > this.quantite_reserve ? "en_stock" : "hors_stock"
  next()
})

const Stock = mongoose.model("Stock", stockSchema)
export default Stock
