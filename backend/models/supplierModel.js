import mongoose from "mongoose"

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  { collection: "suppliers", versionKey: false }
)

const Supplier = mongoose.model("Supplier", supplierSchema)

export default Supplier
