import mongoose from "mongoose"

const orderShipmentSchema = new mongoose.Schema(
  {
    commande_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    transporteur_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transporter",
      required: true,
    },
    date_depart: {
      type: Date,
      default: Date.now,
    },
    statut: {
      type: String,
      enum: ["en préparation", "expédiée", "livrée"],
      default: "en préparation",
    },
  },
  { timestamps: true },
  { collection: "order_shipments" }
)

const OrderShipment = mongoose.model("OrderShipment", orderShipmentSchema)

export default OrderShipment
