import mongoose from "mongoose"
import User from "../models/userModel.js"

class UserDAO {
  async findAll() {
    return await User.find().populate("point_vente_id", "nom adresse")
  }

  async findById(id) {
    return await User.findById(id).populate("point_vente_id", "nom adresse")
  }

  async findByFirebaseUid(firebaseUid) {
    return await User.findOne({ firebaseUid }).populate(
      "point_vente_id",
      "nom adresse"
    )
  }
  async findBySalesPointId(point_vente_id) {
    if (!mongoose.Types.ObjectId.isValid(point_vente_id)) {
      throw new Error("ID de point de vente invalide.") // ✅ Vérification de l'ID
    }

    const users = await User.find({ point_vente_id }) // ✅ Recherche avec la clé correcte
    console.log("Utilisateurs liés au point de vente :", users)

    return users
  }
  async findByEmail(email) {
    return await User.findOne({ email })
  }

  async create(userData) {
    const newUser = new User(userData)
    return await newUser.save()
  }

  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return await User.findByIdAndDelete(id)
  }
}

export default new UserDAO()
