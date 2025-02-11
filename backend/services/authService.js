import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/userModel.js" // Modèle utilisateur MongoDB
import Role from "../models/roleModel.js" // Modèle des rôles

class AuthService {
  /**
   * 🔹 Génération du Token JWT
   */
  async generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )
  }

  /**
   * 🔹 Création d'un utilisateur (MongoDB)
   */
  async createUser(userData, currentUserRole) {
    try {
      const { email, password, prenom, nom, adresse, salesPoint, roles } =
        userData

      console.log("🚨🚨🚨 currentUserRole :", currentUserRole)
      console.log("🚨🚨🚨 roles :", roles)

      // Vérifier si l'utilisateur existe déjà
      const userExists = await User.findOne({ email })
      if (userExists) {
        throw new Error("L'utilisateur existe déjà !")
      }

      // 🔹 Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10)

      // 🔥 Attribution sécurisée du rôle par défaut
      let assignedRole = await Role.findOne({ name: "Acheteur" })

      if (currentUserRole === "admin" && roles) {
        // ✅ Si un admin crée un utilisateur, il peut définir un rôle spécifique
        const roleExists = await Role.findById(roles)
        if (!roleExists) throw new Error("Le rôle spécifié n'existe pas.")
        assignedRole = roleExists
      }

      // ✅ Étape : Enregistrement sécurisé en MongoDB
      const newUser = new User({
        email,
        password: hashedPassword,
        role_id: assignedRole._id, // Associer un ObjectId de rôle MongoDB
        prenom,
        nom,
        adresse,
        ...(salesPoint && { point_vente_id: salesPoint }), // Ajoute uniquement si salesPoint existe
      })

      await newUser.save()
      return { message: "Utilisateur créé avec succès !" }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * 🔹 Connexion d'un utilisateur (MongoDB)
   */
  async loginUser(email, password) {
    try {
      // Vérifier si l'utilisateur existe en base
      const user = await User.findOne({ email }).populate("role_id")
      if (!user) {
        throw new Error("Utilisateur introuvable.")
      }

      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        throw new Error("Mot de passe incorrect.")
      }

      // ✅ Générer le token JWT
      const token = await this.generateToken(user)

      return {
        message: "Connexion réussie",
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role_id.name, // Nom du rôle (admin, user, manager...)
        },
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  /**
   * 🔹 Récupérer le profil utilisateur
   */
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId).populate(
        "point_vente_id",
        "nom adresse"
      )

      if (!user) {
        throw new Error("Utilisateur introuvable.")
      }

      return user
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default new AuthService()
