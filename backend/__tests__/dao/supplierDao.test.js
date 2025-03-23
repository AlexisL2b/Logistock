import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import SupplierDAO from "../../dao/supplierDAO.js"
import Supplier from "../../models/supplierModel.js"
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
  await Supplier.deleteMany()
  await Product.deleteMany()
})

describe("🧪 SupplierDAO", () => {
  test("✅ create : doit créer un fournisseur", async () => {
    const supplierData = { name: "Fournisseur X", email: "x@mail.com" }
    const result = await SupplierDAO.create(supplierData)

    expect(result._id).toBeDefined()
    expect(result.name).toBe("Fournisseur X")
    expect(result.email).toBe("x@mail.com")
  })

  test("✅ findAll : doit retourner tous les fournisseurs", async () => {
    await Supplier.create({ name: "F1" })
    await Supplier.create({ name: "F2" })

    const result = await SupplierDAO.findAll()
    expect(result.length).toBe(2)
    expect(result.map((s) => s.name)).toEqual(
      expect.arrayContaining(["F1", "F2"])
    )
  })

  test("✅ findById : doit retourner un fournisseur par ID", async () => {
    const supplier = await Supplier.create({ name: "F3" })
    const result = await SupplierDAO.findById(supplier._id)

    expect(result).toBeDefined()
    expect(result.name).toBe("F3")
  })

  test("✅ update : doit mettre à jour un fournisseur", async () => {
    const supplier = await Supplier.create({ name: "Old Name" })
    const result = await SupplierDAO.update(supplier._id, { name: "New Name" })

    expect(result.name).toBe("New Name")
  })

  test("✅ delete : doit supprimer un fournisseur", async () => {
    const supplier = await Supplier.create({ name: "To Delete" })
    const deleted = await SupplierDAO.delete(supplier._id)

    expect(deleted._id.toString()).toBe(supplier._id.toString())
    const found = await Supplier.findById(supplier._id)
    expect(found).toBeNull()
  })

  test("✅ findAssociatedProducts : doit retourner les produits liés à un fournisseur", async () => {
    const supplier = await Supplier.create({ name: "Fournisseur Produits" })

    await Product.create({
      name: "Produit A",
      reference: "PA123",
      price: 10,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: supplier._id,
      description: "Description d'un produit",
    })

    await Product.create({
      name: "Produit B",
      reference: "PB123",
      price: 20,
      category_id: new mongoose.Types.ObjectId(),
      supplier_id: supplier._id,
      description: "Description d'un produit",
    })

    const result = await SupplierDAO.findAssociatedProducts(supplier._id)

    expect(result.length).toBe(2)
    expect(result.map((p) => p.name)).toEqual(
      expect.arrayContaining(["Produit A", "Produit B"])
    )
  })
})
