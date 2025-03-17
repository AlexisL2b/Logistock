import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import User from "../../models/userModel.js"
import bcrypt from "bcryptjs"

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

describe("User Model", () => {
  beforeEach(async () => {
    await User.deleteMany() // Nettoyer les utilisateurs avant chaque test
  })

  /**
   * ✅ Test : Création d'un utilisateur avec mot de passe hashé
   */
  test("✅ Devrait créer un utilisateur et hasher le mot de passe", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      role: { _id: new mongoose.Types.ObjectId(), name: "admin" },
      firstname: "John",
      lastname: "Doe",
    }

    const user = await User.create(userData)

    expect(user).toHaveProperty("_id")
    expect(user.email).toBe("test@example.com")
    expect(user.password).not.toBe("password123") // Mot de passe ne doit pas être stocké en clair
    expect(await bcrypt.compare("password123", user.password)).toBe(true) // Vérifier le hash
  })

  /**
   * ❌ Test : Erreur si l'email est manquant
   */
  test("❌ Devrait échouer si l'email est manquant", async () => {
    const userData = {
      password: "password123",
      role: { _id: new mongoose.Types.ObjectId(), name: "admin" },
    }

    await expect(User.create(userData)).rejects.toThrow(
      mongoose.Error.ValidationError
    )
  })

  /**
   * ❌ Test : Erreur si le mot de passe est manquant
   */
  test("❌ Devrait échouer si le mot de passe est manquant", async () => {
    const userData = {
      email: "test@example.com",
      role: { _id: new mongoose.Types.ObjectId(), name: "admin" },
    }

    await expect(User.create(userData)).rejects.toThrow(
      mongoose.Error.ValidationError
    )
  })

  /**
   * ✅ Test : Vérifier que le mot de passe ne re-hash pas lors d'une mise à jour
   */
  test("✅ Ne doit pas re-hasher le mot de passe si non modifié", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      role: { _id: new mongoose.Types.ObjectId(), name: "admin" },
    }

    const user = await User.create(userData)
    const hashedPassword = user.password

    // Mise à jour du prénom sans toucher au mot de passe
    user.firstname = "Jane"
    await user.save()

    // Vérifier que le mot de passe n'a pas été re-hashé
    expect(user.password).toBe(hashedPassword)
  })

  /**
   * ✅ Test : Vérifier que le rôle est bien référencé
   */
  test("✅ Devrait stocker un rôle et un point de vente correctement", async () => {
    const roleId = new mongoose.Types.ObjectId()
    const salesPointId = new mongoose.Types.ObjectId()

    const userData = {
      email: "test@example.com",
      password: "password123",
      role: { _id: roleId, name: "gestionnaire" },
      sales_point: { _id: salesPointId, name: "Magasin A" },
    }

    const user = await User.create(userData)

    expect(user.role._id.toString()).toBe(roleId.toString())
    expect(user.role.name).toBe("gestionnaire")
    expect(user.sales_point._id.toString()).toBe(salesPointId.toString())
    expect(user.sales_point.name).toBe("Magasin A")
  })
})
