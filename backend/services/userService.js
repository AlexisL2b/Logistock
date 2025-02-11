import UserDAO from "../dao/userDAO.js"
import bcrypt from "bcrypt"
import { getAuth } from "firebase-admin/auth"
import userDAO from "../dao/userDAO.js"
import admin from "../config/firebase.js"

class UserService {
  async getAllUsers() {
    return await UserDAO.findAll()
  }

  async getBuyers() {
    const allUsers = await userDAO.findAll()
    const userIds = allUsers.map((user) => user.firebaseUid)

    const usersWithClaims = await Promise.all(
      userIds.map(async (uid) => {
        try {
          const userRecord = await admin.auth().getUser(uid)
          const userFromDB = allUsers.find((user) => user.firebaseUid === uid)

          if (!userFromDB) {
            console.warn(`Utilisateur avec UID ${uid} non trouvé en BDD`)
            return null
          }

          // Transformer en objet JS pur
          const cleanUser = userFromDB.toObject()
          cleanUser.customClaims = userRecord.customClaims

          return cleanUser
        } catch (error) {
          console.error(
            `Erreur lors de la récupération des claims pour ${uid}:`,
            error
          )
          return null
        }
      })
    )

    // console.log("usersWithClaims", usersWithClaims)

    // Filtrer les acheteurs et enlever les utilisateurs null
    return usersWithClaims.filter(
      (user) => user && user.customClaims?.role === "Acheteur"
    )
  }

  async getUserById(id) {
    const user = await UserDAO.findById(id)
    if (!user) {
      throw new Error("Utilisateur introuvable")
    }
    return user
  }

  async getUserByFirebaseUid(firebaseUid) {
    const user = await UserDAO.findByFirebaseUid(firebaseUid)
    if (!user) {
      throw new Error("Utilisateur introuvable avec cet UID")
    }
    return user
  }

  async getUserByEmail(email) {
    const user = await UserDAO.findByEmail(email)
    if (!user) {
      throw new Error(`Utilisateur avec l'email ${email} introuvable`)
    }
    return user
  }

  async addUser(userData, creatorRole) {
    if (!userData.nom || !userData.email || !userData.mot_de_passe) {
      throw new Error("Les champs 'nom', 'email' et 'mot_de_passe' sont requis")
    }

    userData.mot_de_passe = await bcrypt.hash(userData.mot_de_passe, 10)

    // 🔥 Si un gestionnaire crée un utilisateur, il ne peut créer que des acheteurs
    if (creatorRole === "Gestionnaire") {
      userData.role = "Acheteur"
    }

    return await UserDAO.create(userData)
  }

  async updateUser(id, userData) {
    const existingUser = await UserDAO.findById(id)
    if (!existingUser) {
      throw new Error("Utilisateur introuvable")
    }

    if (userData.mot_de_passe) {
      userData.mot_de_passe = await bcrypt.hash(userData.mot_de_passe, 10)
    }

    if (userData.email && userData.email !== existingUser.email) {
      try {
        const auth = getAuth()
        await auth.updateUser(existingUser.firebaseUid.toString(), {
          email: userData.email,
        })
      } catch (firebaseError) {
        throw new Error("Impossible de modifier l'email sur Firebase")
      }
    }

    return await UserDAO.update(id, userData)
  }

  async deleteUser(id) {
    const user = await UserDAO.findById(id)
    if (!user) {
      throw new Error("Utilisateur introuvable")
    }

    try {
      await getAuth().deleteUser(user.firebaseUid)
    } catch (firebaseError) {
      throw new Error("Erreur lors de la suppression dans Firebase")
    }

    return await UserDAO.delete(id)
  }
}

export default new UserService()
