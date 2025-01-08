import mongoose from "mongoose"

const roleSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
  },
  { collection: "roles" }
)

const Role = mongoose.model("roles", roleSchema)

export default Role
