import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import stockDAO from "../../dao/stockDAO.js"
import Stock from "../../models/stockModel.js"
import StockLog from "../../models/stockLogModel.js"
import Product from "../../models/productModel.js"
import Category from "../../models/categoryModel.js"
import Supplier from "../../models/supplierModel.js"

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

afterEach(async () => {
  await Stock.deleteMany()
  await StockLog.deleteMany()
  await Product.deleteMany()
  await Category.deleteMany()
  await Supplier.deleteMany()
})

describe("StockDAO", () => {
  test("doit créer un stock", async () => {
    const product = await Product.create({
      name: "Souris",
      reference: "MOU123",
      description: "Souris sans fil",
      price: 25,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    const created = await stockDAO.createStock({
      product_id: product._id,
      quantity: 10,
    })

    expect(created).toBeDefined()
    expect(created.quantity).toBe(10)
  })

  test("doit récupérer un stock par ID", async () => {
    const product = await Product.create({
      name: "Clavier",
      reference: "KEY123",
      description: "Clavier mécanique",
      price: 60,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    const stock = await stockDAO.createStock({
      product_id: product._id,
      quantity: 15,
    })

    const found = await stockDAO.findById(stock._id)
    expect(found).toBeDefined()
    expect(found.quantity).toBe(15)
  })

  test("doit récupérer un stock par product_id", async () => {
    const product = await Product.create({
      name: "Écran",
      reference: "SCR456",
      description: "Écran 27 pouces",
      price: 200,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    await stockDAO.createStock({
      product_id: product._id,
      quantity: 20,
    })

    const result = await stockDAO.findByProductId(product._id)
    expect(result).toBeDefined()
    expect(result.product_id.toString()).toBe(product._id.toString())
  })

  test("doit mettre à jour un stock", async () => {
    const product = await Product.create({
      name: "Casque",
      reference: "HEAD123",
      description: "Casque audio",
      price: 100,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    const stock = await stockDAO.createStock({
      product_id: product._id,
      quantity: 30,
    })

    const updated = await stockDAO.update(stock._id, { quantity: 50 })
    expect(updated.quantity).toBe(50)
  })

  test("doit mettre à jour un stock par product_id", async () => {
    const product = await Product.create({
      name: "Imprimante",
      reference: "PRN123",
      description: "Laser",
      price: 150,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    await stockDAO.createStock({ product_id: product._id, quantity: 5 })

    const updated = await stockDAO.updateByProductId(product._id, {
      quantity: 12,
    })

    expect(updated).toBeDefined()
    expect(updated.quantity).toBe(12)
  })

  test("doit incrémenter le stock", async () => {
    const product = await Product.create({
      name: "Scanner",
      reference: "SCN001",
      description: "Scanner A4",
      price: 80,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    const stock = await stockDAO.createStock({
      product_id: product._id,
      quantity: 8,
    })

    const updated = await stockDAO.incrementStock(stock._id, 5)
    expect(updated.quantity).toBe(13)
  })

  test("doit supprimer un stock par ID", async () => {
    const product = await Product.create({
      name: "Webcam",
      reference: "WBC001",
      description: "HD 1080p",
      price: 40,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    const stock = await stockDAO.createStock({
      product_id: product._id,
      quantity: 6,
    })

    const deleted = await stockDAO.delete(stock._id)
    expect(deleted._id.toString()).toBe(stock._id.toString())
  })

  test("doit supprimer un stock par product_id", async () => {
    const product = await Product.create({
      name: "Tablette",
      reference: "TAB001",
      description: "10 pouces",
      price: 300,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: new mongoose.Types.ObjectId(),
    })

    await stockDAO.createStock({
      product_id: product._id,
      quantity: 7,
    })

    const deleted = await stockDAO.deleteByProductId(product._id)
    expect(deleted).toBeDefined()
    expect(deleted.product_id.toString()).toBe(product._id.toString())
  })

  test("doit récupérer tous les stocks avec produits et stockLogs", async () => {
    const category = await Category.create({ name: "Divers" })
    const supplier = await Supplier.create({ name: "Fournisseur ABC" })

    const product = await Product.create({
      name: "Disque dur",
      reference: "HDD001",
      description: "1 To",
      price: 60,
      category_id: category._id,
      supplier_id: supplier._id,
    })

    const stock = await stockDAO.createStock({
      product_id: product._id,
      quantity: 50,
    })

    await StockLog.create({
      stock_id: stock._id,
      event: "entrée",
      quantity: 50,
      date: new Date(),
    })

    const results = await stockDAO.findAllWithProducts()
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]).toHaveProperty("stockLogs")
    expect(results[0].stockLogs.length).toBe(1)
  })
})
