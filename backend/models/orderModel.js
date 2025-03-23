import mongoose from "mongoose"

const orderSchemaPost = new mongoose.Schema({
  buyer: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
  },
  statut: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  details: [
    {
      _id: false,
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // à modifier par order_details
        required: true,
      },
      name: { type: String, required: true },
      reference: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  orderedAt: { type: Date }, // Date de création de la commande
  confirmedAt: { type: Date }, // Date de confirmation par l’admin ou auto
  receivedAt: { type: Date }, // Date de réception par le client
  canceledAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Order = mongoose.model("Order", orderSchemaPost)
export default Order
