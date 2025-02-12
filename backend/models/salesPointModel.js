import mongoose from "mongoose"

const salesPointSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { collection: "sales_points", versionKey: false }
)

const SalesPoint = mongoose.model("SalesPoint", salesPointSchema)

export default SalesPoint
