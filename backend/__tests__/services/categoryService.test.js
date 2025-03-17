import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import CategoryService from "../../services/categoryService.js"
import categoryDAO from "../../dao/categoryDAO.js"
import productDAO from "../../dao/productDAO.js"
import { jest } from "@jest/globals"

// 📌 Simuler MongoDB en mémoire
let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  if (!mongoUri) {
    throw new Error("⚠️ MongoDB URI non défini !")
  }

  console.log("🔹 URI MongoDB:", mongoUri)
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

// ✅ Correction des mocks DAO avec les bonnes méthodes
jest.mock("../../dao/categoryDAO.js")
categoryDAO.findAll = jest.fn()
categoryDAO.getById = jest.fn() // 🔥 Vérifie si c'est `findById` ou `getById`
categoryDAO.create = jest.fn()
categoryDAO.update = jest.fn()
categoryDAO.delete = jest.fn()
categoryDAO.findAssociatedProducts = jest.fn()

jest.mock("../../dao/productDAO.js")
productDAO.findByCategoryId = jest.fn()

describe("CategoryService", () => {
  /**
   * ✅ Test : Récupérer toutes les catégories
   */
  test("✅ getAllCategories : Récupère toutes les catégories", async () => {
    const mockCategories = [
      { _id: "cat1", name: "Électronique" },
      { _id: "cat2", name: "Vêtements" },
    ]
    categoryDAO.findAll.mockResolvedValue(mockCategories)

    const result = await CategoryService.getAllCategories()

    expect(categoryDAO.findAll).toHaveBeenCalled()
    expect(result).toEqual(mockCategories)
  })

  /**
   * ✅ Test : Récupérer une catégorie par ID
   */
  test("✅ getCategoryById : Récupère une catégorie existante", async () => {
    const mockCategory = { _id: "cat1", name: "Électronique" }
    categoryDAO.getById.mockResolvedValue(mockCategory)

    const result = await CategoryService.getCategoryById("cat1")

    expect(categoryDAO.getById).toHaveBeenCalledWith("cat1")
    expect(result).toEqual(mockCategory)
  })

  test("❌ getCategoryById : Erreur si la catégorie est introuvable", async () => {
    categoryDAO.getById.mockResolvedValue(null)

    await expect(CategoryService.getCategoryById("unknown")).rejects.toThrow(
      "Catégorie introuvable"
    )
  })

  /**
   * ✅ Test : Ajouter une catégorie
   */
  test("✅ addCategory : Ajoute une catégorie si elle n'existe pas", async () => {
    const newCategory = { name: "Maison" }
    categoryDAO.findAll.mockResolvedValue([])
    categoryDAO.create.mockResolvedValue({ _id: "cat3", ...newCategory })

    const result = await CategoryService.addCategory(newCategory)

    expect(categoryDAO.findAll).toHaveBeenCalled()
    expect(categoryDAO.create).toHaveBeenCalledWith(newCategory)
    expect(result).toEqual({ _id: "cat3", ...newCategory })
  })

  test("❌ addCategory : Erreur si la catégorie existe déjà", async () => {
    categoryDAO.findAll.mockResolvedValue([
      { _id: "cat1", name: "Électronique" },
    ])

    await expect(
      CategoryService.addCategory({ name: "Électronique" })
    ).rejects.toThrow("Cette catégorie existe déjà!")
  })

  /**
   * ✅ Test : Mettre à jour une catégorie
   */
  test("✅ updateCategory : Met à jour une catégorie si elle n'existe pas déjà", async () => {
    const updatedData = { name: "Maison et Jardin" }
    categoryDAO.findAll.mockResolvedValue([
      { _id: "cat1", name: "Électronique" },
    ])
    categoryDAO.update.mockResolvedValue({ _id: "cat1", ...updatedData })

    const result = await CategoryService.updateCategory("cat1", updatedData)

    expect(categoryDAO.findAll).toHaveBeenCalled()
    expect(categoryDAO.update).toHaveBeenCalledWith("cat1", updatedData)
    expect(result).toEqual({ _id: "cat1", ...updatedData })
  })

  /**
   * ✅ Test : Supprimer une catégorie
   */
  test("✅ deleteCategory : Supprime une catégorie si elle n'est pas utilisée", async () => {
    productDAO.findByCategoryId.mockResolvedValue([]) // ✅ Toujours un tableau vide
    categoryDAO.findAssociatedProducts.mockResolvedValue(false)
    categoryDAO.delete.mockResolvedValue({ _id: "cat1", name: "Électronique" })

    const result = await CategoryService.deleteCategory("cat1")

    expect(productDAO.findByCategoryId).toHaveBeenCalledWith("cat1")
    expect(categoryDAO.delete).toHaveBeenCalledWith("cat1")
    expect(result).toEqual({ _id: "cat1", name: "Électronique" })
  })

  test("❌ deleteCategory : Erreur si la catégorie est utilisée par des produits", async () => {
    productDAO.findByCategoryId.mockResolvedValue([
      { _id: "prod1", name: "Ordinateur" },
    ])
    categoryDAO.findAssociatedProducts.mockResolvedValue(true) // ✅ Elle est utilisée

    await expect(CategoryService.deleteCategory("cat1")).rejects.toThrow(
      "Impossible de supprimer cette catégorie, elle est encore utilisée par des produits."
    )

    expect(productDAO.findByCategoryId).toHaveBeenCalledWith("cat1")
    expect(categoryDAO.delete).not.toHaveBeenCalled() // ✅ Vérifie que `delete` n'est PAS appelé
  })

  test("❌ deleteCategory : Erreur si la catégorie est introuvable", async () => {
    productDAO.findByCategoryId.mockResolvedValue([]) // ✅ Toujours un tableau vide
    categoryDAO.findAssociatedProducts.mockResolvedValue(false) // ✅ La catégorie n'est PAS utilisée
    categoryDAO.delete.mockResolvedValue(null) // 🔥 Elle n'existe pas

    await expect(CategoryService.deleteCategory("unknown")).rejects.toThrow(
      "Catégorie introuvable"
    )

    expect(productDAO.findByCategoryId).toHaveBeenCalledWith("unknown")
    expect(categoryDAO.delete).toHaveBeenCalledWith("unknown")
  })
})
