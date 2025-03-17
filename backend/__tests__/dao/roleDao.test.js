import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import RoleDAO from "../../dao/roleDAO.js"
import Role from "../../models/roleModel.js"

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

beforeEach(async () => {
  await Role.deleteMany() // Nettoyage avant chaque test
})

describe("RoleDAO", () => {
  /**
   * ✅ Test : Récupérer tous les rôles
   */
  test("✅ findAll : Récupère tous les rôles", async () => {
    await Role.create([{ name: "admin" }, { name: "gestionnaire" }])

    const roles = await RoleDAO.findAll()

    expect(roles).toHaveLength(2)
    expect(roles[0].name).toBe("admin")
    expect(roles[1].name).toBe("gestionnaire")
  })

  /**
   * ✅ Test : Récupérer un rôle par ID
   */
  test("✅ findById : Récupère un rôle existant", async () => {
    const newRole = await Role.create({ name: "acheteur" })
    const foundRole = await RoleDAO.findById(newRole._id)

    expect(foundRole).not.toBeNull()
    expect(foundRole.name).toBe("acheteur")
  })

  test("❌ findById : Erreur si le rôle est introuvable", async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const foundRole = await RoleDAO.findById(fakeId)

    expect(foundRole).toBeNull()
  })

  /**
   * ✅ Test : Ajouter un rôle
   */
  test("✅ create : Ajoute un rôle", async () => {
    const roleData = { name: "logisticien" }
    const createdRole = await RoleDAO.create(roleData)

    expect(createdRole).toHaveProperty("_id")
    expect(createdRole.name).toBe("logisticien")
  })

  test("❌ create : Erreur si le rôle est invalide", async () => {
    await expect(RoleDAO.create({ name: "superadmin" })).rejects.toThrow() // "superadmin" n'existe pas dans `enum`
  })

  /**
   * ✅ Test : Mettre à jour un rôle
   */
  test("✅ update : Met à jour un rôle existant", async () => {
    const existingRole = await Role.create({ name: "admin" })
    const updatedRole = await RoleDAO.update(existingRole._id, {
      name: "gestionnaire",
    })

    expect(updatedRole).not.toBeNull()
    expect(updatedRole.name).toBe("gestionnaire")
  })

  test("❌ update : Erreur si le rôle est introuvable", async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const updatedRole = await RoleDAO.update(fakeId, { name: "acheteur" })

    expect(updatedRole).toBeNull()
  })

  /**
   * ✅ Test : Supprimer un rôle
   */
  test("✅ delete : Supprime un rôle existant", async () => {
    const roleToDelete = await Role.create({ name: "logisticien" })
    const deletedRole = await RoleDAO.delete(roleToDelete._id)

    expect(deletedRole).not.toBeNull()
    expect(deletedRole.name).toBe("logisticien")

    const foundRole = await Role.findById(roleToDelete._id)
    expect(foundRole).toBeNull()
  })

  test("❌ delete : Erreur si le rôle est introuvable", async () => {
    const fakeId = new mongoose.Types.ObjectId()
    const deletedRole = await RoleDAO.delete(fakeId)

    expect(deletedRole).toBeNull()
  })
})
