import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Product from "../../models/productModel.js"

// 🔸 Faux modèles pour les références
const Category = mongoose.model(
  "Category",
  new mongoose.Schema({ name: String })
)
const Supplier = mongoose.model(
  "Supplier",
  new mongoose.Schema({ name: String })
)

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
  await Product.deleteMany()
  await Category.deleteMany()
  await Supplier.deleteMany()
})

describe("Modèle Product", () => {
  test("devrait créer et enregistrer un produit avec succès", async () => {
    const category = await Category.create({ name: "Informatique" })
    const supplier = await Supplier.create({ name: "Fournisseur A" })

    const product = new Product({
      name: "Ordinateur portable",
      reference: "ORD123",
      description: "PC performant pour travail et gaming",
      price: 999.99,
      category_id: category._id,
      supplier_id: supplier._id,
    })

    const saved = await product.save()

    expect(saved._id).toBeDefined()
    expect(saved.name).toBe("Ordinateur portable")
    expect(saved.price).toBe(999.99)
    expect(saved.category_id.toString()).toBe(category._id.toString())
    expect(saved.supplier_id.toString()).toBe(supplier._id.toString())
  })

  test("devrait échouer si les champs requis sont manquants", async () => {
    const product = new Product({}) // Champs vides

    let err
    try {
      await product.save()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors.name).toBeDefined()
    expect(err.errors.reference).toBeDefined()
    expect(err.errors.description).toBeDefined()
    expect(err.errors.price).toBeDefined()
    expect(err.errors.category_id).toBeDefined()
    expect(err.errors.supplier_id).toBeDefined()
  })
})
