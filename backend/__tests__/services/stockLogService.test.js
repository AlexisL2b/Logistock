import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import StockLogService from "../../services/stockLogService.js"
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

// ✅ Mock des DAO
jest.mock("../../dao/stockLogDAO.js")
StockLogDAO.findAll = jest.fn()
StockLogDAO.findById = jest.fn()
StockLogDAO.create = jest.fn()
StockLogDAO.update = jest.fn()
StockLogDAO.delete = jest.fn()

describe("StockLogService", () => {
  /**
   * ✅ Test : Récupérer tous les logs de stock
   */
  test("✅ getAllStockLogs : Récupère tous les logs de stock", async () => {
    const mockLogs = [
      { _id: "log1", product_id: "prod1", quantity: 10, event: "ajout" },
      { _id: "log2", product_id: "prod2", quantity: 5, event: "retrait" },
    ]
    StockLogDAO.findAll.mockResolvedValue(mockLogs)

    const result = await StockLogService.getAllStockLogs()

    expect(StockLogDAO.findAll).toHaveBeenCalled()
    expect(result).toEqual(mockLogs)
  })

  /**
   * ✅ Test : Récupérer un log de stock par ID
   */
  test("✅ getStockLogById : Récupère un log de stock existant", async () => {
    const mockLog = {
      _id: "log1",
      product_id: "prod1",
      quantity: 10,
      event: "ajout",
    }
    StockLogDAO.findById.mockResolvedValue(mockLog)

    const result = await StockLogService.getStockLogById("log1")

    expect(StockLogDAO.findById).toHaveBeenCalledWith("log1")
    expect(result).toEqual(mockLog)
  })

  test("❌ getStockLogById : Erreur si le log de stock est introuvable", async () => {
    StockLogDAO.findById.mockResolvedValue(null)

    await expect(StockLogService.getStockLogById("unknown")).rejects.toThrow(
      "Log de stock introuvable"
    )
  })

  /**
   * ✅ Test : Ajouter un log de stock
   */
  test("✅ addStockLog : Ajoute un log de stock", async () => {
    const newLog = { product_id: "prod1", quantity: 10, event: "ajout" }
    StockLogDAO.create.mockResolvedValue({ _id: "log1", ...newLog })

    const result = await StockLogService.addStockLog(newLog)

    expect(StockLogDAO.create).toHaveBeenCalledWith(newLog)
    expect(result).toEqual({ _id: "log1", ...newLog })
  })

  test("❌ addStockLog : Erreur si un champ requis est manquant", async () => {
    await expect(StockLogService.addStockLog({})).rejects.toThrow(
      "Tous les champs 'product_id', 'quantity' et 'event' sont requis"
    )
  })

  /**
   * ✅ Test : Mettre à jour un log de stock
   */
  test("✅ updateStockLog : Met à jour un log de stock existant", async () => {
    const updatedLog = {
      _id: "log1",
      product_id: "prod1",
      quantity: 15,
      event: "ajout",
    }
    StockLogDAO.update.mockResolvedValue(updatedLog)

    const result = await StockLogService.updateStockLog("log1", updatedLog)

    expect(StockLogDAO.update).toHaveBeenCalledWith("log1", updatedLog)
    expect(result).toEqual(updatedLog)
  })

  test("❌ updateStockLog : Erreur si le log de stock est introuvable", async () => {
    StockLogDAO.update.mockResolvedValue(null)

    await expect(
      StockLogService.updateStockLog("unknown", { quantity: 20 })
    ).rejects.toThrow("Log de stock introuvable")
  })

  /**
   * ✅ Test : Supprimer un log de stock
   */
  test("✅ deleteStockLog : Supprime un log de stock existant", async () => {
    StockLogDAO.delete.mockResolvedValue({
      _id: "log1",
      product_id: "prod1",
      quantity: 10,
      event: "ajout",
    })

    const result = await StockLogService.deleteStockLog("log1")

    expect(StockLogDAO.delete).toHaveBeenCalledWith("log1")
    expect(result).toEqual({
      _id: "log1",
      product_id: "prod1",
      quantity: 10,
      event: "ajout",
    })
  })

  test("❌ deleteStockLog : Erreur si le log de stock est introuvable", async () => {
    StockLogDAO.delete.mockResolvedValue(null)

    await expect(StockLogService.deleteStockLog("unknown")).rejects.toThrow(
      "Log de stock introuvable"
    )
  })
})
