import mongoose from "mongoose"

const transporterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { versionKey: false }
)

const Transporter = mongoose.model("Transporters", transporterSchema)

export default Transporter
