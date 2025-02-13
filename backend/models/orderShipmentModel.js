import mongoose from "mongoose"

const orderShipmentSchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    transporter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transporter",
      required: true,
    },
    date_shipment: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "order_shipments", versionKey: false }
)

const OrderShipment = mongoose.model("order_shipments", orderShipmentSchema)

export default OrderShipment
