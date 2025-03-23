import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import supplierOrderDAO from "../../dao/supplierOrderDAO.js"
import Supplier from "../../models/supplierModel.js"
import Product from "../../models/productModel.js"
import Stock from "../../models/stockModel.js"
import SupplierOrder from "../../models/supplierOrderModel.js"

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
  await SupplierOrder.deleteMany()
  await Supplier.deleteMany()
  await Product.deleteMany()
  await Stock.deleteMany()
})

describe("📦 supplierOrderDAO", () => {
  let supplier, product, stock

  beforeEach(async () => {
    supplier = await Supplier.create({ name: "Supplier X" })
    product = await Product.create({
      name: "Produit Test",
      reference: "REF123",
      price: 10,
      description: "Produit test",
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: supplier._id,
    })
    stock = await Stock.create({ product_id: product._id, quantity: 100 })
  })

  test("✅ create : doit créer une commande fournisseur", async () => {
    const data = {
      supplier_id: supplier._id,
      statut: "Reçue",
      details: [
        {
          product_id: product._id,
          name: product.name,
          reference: product.reference,
          quantity: 50,
          category: "Informatique",
          stock_id: stock._id,
        },
      ],
    }

    const order = await supplierOrderDAO.create(data)

    expect(order._id).toBeDefined()
    expect(order.details[0].name).toBe("Produit Test")
  })

  test("✅ getAll : doit retourner toutes les commandes", async () => {
    await supplierOrderDAO.create({
      supplier_id: supplier._id,
      statut: "En attente de traitement",
      details: [],
    })

    const orders = await supplierOrderDAO.getAll()

    expect(Array.isArray(orders)).toBe(true)
    expect(orders.length).toBe(1)
    expect(orders[0].supplier_id.name).toBe("Supplier X")
  })

  test("✅ getById : doit retourner une commande spécifique", async () => {
    const created = await supplierOrderDAO.create({
      supplier_id: supplier._id,
      statut: "Reçue",
      details: [],
    })

    const found = await supplierOrderDAO.getById(created._id)

    expect(found).toBeDefined()
    expect(found._id.toString()).toBe(created._id.toString())
  })

  test("✅ update : doit mettre à jour une commande", async () => {
    const created = await supplierOrderDAO.create({
      supplier_id: supplier._id,
      statut: "En attente de traitement",
      details: [],
    })

    const updated = await supplierOrderDAO.update(created._id, {
      statut: "Reçue",
    })

    expect(updated.statut).toBe("Reçue")
  })

  test("✅ delete : doit supprimer une commande", async () => {
    const created = await supplierOrderDAO.create({
      supplier_id: supplier._id,
      statut: "Reçue",
      details: [],
    })

    const deleted = await supplierOrderDAO.delete(created._id)
    expect(deleted).toBeDefined()

    const check = await SupplierOrder.findById(created._id)
    expect(check).toBeNull()
  })
})
