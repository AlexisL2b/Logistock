import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
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

describe("🧪 Transporter Model", () => {
  test("✅ doit créer un transporteur avec succès", async () => {
    const transporter = await Transporter.create({
      name: "Trans Express",
      phone: "0123456789",
      email: "contact@transexpress.com",
    })

    expect(transporter._id).toBeDefined()
    expect(transporter.name).toBe("Trans Express")
    expect(transporter.phone).toBe("0123456789")
    expect(transporter.email).toBe("contact@transexpress.com")
  })

  test("❌ doit échouer si le nom est manquant", async () => {
    let error

    try {
      await Transporter.create({
        phone: "0123456789",
        email: "no-name@fail.com",
      })
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.errors.name).toBeDefined()
  })

  test("✅ doit accepter un transporteur avec juste le nom", async () => {
    const transporter = await Transporter.create({ name: "Only Name" })

    expect(transporter.name).toBe("Only Name")
    expect(transporter.phone).toBeUndefined()
    expect(transporter.email).toBeUndefined()
  })
})
