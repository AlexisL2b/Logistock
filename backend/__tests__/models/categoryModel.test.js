import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Category from "../../models/categoryModel.js" // ajuste le chemin si besoin

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

afterEach(async () => {
  await Category.deleteMany()
})

describe("Modèle Category", () => {
  test("devrait créer et sauvegarder une catégorie avec succès", async () => {
    const category = new Category({ name: "Papeterie" })
    const savedCategory = await category.save()

    expect(savedCategory._id).toBeDefined()
    expect(savedCategory.name).toBe("Papeterie")
  })

  test("devrait échouer si le champ name est manquant", async () => {
    const category = new Category({})
    let err
    try {
      await category.save()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors.name).toBeDefined()
  })
})
