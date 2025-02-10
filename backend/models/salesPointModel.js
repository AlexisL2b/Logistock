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
  { collection: "sales_points", versionKey: false }
)

const SalesPoint = mongoose.model("SalesPoint", salesPointSchema)

export default SalesPoint
