import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Stock from "../../models/stockModel.js"
import Product from "../../models/productModel.js"

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
  await Stock.deleteMany()
  await Product.deleteMany()
})

describe("Modèle Stock", () => {
  test("✅ doit créer un stock avec succès", async () => {
    const product = await Product.create({
      name: "Test produit",
      reference: "REF123",
      description: "Description",
      price: 99,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    const stock = await Stock.create({
      product_id: product._id,
      quantity: 10,
    })

    expect(stock._id).toBeDefined()
    expect(stock.quantity).toBe(10)
    expect(stock.product_id.toString()).toBe(product._id.toString())
  })

  test("❌ doit échouer si product_id est manquant", async () => {
    let err
    try {
      await Stock.create({ quantity: 5 })
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors.product_id).toBeDefined()
  })

  test("❌ doit échouer si quantity est manquant", async () => {
    const product = await Product.create({
      name: "Produit B",
      reference: "REF456",
      description: "Autre produit",
      price: 49,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    let err
    try {
      await Stock.create({ product_id: product._id })
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors.quantity).toBeDefined()
  })

  test("❌ doit interdire plusieurs stocks pour le même produit (unique)", async () => {
    const product = await Product.create({
      name: "Produit unique",
      reference: "REF999",
      description: "Produit test",
      price: 12,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    await Stock.create({ product_id: product._id, quantity: 10 })

    let err
    try {
      await Stock.create({ product_id: product._id, quantity: 5 })
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.code).toBe(11000) // Erreur d'unicité Mongo
  })
})
