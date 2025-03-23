import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import SalesPoint from "../../models/salesPointModel.js"

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
})

describe("Modèle SalesPoint", () => {
  test("doit créer un point de vente valide", async () => {
    const point = new SalesPoint({
      name: "Boutique République",
      address: "12 Place de la République",
    })

    const saved = await point.save()

    expect(saved._id).toBeDefined()
    expect(saved.name).toBe("Boutique République")
    expect(saved.address).toBe("12 Place de la République")
  })

  test("doit échouer sans nom", async () => {
    const point = new SalesPoint({
      address: "1 Rue Incomplète",
    })

    let err
    try {
      await point.save()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors.name).toBeDefined()
  })

  test("doit échouer sans adresse", async () => {
    const point = new SalesPoint({
      name: "Nom sans adresse",
    })

    let err
    try {
      await point.save()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors.address).toBeDefined()
  })
})
