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
  },
  { collection: "order_shipments" }
)

const OrderShipment = mongoose.model("order_shipments", orderShipmentSchema)

export default OrderShipment
