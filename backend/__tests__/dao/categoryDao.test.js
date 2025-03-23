import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Category from "../../models/categoryModel.js"
import Product from "../../models/productModel.js"
import categoryDAO from "../../dao/categoryDAO.js"

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
  await Category.deleteMany()
  await Product.deleteMany()
})

describe("CategoryDAO", () => {
  test("devrait créer une catégorie", async () => {
    const category = await categoryDAO.create({ name: "Papeterie" })
    expect(category).toBeDefined()
    expect(category.name).toBe("Papeterie")
  })

  test("devrait retourner toutes les catégories", async () => {
    await categoryDAO.create({ name: "Papeterie" })
    await categoryDAO.create({ name: "Mobilier" })
    const categories = await categoryDAO.findAll()
    expect(categories.length).toBe(2)
  })

  test("devrait retrouver une catégorie par ID", async () => {
    const created = await categoryDAO.create({ name: "Informatique" })
    const found = await categoryDAO.getById(created._id)
    expect(found.name).toBe("Informatique")
  })

  test("devrait mettre à jour une catégorie", async () => {
    const created = await categoryDAO.create({ name: "Ancien nom" })
    const updated = await categoryDAO.update(created._id, {
      name: "Nouveau nom",
    })
    expect(updated.name).toBe("Nouveau nom")
  })

  test("devrait détecter les produits associés à une catégorie", async () => {
    const category = await categoryDAO.create({ name: "Tech" })
    await Product.create({
      name: "Imprimante",
      reference: "IMP001",
      price: 250,
      description: "Imprimante laser couleur",
      category_id: category._id,
      supplier_id: new mongoose.Types.ObjectId(),
    })

    const isUsed = await categoryDAO.findAssociatedProducts(category._id)
    expect(isUsed).toBe(true)
  })

  test("ne devrait pas supprimer une catégorie utilisée par un produit", async () => {
    const category = await categoryDAO.create({ name: "Impression" })
    await Product.create({
      name: "Imprimante",
      reference: "IMP001",
      price: 250,
      description: "Imprimante laser couleur",
      category_id: category._id,
      supplier_id: new mongoose.Types.ObjectId(),
    })

    await expect(categoryDAO.delete(category._id)).rejects.toThrow(
      "Impossible de supprimer cette catégorie"
    )
  })

  test("devrait supprimer une catégorie non utilisée", async () => {
    const category = await categoryDAO.create({ name: "Jetable" })
    const deleted = await categoryDAO.delete(category._id)
    expect(deleted._id.toString()).toBe(category._id.toString())
  })
})
