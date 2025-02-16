import mongoose from "mongoose"

const stockLogSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stock_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    event: {
      type: String,
      enum: ["entrée", "sortie", "création", "suppression"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    date_event: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "stock_log", versionKey: false }
)

const StockLog = mongoose.model("stock_log", stockLogSchema)

export default StockLog
