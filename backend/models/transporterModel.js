import mongoose from "mongoose"

const transporterSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
)

const Transporter = mongoose.model("Transporters", transporterSchema)

export default Transporter
