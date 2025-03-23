import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import TransporterDAO from "../../dao/transporterDAO.js"
import Transporter from "../../models/transporterModel.js"

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  await Transporter.deleteMany()
})

describe("🧪 TransporterDAO", () => {
  test("✅ create : doit créer un transporteur", async () => {
    const data = {
      name: "Logispeed",
      phone: "0600000000",
      email: "contact@logispeed.fr",
    }

    const created = await TransporterDAO.create(data)

    expect(created).toMatchObject(data)
    expect(created._id).toBeDefined()
  })

  test("✅ findAll : doit retourner tous les transporteurs", async () => {
    await TransporterDAO.create({ name: "T1" })
    await TransporterDAO.create({ name: "T2" })

    const result = await TransporterDAO.findAll()
    expect(result.length).toBe(2)
    expect(result[0].name).toBeDefined()
  })

  test("✅ findById : doit retourner un transporteur par ID", async () => {
    const created = await TransporterDAO.create({ name: "IDTest" })
    const found = await TransporterDAO.findById(created._id)

    expect(found).toBeDefined()
    expect(found.name).toBe("IDTest")
  })

  test("✅ update : doit mettre à jour un transporteur", async () => {
    const created = await TransporterDAO.create({ name: "Before" })

    const updated = await TransporterDAO.update(created._id, {
      name: "After",
    })

    expect(updated).toBeDefined()
    expect(updated.name).toBe("After")
  })

  test("✅ delete : doit supprimer un transporteur", async () => {
    const created = await TransporterDAO.create({ name: "DeleteMe" })

    const deleted = await TransporterDAO.delete(created._id)
    const found = await TransporterDAO.findById(created._id)

    expect(deleted).toBeDefined()
    expect(found).toBeNull()
  })
})
