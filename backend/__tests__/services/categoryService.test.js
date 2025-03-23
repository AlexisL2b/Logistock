import categoryService from "../../services/categoryService.js"
import categoryDAO from "../../dao/categoryDAO.js"
import productDAO from "../../dao/productDAO.js"
import { jest } from "@jest/globals"

beforeEach(() => {
  // 🎯 Mocks manuels
  categoryDAO.findAll = jest.fn()
  categoryDAO.getById = jest.fn()
  categoryDAO.create = jest.fn()
  categoryDAO.update = jest.fn()
  categoryDAO.delete = jest.fn()
  productDAO.findByCategoryId = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("categoryService", () => {
  describe("getAllCategories", () => {
    test("devrait retourner toutes les catégories", async () => {
      const mockCategories = [{ name: "Papeterie" }]
      categoryDAO.findAll.mockResolvedValue(mockCategories)

      const result = await categoryService.getAllCategories()
      expect(result).toEqual(mockCategories)
    })
  })

  describe("getCategoryById", () => {
    test("devrait retourner une catégorie par ID", async () => {
      const category = { name: "Informatique" }
      categoryDAO.getById.mockResolvedValue(category)

      const result = await categoryService.getCategoryById("123")
      expect(result).toEqual(category)
    })

    test("devrait lever une erreur si la catégorie n'existe pas", async () => {
      categoryDAO.getById.mockResolvedValue(null)

      await expect(categoryService.getCategoryById("xxx")).rejects.toThrow(
        "Catégorie introuvable"
      )
    })
  })

  describe("addCategory", () => {
    test("devrait créer une catégorie si elle n'existe pas encore", async () => {
      const newCat = { name: "Fournitures" }
      categoryDAO.findAll.mockResolvedValue([])
      categoryDAO.create.mockResolvedValue({ ...newCat, _id: "abc123" })

      const result = await categoryService.addCategory(newCat)
      expect(categoryDAO.create).toHaveBeenCalledWith(newCat)
      expect(result).toHaveProperty("_id", "abc123")
    })

    test("devrait lever une erreur si le nom est manquant", async () => {
      await expect(categoryService.addCategory({})).rejects.toThrow(
        "Le champ 'nom' est requis"
      )
    })

    test("devrait lever une erreur si la catégorie existe déjà", async () => {
      categoryDAO.findAll.mockResolvedValue([{ name: "Papeterie" }])

      await expect(
        categoryService.addCategory({ name: "Papeterie" })
      ).rejects.toThrow("Cette catégorie existe déjà!")
    })
  })

  describe("updateCategory", () => {
    test("devrait mettre à jour une catégorie si le nom est unique", async () => {
      const updated = { name: "Modifiée" }
      categoryDAO.findAll.mockResolvedValue([{ name: "Ancienne" }])
      categoryDAO.update.mockResolvedValue(updated)

      const result = await categoryService.updateCategory("id123", updated)
      expect(categoryDAO.update).toHaveBeenCalledWith("id123", updated)
      expect(result).toEqual(updated)
    })

    test("devrait lever une erreur si le nouveau nom existe déjà", async () => {
      categoryDAO.findAll.mockResolvedValue([{ name: "Déjà existante" }])

      await expect(
        categoryService.updateCategory("id", { name: "Déjà existante" })
      ).rejects.toThrow("Cette catégorie existe déjà!")
    })
  })

  describe("deleteCategory", () => {
    test("devrait supprimer une catégorie si elle n'est pas utilisée", async () => {
      productDAO.findByCategoryId.mockResolvedValue([])
      categoryDAO.delete.mockResolvedValue({ _id: "cat123" })

      const result = await categoryService.deleteCategory("cat123")
      expect(result).toHaveProperty("_id", "cat123")
    })

    test("devrait lever une erreur si des produits utilisent la catégorie", async () => {
      productDAO.findByCategoryId.mockResolvedValue([
        { name: "Produit 1" },
        { name: "Produit 2" },
      ])

      await expect(categoryService.deleteCategory("cat123")).rejects.toThrow(
        "Impossible de supprimer cette catégorie, elle est encore utilisée par des produits."
      )
    })

    test("devrait lever une erreur si la suppression échoue", async () => {
      productDAO.findByCategoryId.mockResolvedValue([])
      categoryDAO.delete.mockResolvedValue(null)

      await expect(categoryService.deleteCategory("cat999")).rejects.toThrow(
        "Catégorie introuvable"
      )
    })
  })
})
