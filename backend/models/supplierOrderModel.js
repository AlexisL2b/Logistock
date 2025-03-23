import mongoose from "mongoose"

const supplierOrderSchema = new mongoose.Schema({
  supplier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  statut: {
    type: String,
    enum: ["En attente de traitement", "Reçue"],
    required: true,
  },
  details: [
    {
      _id: false,
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      reference: { type: String, required: true },
      quantity: { type: Number, required: true },
      category: { type: String, required: true },
      stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
        required: true,
      },
    },
  ],
  orderedAt: { type: Date },
  receivedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const supplierOrder = mongoose.model("suppliers_orders", supplierOrderSchema)

export default supplierOrder
