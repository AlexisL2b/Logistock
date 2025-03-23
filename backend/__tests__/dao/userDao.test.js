import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import UserDAO from "../../dao/userDAO.js"
import User from "../../models/userModel.js"
import Role from "../../models/roleModel.js"

let mongoServer

describe("🧪 UserDAO", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  afterEach(async () => {
    await User.deleteMany()
    await Role.deleteMany()
  })

  test("createUser : doit créer un utilisateur", async () => {
    const userData = {
      email: "test@example.com",
      password: "123456",
      role: { _id: new mongoose.Types.ObjectId(), name: "Admin" },
      sales_point: {
        _id: new mongoose.Types.ObjectId(),
        name: "Point A",
      },
      firstname: "John",
      lastname: "Doe",
    }

    const user = await UserDAO.createUser(userData)
    expect(user).toBeDefined()
    expect(user.email).toBe("test@example.com")
    expect(user.sales_point.name).toBe("Point A")
  })

  test("findByEmail : doit retourner l'utilisateur par email", async () => {
    await User.create({
      email: "findme@example.com",
      password: "secret",
      role: { _id: new mongoose.Types.ObjectId(), name: "Acheteur" },
      sales_point: { _id: new mongoose.Types.ObjectId(), name: "SP" },
    })

    const user = await UserDAO.findByEmail("findme@example.com")
    expect(user).not.toBeNull()
    expect(user.email).toBe("findme@example.com")
  })

  test("findBuyers : retourne uniquement les acheteurs", async () => {
    await User.create([
      {
        email: "buyer1@example.com",
        password: "a",
        role: { _id: new mongoose.Types.ObjectId(), name: "Acheteur" },
        sales_point: { _id: new mongoose.Types.ObjectId(), name: "SP1" },
      },
      {
        email: "admin@example.com",
        password: "b",
        role: { _id: new mongoose.Types.ObjectId(), name: "Admin" },
        sales_point: { _id: new mongoose.Types.ObjectId(), name: "SP2" },
      },
    ])

    const buyers = await UserDAO.findBuyers()
    expect(buyers).toHaveLength(1)
    expect(buyers[0].role.name).toBe("Acheteur")
  })

  test("findBySalesPointId : trouve les utilisateurs d'un point de vente", async () => {
    const spId = new mongoose.Types.ObjectId()
    await User.create({
      email: "sales@example.com",
      password: "pass",
      role: { _id: new mongoose.Types.ObjectId(), name: "Vendeur" },
      sales_point: { _id: spId, name: "SP X" },
    })

    const users = await UserDAO.findBySalesPointId(spId)
    expect(users.length).toBe(1)
    expect(users[0].sales_point._id.toString()).toBe(spId.toString())
  })

  test("updateUser : met à jour le rôle si role_id fourni", async () => {
    const user = await User.create({
      email: "up@example.com",
      password: "pass",
      role: { _id: new mongoose.Types.ObjectId(), name: "Utilisateur" },
      sales_point: { _id: new mongoose.Types.ObjectId(), name: "SP" },
    })

    const createdRole = await Role.create({ name: "admin" }) // ✅ Bien attendre

    const updated = await UserDAO.updateUser(user._id, {
      role_id: createdRole._id, // 👈 Bien passer l'ID du rôle qui existe
    })

    expect(updated).toBeDefined()
    expect(updated.role.name).toBe("admin")
  })

  test("deleteUser : supprime un utilisateur", async () => {
    const user = await User.create({
      email: "delete@example.com",
      password: "pass",
      role: { _id: new mongoose.Types.ObjectId(), name: "Admin" },
      sales_point: { _id: new mongoose.Types.ObjectId(), name: "SP" },
    })

    const deleted = await UserDAO.deleteUser(user._id)
    expect(deleted.email).toBe("delete@example.com")

    const check = await User.findById(user._id)
    expect(check).toBeNull()
  })

  test("findById : retourne un utilisateur par ID", async () => {
    const user = await User.create({
      email: "findid@example.com",
      password: "idpass",
      role: { _id: new mongoose.Types.ObjectId(), name: "Admin" },
      sales_point: { _id: new mongoose.Types.ObjectId(), name: "SPX" },
    })

    const found = await UserDAO.findById(user._id)
    expect(found.email).toBe("findid@example.com")
  })

  test("findAll : retourne tous les utilisateurs", async () => {
    await User.create([
      {
        email: "u1@example.com",
        password: "a",
        role: { _id: new mongoose.Types.ObjectId(), name: "Admin" },
        sales_point: { _id: new mongoose.Types.ObjectId(), name: "SP1" },
      },
      {
        email: "u2@example.com",
        password: "b",
        role: { _id: new mongoose.Types.ObjectId(), name: "Gestionnaire" },
        sales_point: { _id: new mongoose.Types.ObjectId(), name: "SP2" },
      },
    ])

    const users = await UserDAO.findAll()
    expect(users.length).toBe(2)
  })
})
