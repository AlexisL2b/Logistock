import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import StockService from "../../services/stockService.js"
import StockDAO from "../../dao/stockDAO.js"
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
jest.mock("../../dao/stockDAO.js")
StockDAO.findAll = jest.fn()
StockDAO.findAllWithProducts = jest.fn()
StockDAO.findById = jest.fn()
StockDAO.findByProductId = jest.fn()
StockDAO.create = jest.fn()
StockDAO.update = jest.fn()
StockDAO.updateByProductId = jest.fn()
StockDAO.delete = jest.fn()
StockDAO.incrementStock = jest.fn()

describe("StockService", () => {
  /**
   * ✅ Test : Récupérer tous les stocks
   */
  test("✅ getAllStocks : Récupère tous les stocks", async () => {
    const mockStocks = [
      { _id: "stock1", product_id: "prod1", quantity: 10 },
      { _id: "stock2", product_id: "prod2", quantity: 5 },
    ]
    StockDAO.findAll.mockResolvedValue(mockStocks)

    const result = await StockService.getAllStocks()

    expect(StockDAO.findAll).toHaveBeenCalled()
    expect(result).toEqual(mockStocks)
  })

  test("✅ getAllStocksWithProducts : Récupère tous les stocks avec produits", async () => {
    const mockStocks = [
      {
        _id: "stock1",
        product: { _id: "prod1", name: "Produit A" },
        quantity: 10,
      },
      {
        _id: "stock2",
        product: { _id: "prod2", name: "Produit B" },
        quantity: 5,
      },
    ]
    StockDAO.findAllWithProducts.mockResolvedValue(mockStocks)

    const result = await StockService.getAllStocksWithProducts()

    expect(StockDAO.findAllWithProducts).toHaveBeenCalled()
    expect(result).toEqual(mockStocks)
  })

  /**
   * ✅ Test : Récupérer un stock par ID
   */
  test("✅ getStockById : Récupère un stock existant", async () => {
    const mockStock = { _id: "stock1", product_id: "prod1", quantity: 10 }
    StockDAO.findById.mockResolvedValue(mockStock)

    const result = await StockService.getStockById("stock1")

    expect(StockDAO.findById).toHaveBeenCalledWith("stock1")
    expect(result).toEqual(mockStock)
  })

  test("❌ getStockById : Erreur si le stock est introuvable", async () => {
    StockDAO.findById.mockResolvedValue(null)

    await expect(StockService.getStockById("unknown")).rejects.toThrow(
      "Stock introuvable"
    )
  })

  /**
   * ✅ Test : Vérifier la disponibilité du stock pour une commande
   */
  test("✅ checkStockAvailability : Vérifie la disponibilité du stock", async () => {
    const orderDetails = [{ product_id: "prod1", quantity: 5 }]
    StockDAO.findByProductId.mockResolvedValue({ _id: "stock1", quantity: 10 })

    const result = await StockService.checkStockAvailability(orderDetails)

    expect(result.insufficientStock.length).toBe(0)
  })

  test("❌ checkStockAvailability : Stock insuffisant", async () => {
    const orderDetails = [{ product_id: "prod1", quantity: 20 }]
    StockDAO.findByProductId.mockResolvedValue({ _id: "stock1", quantity: 10 })

    const result = await StockService.checkStockAvailability(orderDetails)

    expect(result.insufficientStock.length).toBe(1)
  })

  /**
   * ✅ Test : Ajouter un stock
   */
  test("✅ addStock : Ajoute un stock", async () => {
    const newStock = { product_id: "prod1", quantity: 10 }
    StockDAO.create.mockResolvedValue({ _id: "stock1", ...newStock })

    const result = await StockService.addStock(newStock)

    expect(StockDAO.create).toHaveBeenCalledWith(newStock)
    expect(result).toEqual({ _id: "stock1", ...newStock })
  })

  test("❌ addStock : Erreur si le champ 'product_id' est manquant", async () => {
    await expect(StockService.addStock({ quantity: 10 })).rejects.toThrow(
      "Le champ 'product_id' est requis"
    )
  })

  /**
   * ✅ Test : Mettre à jour un stock
   */
  test("✅ updateStock : Met à jour un stock existant", async () => {
    const updatedStock = { _id: "stock1", product_id: "prod1", quantity: 15 }
    StockDAO.update.mockResolvedValue(updatedStock)

    const result = await StockService.updateStock("stock1", updatedStock)

    expect(StockDAO.update).toHaveBeenCalledWith("stock1", updatedStock)
    expect(result).toEqual(updatedStock)
  })

  test("❌ updateStock : Erreur si le stock est introuvable", async () => {
    StockDAO.update.mockResolvedValue(null)

    await expect(StockService.updateStock("unknown", {})).rejects.toThrow(
      "Stock introuvable"
    )
  })

  /**
   * ✅ Test : Supprimer un stock
   */
  test("✅ deleteStock : Supprime un stock existant", async () => {
    StockDAO.delete.mockResolvedValue({
      _id: "stock1",
      product_id: "prod1",
      quantity: 10,
    })

    const result = await StockService.deleteStock("stock1")

    expect(StockDAO.delete).toHaveBeenCalledWith("stock1")
    expect(result).toEqual({ _id: "stock1", product_id: "prod1", quantity: 10 })
  })

  test("❌ deleteStock : Erreur si le stock est introuvable", async () => {
    StockDAO.delete.mockResolvedValue(null)

    await expect(StockService.deleteStock("unknown")).rejects.toThrow(
      "Stock introuvable"
    )
  })

  /**
   * ✅ Test : Incrémenter un stock
   */
  test("✅ incrementStock : Incrémente un stock", async () => {
    const incrementedStock = {
      _id: "stock1",
      product_id: "prod1",
      quantity: 20,
    }
    StockDAO.incrementStock.mockResolvedValue(incrementedStock)

    const result = await StockService.incrementStock("stock1", 10)

    expect(StockDAO.incrementStock).toHaveBeenCalledWith("stock1", 10)
    expect(result).toEqual(incrementedStock)
  })

  test("❌ incrementStock : Erreur si le stock est introuvable", async () => {
    StockDAO.incrementStock.mockResolvedValue(null)

    await expect(StockService.incrementStock("unknown", 10)).rejects.toThrow(
      "Stock introuvable"
    )
  })
  test("❌ checkStockAvailability : Erreur si orderDetails n'est pas un tableau", async () => {
    await expect(
      StockService.checkStockAvailability("invalid")
    ).rejects.toThrow("Les détails de la commande doivent être un tableau.")
  })
  test("✅ updateStockByProductId : Met à jour un stock avec product_id", async () => {
    const updatedStock = { _id: "stock1", product_id: "prod1", quantity: 20 }
    StockDAO.updateByProductId.mockResolvedValue(updatedStock)

    const result = await StockService.updateStockByProductId(
      "prod1",
      updatedStock
    )

    expect(StockDAO.updateByProductId).toHaveBeenCalledWith(
      "prod1",
      updatedStock
    )
    expect(result).toEqual(updatedStock)
  })

  test("❌ updateStockByProductId : Erreur si le stock est introuvable", async () => {
    StockDAO.updateByProductId.mockResolvedValue(null)

    await expect(
      StockService.updateStockByProductId("unknown", {})
    ).rejects.toThrow("Stock introuvable pour ce produit")
  })
  test("✅ decrementStockForOrder : Diminue le stock après commande", async () => {
    const mockIo = { emit: jest.fn() }
    const orderDetails = [{ product_id: "prod1", quantity: 5 }]

    StockDAO.findByProductId.mockResolvedValue({
      _id: "stock1",
      product_id: "prod1",
      quantity: 10,
      save: jest.fn(),
    })

    const result = await StockService.decrementStockForOrder(
      orderDetails,
      mockIo
    )

    expect(StockDAO.findByProductId).toHaveBeenCalledWith("prod1")
    expect(mockIo.emit).toHaveBeenCalledWith("stocksUpdated", [
      { product_id: "prod1", quantity: 5, stockId: "stock1" },
    ])
    expect(result).toEqual({
      success: true,
      message: "Stocks mis à jour",
      updatedStocks: [{ product_id: "prod1", quantity: 5, stockId: "stock1" }],
    })
  })
})
