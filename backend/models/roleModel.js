import mongoose from "mongoose"

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["admin", "gestionnaire", "acheteur", "logisticien"], // Rôles possibles
    },
  },
  { collection: "roles", versionKey: false }
)

const Role = mongoose.model("Role", roleSchema)

export default Role
