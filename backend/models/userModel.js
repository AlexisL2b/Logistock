import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mot_de_passe: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["gestionnaire", "acheteur", "logisticien"],
      required: true,
    },
    point_vente_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesPoint",
    },
  },
  { timestamps: true }
)

const User = mongoose.model("User", userSchema)

export default User
