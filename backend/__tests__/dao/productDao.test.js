import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Product from "../../models/productModel.js"
import Stock from "../../models/stockModel.js"
import Category from "../../models/categoryModel.js"
import Supplier from "../../models/supplierModel.js"
import productDAO from "../../dao/productDAO.js"

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
  await Stock.deleteMany()
  await Category.deleteMany()
  await Supplier.deleteMany()
})

describe("ProductDAO", () => {
  test("doit créer un produit", async () => {
    const category = await Category.create({ name: "Papeterie" })
    const supplier = await Supplier.create({ name: "Fournisseur A" })

    const productData = {
      name: "Stylo",
      reference: "STY001",
      description: "Stylo bleu bille",
      price: 2,
      category_id: category._id,
      supplier_id: supplier._id,
    }

    const product = await productDAO.create(productData)

    expect(product._id).toBeDefined()
    expect(product.name).toBe("Stylo")
    expect(product.reference).toBe("STY001")
  })

  test("doit retrouver un produit par sa référence", async () => {
    const category = await Category.create({ name: "Papeterie" })
    const supplier = await Supplier.create({ name: "Fournisseur A" })

    await productDAO.create({
      name: "Crayon",
      reference: "CRY001",
      description: "Crayon HB",
      price: 1,
      category_id: category._id,
      supplier_id: supplier._id,
    })

    const found = await productDAO.findByReference("CRY001")
    expect(found).toBeDefined()
    expect(found.name).toBe("Crayon")
  })

  test("doit récupérer tous les produits avec leur stock", async () => {
    const category = await Category.create({ name: "Mobilier" })
    const supplier = await Supplier.create({ name: "Fournisseur B" })

    const product = await productDAO.create({
      name: "Chaise",
      reference: "CHA123",
      description: "Chaise de bureau",
      price: 80,
      category_id: category._id,
      supplier_id: supplier._id,
    })

    await Stock.create({ product_id: product._id, quantity: 15 })

    const all = await productDAO.findAll()
    expect(all.length).toBe(1)
    expect(all[0].name).toBe("Chaise")
    expect(all[0].quantity).toBe(15)
  })

  test("doit retrouver les produits par ID de catégorie", async () => {
    const category = await Category.create({ name: "Informatique" })
    const supplier = await Supplier.create({ name: "Fournisseur X" })

    await productDAO.create({
      name: "Écran",
      reference: "SCR001",
      description: "Écran 24 pouces",
      price: 200,
      category_id: category._id,
      supplier_id: supplier._id,
    })

    const result = await productDAO.findByCategoryId(category._id)
    expect(result.length).toBe(1)
    expect(result[0].name).toBe("Écran")
  })

  test("doit lancer une erreur si l'ID de catégorie est invalide", async () => {
    await expect(productDAO.findByCategoryId("invalid-id")).rejects.toThrow(
      "ID de catégorie invalide."
    )
  })

  test("doit retrouver les produits par ID de fournisseur", async () => {
    const category = await Category.create({ name: "Son" })
    const supplier = await Supplier.create({ name: "Fournisseur Z" })

    await productDAO.create({
      name: "Casque",
      reference: "CAS999",
      description: "Casque audio",
      price: 70,
      category_id: category._id,
      supplier_id: supplier._id,
    })

    const result = await productDAO.findBySupplierId(supplier._id)
    expect(result.length).toBe(1)
    expect(result[0].name).toBe("Casque")
  })

  test("doit mettre à jour un produit", async () => {
    const category = await Category.create({ name: "Divers" })
    const supplier = await Supplier.create({ name: "Fournisseur Y" })

    const product = await productDAO.create({
      name: "Clé USB",
      reference: "USB01",
      description: "16 Go",
      price: 10,
      category_id: category._id,
      supplier_id: supplier._id,
    })

    const updated = await productDAO.updateProduct(product._id, {
      name: "Clé USB 32 Go",
    })

    expect(updated.name).toBe("Clé USB 32 Go")
  })

  test("doit supprimer un produit", async () => {
    const category = await Category.create({ name: "Archives" })
    const supplier = await Supplier.create({ name: "Fournisseur R" })

    const product = await productDAO.create({
      name: "Boîte de rangement",
      reference: "BOX001",
      description: "Carton rigide",
      price: 5,
      category_id: category._id,
      supplier_id: supplier._id,
    })

    const deleted = await productDAO.deleteProduct(product._id)
    expect(deleted._id.toString()).toBe(product._id.toString())

    const found = await Product.findById(product._id)
    expect(found).toBeNull()
  })
})
