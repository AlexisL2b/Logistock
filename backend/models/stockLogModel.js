import mongoose from "mongoose"

const stockLogSchema = new mongoose.Schema(
  {
    produit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stock_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    evenement: {
      type: String,
      enum: ["entrée", "sortie", "création", "suppression"],
      required: true,
    },
    quantite: {
      type: Number,
      required: true,
    },
    date_evenement: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "stock_log" }
)

const StockLog = mongoose.model("stock_log", stockLogSchema)

export default StockLog
