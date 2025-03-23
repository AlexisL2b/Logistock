import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import SalesPointService from "../../services/salesPointService.js"
import salesPointDAO from "../../dao/salesPointDAO.js"
import userDAO from "../../dao/userDAO.js"
import { jest } from "@jest/globals"

// ✅ Mock manuel
salesPointDAO.findAll = jest.fn()
salesPointDAO.findById = jest.fn()
salesPointDAO.create = jest.fn()
salesPointDAO.update = jest.fn()
salesPointDAO.delete = jest.fn()
salesPointDAO.findWithoutUsers = jest.fn()

userDAO.findBySalesPointId = jest.fn()

// 📌 Mongo mémoire (optionnel ici mais prêt si tu veux l’activer plus tard)
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

beforeEach(() => {
  jest.clearAllMocks()
})

describe("📦 SalesPointService", () => {
  test("🔹 getAllSalesPoints : retourne tous les points", async () => {
    const mockPoints = [{ name: "A" }, { name: "B" }]
    salesPointDAO.findAll.mockResolvedValue(mockPoints)

    const result = await SalesPointService.getAllSalesPoints()
    expect(salesPointDAO.findAll).toHaveBeenCalled()
    expect(result).toEqual(mockPoints)
  })

  test("🔹 getSalesPointById : retourne un point existant", async () => {
    const mock = { _id: "1", name: "C" }
    salesPointDAO.findById.mockResolvedValue(mock)

    const result = await SalesPointService.getSalesPointById("1")
    expect(result).toEqual(mock)
  })

  test("❌ getSalesPointById : erreur si introuvable", async () => {
    salesPointDAO.findById.mockResolvedValue(null)

    await expect(SalesPointService.getSalesPointById("404")).rejects.toThrow(
      "Point de vente introuvable"
    )
  })

  test("✅ addSalesPoint : ajoute un point", async () => {
    const input = { name: "New", address: "1 rue A" }
    const mockSaved = { _id: "x", ...input }
    salesPointDAO.create.mockResolvedValue(mockSaved)

    const result = await SalesPointService.addSalesPoint(input)
    expect(salesPointDAO.create).toHaveBeenCalledWith(input)
    expect(result).toEqual(mockSaved)
  })

  test("❌ addSalesPoint : erreur si données incomplètes", async () => {
    await expect(
      SalesPointService.addSalesPoint({ name: "X" })
    ).rejects.toThrow("Les champs 'nom' et 'adresse' sont obligatoires")
  })

  test("✅ updateSalesPoint : met à jour un point", async () => {
    const id = "abc"
    const update = { name: "Modifié" }

    salesPointDAO.findById.mockResolvedValue({ _id: id })
    salesPointDAO.update.mockResolvedValue({ _id: id, ...update })

    const result = await SalesPointService.updateSalesPoint(id, update)
    expect(result.name).toBe("Modifié")
  })

  test("❌ updateSalesPoint : erreur si introuvable", async () => {
    salesPointDAO.findById.mockResolvedValue(null)

    await expect(
      SalesPointService.updateSalesPoint("id404", { name: "X" })
    ).rejects.toThrow("Point de vente introuvable")
  })

  test("✅ deleteSalesPoint : supprime un point sans utilisateurs", async () => {
    const id = "789"
    salesPointDAO.findById.mockResolvedValue({ _id: id })
    userDAO.findBySalesPointId.mockResolvedValue([])
    salesPointDAO.delete.mockResolvedValue({ _id: id })

    const result = await SalesPointService.deleteSalesPoint(id)
    expect(result._id).toBe(id)
  })

  test("❌ deleteSalesPoint : erreur si point utilisé", async () => {
    const id = "123"
    salesPointDAO.findById.mockResolvedValue({ _id: id })
    userDAO.findBySalesPointId.mockResolvedValue([
      { firstname: "Alice", lastname: "Dupont" },
    ])

    await expect(SalesPointService.deleteSalesPoint(id)).rejects.toThrow(
      /Alice Dupont/
    )
  })

  test("❌ deleteSalesPoint : erreur si point introuvable", async () => {
    salesPointDAO.findById.mockResolvedValue(null)

    await expect(SalesPointService.deleteSalesPoint("404")).rejects.toThrow(
      "Point de vente introuvable"
    )
  })

  test("✅ getSalesPointsWithoutUsers : retourne les points libres", async () => {
    const libres = [{ name: "Libre" }]
    salesPointDAO.findWithoutUsers.mockResolvedValue(libres)

    const result = await SalesPointService.getSalesPointsWithoutUsers()
    expect(result).toEqual(libres)
  })
})
