import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Stock from "../../models/stockModel.js"
import StockLog from "../../models/stockLogModel.js"
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
  await StockLog.deleteMany()
  await Stock.deleteMany()
  await Product.deleteMany()
})

describe("Modèle StockLog", () => {
  test("✅ doit créer un stockLog avec succès", async () => {
    const product = await Product.create({
      name: "Produit test",
      reference: "REFLOG001",
      description: "Test stocklog",
      price: 99,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    const stock = await Stock.create({
      product_id: product._id,
      quantity: 10,
    })

    const log = await StockLog.create({
      stock_id: stock._id,
      event: "entrée",
      quantity: 5,
    })

    expect(log._id).toBeDefined()
    expect(log.stock_id.toString()).toBe(stock._id.toString())
    expect(log.event).toBe("entrée")
    expect(log.quantity).toBe(5)
    expect(log.date_event).toBeInstanceOf(Date)
  })

  test("❌ doit échouer si event est invalide", async () => {
    const stock = await Stock.create({
      product_id: new mongoose.Types.ObjectId(),
      quantity: 10,
    })

    let err
    try {
      await StockLog.create({
        stock_id: stock._id,
        event: "invalide",
        quantity: 3,
      })
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors["event"]).toBeDefined()
  })

  test("❌ doit échouer si quantity est manquant", async () => {
    const stock = await Stock.create({
      product_id: new mongoose.Types.ObjectId(),
      quantity: 10,
    })

    let err
    try {
      await StockLog.create({
        stock_id: stock._id,
        event: "sortie",
      })
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors["quantity"]).toBeDefined()
  })

  test("❌ doit échouer si stock_id est manquant", async () => {
    let err
    try {
      await StockLog.create({
        event: "entrée",
        quantity: 3,
      })
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors["stock_id"]).toBeDefined()
  })
})
