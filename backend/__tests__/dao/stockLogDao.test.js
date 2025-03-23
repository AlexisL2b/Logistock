import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import StockLogDAO from "../../dao/stockLogDAO.js"
import Stock from "../../models/stockModel.js"
import StockLog from "../../models/stockLogModel.js"
import Product from "../../models/productModel.js"
import Category from "../../models/categoryModel.js"
import Supplier from "../../models/supplierModel.js"

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
  await Category.deleteMany()
  await Supplier.deleteMany()
})

describe("StockLogDAO", () => {
  test("✅ create : doit créer un log de stock", async () => {
    const product = await Product.create({
      name: "Test produit",
      reference: "PROD001",
      description: "Description test",
      price: 100,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    const stock = await Stock.create({ product_id: product._id, quantity: 20 })

    const created = await StockLogDAO.create({
      stock_id: stock._id,
      event: "création",
      quantity: 20,
    })

    expect(created._id).toBeDefined()
    expect(created.event).toBe("création")
    expect(created.quantity).toBe(20)
  })

  test("✅ findAll : doit récupérer tous les logs", async () => {
    const stock = await Stock.create({
      product_id: new mongoose.Types.ObjectId(),
      quantity: 15,
    })

    await StockLogDAO.create({
      stock_id: stock._id,
      event: "entrée",
      quantity: 5,
    })

    const logs = await StockLogDAO.findAll()
    expect(logs.length).toBe(1)
    expect(logs[0].event).toBe("entrée")
  })

  test("✅ findById : doit retourner un log par ID", async () => {
    const stock = await Stock.create({
      product_id: new mongoose.Types.ObjectId(),
      quantity: 10,
    })

    const log = await StockLog.create({
      stock_id: stock._id,
      event: "création",
      quantity: 10,
    })

    const found = await StockLogDAO.findById(log._id)

    expect(found).toBeDefined()
    expect(found._id.toString()).toBe(log._id.toString())
  })

  test("✅ update : doit mettre à jour un log", async () => {
    const stock = await Stock.create({
      product_id: new mongoose.Types.ObjectId(),
      quantity: 40,
    })

    const log = await StockLogDAO.create({
      stock_id: stock._id,
      event: "entrée",
      quantity: 10,
    })

    const updated = await StockLogDAO.update(log._id, {
      event: "sortie",
      quantity: 5,
    })

    expect(updated.event).toBe("sortie")
    expect(updated.quantity).toBe(5)
  })

  test("✅ delete : doit supprimer un log", async () => {
    const stock = await Stock.create({
      product_id: new mongoose.Types.ObjectId(),
      quantity: 12,
    })

    const log = await StockLogDAO.create({
      stock_id: stock._id,
      event: "entrée",
      quantity: 12,
    })

    const deleted = await StockLogDAO.delete(log._id)
    expect(deleted._id.toString()).toBe(log._id.toString())

    const found = await StockLog.findById(log._id)
    expect(found).toBeNull()
  })

  test("✅ deleteByProductId : doit supprimer un log par product_id", async () => {
    const product = await Product.create({
      name: "Test Prod",
      reference: "REFLOG002",
      description: "Test",
      price: 50,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    const stock = await Stock.create({
      product_id: product._id,
      quantity: 5,
    })

    const createdLog = await StockLogDAO.create({
      stock_id: stock._id,
      event: "création",
      quantity: 5,
    })

    const deleted = await StockLogDAO.deleteByProductId(product._id)
    expect(deleted).toBeDefined()
    expect(deleted._id.toString()).toBe(createdLog._id.toString())
  })
})
