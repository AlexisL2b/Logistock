import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    date_commande: {
      type: Date,
      default: Date.now,
    },
    statut: {
      type: String,
      enum: ["en cours", "validée", "expédiée", "annulée", "réceptionné"],
      default: "en cours",
    },
    acheteur_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripePayment: {
      paymentIntentId: { type: String, default: null }, // 🔥 Stocker l’ID Stripe
      status: {
        type: String,
        enum: ["pending", "succeeded", "failed"],
        default: "pending",
      }, // 🔥 Suivi du paiement
    },
    totalAmount: {
      // 🔥 Ajoute ce champ
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
  { versionKey: false }
)

const Order = mongoose.model("Orders", orderSchema)

export default Order
