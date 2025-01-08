import mongoose from "mongoose"

const stockLogSchema = new mongoose.Schema(
  {
    produit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    evenement: {
      type: String,
      enum: ["entree", "sortie", "ajustement"],
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
  { timestamps: true },
  { collection: "stock_log" }
)

const StockLog = mongoose.model("stock_log", stockLogSchema)

export default StockLog
