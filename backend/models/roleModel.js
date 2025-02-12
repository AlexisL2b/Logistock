import mongoose from "mongoose"

const roleSchema = new mongoose.Schema(
  {
    name: {
      // ✅ Correction ici ("name" au lieu de "nom")
      type: String,
      required: true,
      unique: true,
      enum: ["admin", "gestionnaire", "acheteur", "logisticien"], // Rôles possibles
    },
  },
  { collection: "roles", versionKey: false }
)

// ✅ Enregistrer le modèle sous "Role" (au lieu de "roles")
const Role = mongoose.model("Role", roleSchema)

export default Role
