import mongoose from "mongoose"

const supplierSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    contact: { type: String },
    telephone: { type: String },
    email: { type: String },
  },
  { collection: "suppliers", versionKey: false }
)

const Supplier = mongoose.model("Supplier", supplierSchema)

export default Supplier
