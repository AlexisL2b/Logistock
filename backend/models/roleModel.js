import mongoose from "mongoose"

const roleSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
  },
  { collection: "roles" },
  { versionKey: false }
)

const Role = mongoose.model("roles", roleSchema)

export default Role
