import mongoose from "mongoose"

const orderDetailsSchema = new mongoose.Schema(
  {
    commande_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    produit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantite: {
      type: Number,
      required: true,
    },
    prix_unitaire: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
  { collection: "orders_details" }
)

const OrderDetails = mongoose.model("orders_details", orderDetailsSchema)

export default OrderDetails
