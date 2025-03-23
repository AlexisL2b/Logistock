import categoryController from "../../controllers/categoryController.js"
import categoryService from "../../services/categoryService.js"
import { jest } from "@jest/globals"

jest.mock("../../services/categoryService.js")

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}
describe("categoryController", () => {
  beforeEach(() => {
    // 🛠️ Mock manuel de chaque méthode
    categoryService.getAllCategories = jest.fn()
    categoryService.getCategoryById = jest.fn()
    categoryService.addCategory = jest.fn()
    categoryService.updateCategory = jest.fn()
    categoryService.deleteCategory = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("getAll", () => {
    it("should return all categories", async () => {
      const mockCategories = [{ name: "Papeterie" }]
      categoryService.getAllCategories.mockResolvedValue(mockCategories)

      const req = {}
      const res = mockRes()

      await categoryController.getAll(req, res)

      expect(categoryService.getAllCategories).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(mockCategories)
    })

    it("should handle errors", async () => {
      const req = {}
      const res = mockRes()
      categoryService.getAllCategories.mockRejectedValue(new Error("Erreur"))

      await categoryController.getAll(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur" })
    })
  })

  describe("getById", () => {
    it("should return a category by ID", async () => {
      const mockCategory = { name: "Mobilier" }
      categoryService.getCategoryById.mockResolvedValue(mockCategory)

      const req = { params: { id: "123" } }
      const res = mockRes()

      await categoryController.getById(req, res)

      expect(categoryService.getCategoryById).toHaveBeenCalledWith("123")
      expect(res.json).toHaveBeenCalledWith({
        message: "Catégorie récupérée avec succès",
        data: mockCategory,
      })
    })

    it("should handle not found", async () => {
      categoryService.getCategoryById.mockRejectedValue(
        new Error("Introuvable")
      )
      const req = { params: { id: "unknown" } }
      const res = mockRes()

      await categoryController.getById(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: "Introuvable" })
    })
  })

  describe("create", () => {
    it("should create a new category", async () => {
      const newCat = { name: "Fournitures" }
      categoryService.addCategory.mockResolvedValue(newCat)

      const req = { body: newCat }
      const res = mockRes()

      await categoryController.create(req, res)

      expect(categoryService.addCategory).toHaveBeenCalledWith(newCat)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: "Catégorie ajoutée avec succès",
        data: newCat,
      })
    })

    it("should handle validation error", async () => {
      categoryService.addCategory.mockRejectedValue(new Error("Invalide"))
      const req = { body: {} }
      const res = mockRes()

      await categoryController.create(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: "Invalide" })
    })
  })

  describe("update", () => {
    it("should update a category", async () => {
      const updated = { name: "Modifié" }
      categoryService.updateCategory.mockResolvedValue(updated)

      const req = { params: { id: "abc" }, body: updated }
      const res = mockRes()

      await categoryController.update(req, res)

      expect(categoryService.updateCategory).toHaveBeenCalledWith(
        "abc",
        updated
      )
      expect(res.json).toHaveBeenCalledWith({
        message: "Catégorie mise à jour avec succès",
        data: updated,
      })
    })

    it("should handle not found", async () => {
      categoryService.updateCategory.mockRejectedValue(new Error("Pas trouvé"))
      const req = { params: { id: "xxx" }, body: {} }
      const res = mockRes()

      await categoryController.update(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: "Pas trouvé" })
    })
  })

  describe("remove", () => {
    it("should delete a category", async () => {
      const deleted = { _id: "xyz", name: "Supprimée" }
      categoryService.deleteCategory.mockResolvedValue(deleted)

      const req = { params: { id: "xyz" } }
      const res = mockRes()

      await categoryController.remove(req, res)

      expect(categoryService.deleteCategory).toHaveBeenCalledWith("xyz")
      expect(res.json).toHaveBeenCalledWith({
        message: "Catégorie supprimée avec succès",
        data: deleted,
      })
    })

    it("should handle deletion error", async () => {
      categoryService.deleteCategory.mockRejectedValue(
        new Error("Erreur suppression")
      )
      const req = { params: { id: "invalid" } }
      const res = mockRes()

      await categoryController.remove(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur suppression" })
    })
  })
})
