import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Garde une référence
  role: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    name: { type: String, required: true },
  }, // Stocke le rôle en texte pour lecture rapide
  sales_point: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesPoint",
      // required: true,
    },
    name: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  address: { type: String },
  firstname: { type: String },
  lastname: { type: String },
})
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10) // Génère un salt sécurisé
    this.password = await bcrypt.hash(this.password, salt) // Hash le mot de passe
    next()
  } catch (error) {
    next(error)
  }
})

const User = mongoose.model("User", UserSchema)

export default User
