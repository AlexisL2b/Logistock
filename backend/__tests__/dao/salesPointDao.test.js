import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import SalesPoint from "../../models/salesPointModel.js"
import User from "../../models/userModel.js"
import salesPointDAO from "../../dao/salesPointDAO.js"

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

afterEach(async () => {
  await SalesPoint.deleteMany()
  await User.deleteMany()
})

describe("SalesPointDAO", () => {
  test("doit créer un point de vente", async () => {
    const data = { name: "Point A", address: "123 rue A" }
    const created = await salesPointDAO.create(data)

    expect(created).toBeDefined()
    expect(created.name).toBe("Point A")
  })

  test("doit retourner tous les points de vente", async () => {
    await salesPointDAO.create({ name: "Point A", address: "A" })
    await salesPointDAO.create({ name: "Point B", address: "B" })

    const points = await salesPointDAO.findAll()
    expect(points.length).toBe(2)
  })

  test("doit retrouver un point de vente par ID", async () => {
    const created = await salesPointDAO.create({
      name: "Test Point",
      address: "Adresse test",
    })
    const found = await salesPointDAO.findById(created._id)

    expect(found).toBeDefined()
    expect(found.name).toBe("Test Point")
  })

  test("doit mettre à jour un point de vente", async () => {
    const created = await salesPointDAO.create({
      name: "Ancien Nom",
      address: "Ancienne Adresse",
    })

    const updated = await salesPointDAO.update(created._id, {
      name: "Nouveau Nom",
    })

    expect(updated.name).toBe("Nouveau Nom")
  })

  test("doit supprimer un point de vente", async () => {
    const created = await salesPointDAO.create({
      name: "À supprimer",
      address: "Test",
    })

    const deleted = await salesPointDAO.delete(created._id)

    expect(deleted._id.toString()).toBe(created._id.toString())

    const after = await SalesPoint.findById(created._id)
    expect(after).toBeNull()
  })

  test("doit retrouver les points de vente sans utilisateurs", async () => {
    const sp1 = await salesPointDAO.create({ name: "Libre", address: "A" })
    const sp2 = await salesPointDAO.create({ name: "Assigné", address: "B" })

    await User.create({
      firstname: "Paul",
      lastname: "Test",
      email: "paul@example.com",
      password: "password",
      role: { name: "logisticien", _id: "677cf977b39853e4a17727e0" },
      sales_point: { _id: sp2._id, name: sp2.name },
    })

    const result = await salesPointDAO.findWithoutUsers()

    expect(result.length).toBe(1)
    expect(result[0]._id.toString()).toBe(sp1._id.toString())
  })
})
