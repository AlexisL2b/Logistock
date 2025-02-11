import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    // firebaseUid: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   trim: true,
    // },

    nom: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    prenom: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    adresse: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6, // Sécurité minimale
    },

    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role", // Référence à la collection Role
      required: true,
    },

    point_vente_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalesPoint",
    },
  },
  { timestamps: true, versionKey: false }
)

/**
 * 🔹 Hashage du mot de passe avant sauvegarde
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

/**
 * 🔹 Comparer un mot de passe avec celui stocké en base
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", userSchema)
export default User
