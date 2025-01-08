import mongoose from "mongoose"

const salesPointSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    adresse: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
  { collection: "sales_points" }
)

const SalesPoint = mongoose.model("sales_points", salesPointSchema)

export default SalesPoint
