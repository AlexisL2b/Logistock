import mongoose from "mongoose"

const stockSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      unique: true,
    },

    quantity: { type: Number, required: true },
  },
  { versionKey: false }
)

// Middleware pour calculer automatiquement le statut

const Stock = mongoose.model("Stock", stockSchema)
export default Stock
