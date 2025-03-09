import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    reference: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
  },
  { collection: "products" },
  { versionKey: false }
)

const Product = mongoose.model("Product", productSchema)
export default Product
