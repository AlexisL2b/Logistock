import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import ProductService from "../../services/productService.js"
import ProductDAO from "../../dao/productDAO.js"
import StockDAO from "../../dao/stockDAO.js"
import StockLogDAO from "../../dao/stockLogDAO.js"
import { jest } from "@jest/globals"

// 📌 Simuler MongoDB en mémoire
let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

beforeEach(() => {
  jest.clearAllMocks()
})

// ✅ Mocks des DAO
jest.mock("../../dao/productDAO.js")
ProductDAO.findAll = jest.fn()
ProductDAO.findById = jest.fn()
ProductDAO.findByReference = jest.fn()
ProductDAO.create = jest.fn()
ProductDAO.updateProduct = jest.fn()
ProductDAO.deleteProduct = jest.fn()

jest.mock("../../dao/stockDAO.js")
StockDAO.findByProductId = jest.fn()
StockDAO.createStock = jest.fn()
StockDAO.incrementStock = jest.fn()
StockDAO.deleteByProductId = jest.fn()

jest.mock("../../dao/stockLogDAO.js")
StockLogDAO.create = jest.fn()

describe("ProductService", () => {
  /**
   * ✅ Test : Récupérer tous les produits
   */
  test("✅ getAllProducts : Récupère tous les produits", async () => {
    const mockProducts = [
      { _id: "prod1", name: "Laptop" },
      { _id: "prod2", name: "Smartphone" },
    ]
    ProductDAO.findAll.mockResolvedValue(mockProducts)

    const result = await ProductService.getAllProducts()

    expect(ProductDAO.findAll).toHaveBeenCalled()
    expect(result).toEqual(mockProducts)
  })

  /**
   * ✅ Test : Récupérer un produit par ID
   */
  test("✅ getProductById : Récupère un produit existant", async () => {
    const mockProduct = { _id: "prod1", name: "Laptop" }
    ProductDAO.findById.mockResolvedValue(mockProduct)

    const result = await ProductService.getProductById("prod1")

    expect(ProductDAO.findById).toHaveBeenCalledWith("prod1")
    expect(result).toEqual(mockProduct)
  })

  test("❌ getProductById : Erreur si le produit est introuvable", async () => {
    ProductDAO.findById.mockResolvedValue(null)
    await expect(ProductService.getProductById("unknown")).rejects.toThrow(
      "Produit introuvable"
    )
  })

  /**
   * ✅ Test : Créer un produit
   */
  test("✅ createProduct : Crée un nouveau produit", async () => {
    const newProduct = {
      name: "Tablet",
      reference: "TAB123",
      price: 500,
      quantity: 10,
    }
    ProductDAO.findByReference.mockResolvedValue(null)
    ProductDAO.create.mockResolvedValue({ _id: "prod3", ...newProduct })
    StockDAO.createStock.mockResolvedValue({ _id: "stock1", quantity: 10 })

    const result = await ProductService.createProduct(newProduct)

    expect(ProductDAO.create).toHaveBeenCalled()
    expect(StockDAO.createStock).toHaveBeenCalled()
    expect(result.message).toBe("Produit et stock créés")
  })

  test("❌ createProduct : Retourne un message si le produit existe déjà", async () => {
    const existingProduct = {
      name: "Ordinateur Portable",
      reference: "LAPTOP123",
      price: 1500,
      category_id: "cat1",
      supplier_id: "sup1",
      quantity: 10,
    }

    ProductDAO.findByReference.mockResolvedValue(existingProduct)
    StockDAO.findByProductId.mockResolvedValue(null)

    const result = await ProductService.createProduct(existingProduct)

    expect(result).toEqual({
      message: "Produit existant, stock mis à jour",
      data: existingProduct,
    })
  })
  /**
   * ✅ Test : Mettre à jour un produit
   */
  test("✅ updateProduct : Met à jour un produit existant", async () => {
    const updatedProduct = {
      name: "Laptop Pro",
      reference: "LAPTOP123",
      price: 1200,
      category_id: "cat1",
      supplier_id: "sup1",
      description: "Un ordinateur portable haut de gamme",
    }

    ProductDAO.updateProduct.mockResolvedValue(updatedProduct)

    const result = await ProductService.updateProduct("prod1", updatedProduct)

    expect(ProductDAO.updateProduct).toHaveBeenCalledWith(
      "prod1",
      updatedProduct
    )
    expect(result).toEqual(updatedProduct)
  })

  test("❌ updateProduct : Erreur si le produit est introuvable", async () => {
    ProductDAO.updateProduct.mockResolvedValue(null)
    await expect(ProductService.updateProduct("unknown", {})).rejects.toThrow(
      "Échec de la mise à jour. Produit introuvable avec l'ID: unknown"
    )
  })

  /**
   * ✅ Test : Supprimer un produit
   */
  test("✅ deleteProduct : Supprime un produit existant", async () => {
    ProductDAO.deleteProduct.mockResolvedValue(true)
    StockDAO.findByProductId.mockResolvedValue({ _id: "stock1" })
    StockDAO.deleteByProductId.mockResolvedValue(true)
    StockLogDAO.create.mockResolvedValue(true)

    const result = await ProductService.deleteProduct("prod1")

    expect(ProductDAO.deleteProduct).toHaveBeenCalledWith("prod1")
    expect(result.message).toBe("Produit supprimé avec succès")
  })

  test("❌ deleteProduct : Erreur si le produit est introuvable", async () => {
    ProductDAO.deleteProduct.mockResolvedValue(null)
    await expect(ProductService.deleteProduct("unknown")).rejects.toThrow(
      "Échec de la suppression. Produit introuvable avec l'ID: unknown"
    )
  })
})
