import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
  },

  nom: {
    type: String,
    required: true,
  },
  adresse: {
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

  role_id: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Role",
  },
  point_vente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesPoint",
  },
})

const User = mongoose.model("User", userSchema)

export default User
