import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import supplierOrder from "../../models/supplierOrderModel.js"
import Supplier from "../../models/supplierModel.js"
import Product from "../../models/productModel.js"
import Stock from "../../models/stockModel.js"

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  await supplierOrder.deleteMany()
  await Supplier.deleteMany()
  await Product.deleteMany()
  await Stock.deleteMany()
})

describe("📦 supplierOrder model", () => {
  test("✅ doit créer une commande fournisseur valide", async () => {
    const supplier = await Supplier.create({ name: "Fournisseur Test" })
    const product = await Product.create({
      name: "Produit A",
      reference: "REF-A",
      price: 10,
      description: "desc",
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: supplier._id,
    })
    const stock = await Stock.create({ product_id: product._id, quantity: 50 })

    const order = await supplierOrder.create({
      supplier_id: supplier._id,
      statut: "En attente de traitement",
      details: [
        {
          product_id: product._id,
          name: product.name,
          reference: product.reference,
          quantity: 20,
          category: "Papeterie",
          stock_id: stock._id,
        },
      ],
      orderedAt: new Date(),
    })

    expect(order._id).toBeDefined()
    expect(order.details.length).toBe(1)
    expect(order.details[0].name).toBe("Produit A")
  })

  test("❌ doit échouer si le statut est invalide", async () => {
    const supplier = await Supplier.create({ name: "Fournisseur Test" })

    const invalidOrder = new supplierOrder({
      supplier_id: supplier._id,
      statut: "Invalid Statut",
      details: [],
    })

    let error
    try {
      await invalidOrder.save()
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.errors["statut"]).toBeDefined()
  })

  test("❌ doit échouer si un champ obligatoire est manquant", async () => {
    const invalidOrder = new supplierOrder({
      statut: "Reçue", // supplier_id manquant
      details: [],
    })

    let error
    try {
      await invalidOrder.save()
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.errors["supplier_id"]).toBeDefined()
  })

  test("✅ doit autoriser le champ `receivedAt` à être vide", async () => {
    const supplier = await Supplier.create({ name: "Fournisseur Test" })

    const order = await supplierOrder.create({
      supplier_id: supplier._id,
      statut: "En attente de traitement",
      details: [],
    })

    expect(order.receivedAt).toBeUndefined()
    expect(order.createdAt).toBeDefined()
  })
})
