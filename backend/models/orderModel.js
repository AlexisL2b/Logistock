import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    date_commande: {
      type: Date,
      default: Date.now,
    },
    statut: {
      type: String,
      enum: ["en cours", "validée", "expédiée", "annulée"],
      default: "en cours",
    },
    acheteur_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

const Order = mongoose.model("Orders", orderSchema)

export default Order
