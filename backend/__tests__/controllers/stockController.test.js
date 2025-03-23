import * as stockController from "../../controllers/stockController.js"
import stockService from "../../services/stockService.js"
import { jest } from "@jest/globals"

describe("StockController (mocks manuels)", () => {
  let req
  let res

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      io: { emit: jest.fn() },
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  test("getAllStocks : doit retourner tous les stocks", async () => {
    stockService.getAllStocks = jest
      .fn()
      .mockResolvedValue([{ product_id: "p1", quantity: 10 }])

    await stockController.getAllStocks(req, res)

    expect(res.json).toHaveBeenCalledWith({
      message: "Stocks récupérés avec succès",
      data: [{ product_id: "p1", quantity: 10 }],
    })
  })

  test("getStockById : doit retourner un stock", async () => {
    req.params.id = "stockId"
    stockService.getStockById = jest
      .fn()
      .mockResolvedValue({ _id: "stockId", quantity: 5 })

    await stockController.getStockById(req, res)

    expect(res.json).toHaveBeenCalledWith({
      message: "Stock récupéré avec succès",
      data: { _id: "stockId", quantity: 5 },
    })
  })

  test("addStock : doit ajouter un stock", async () => {
    req.body = { product_id: "prod1", quantity: 12 }
    const stock = { _id: "s1", product_id: "prod1", quantity: 12 }
    stockService.addStock = jest.fn().mockResolvedValue(stock)

    await stockController.addStock(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: "Stock ajouté avec succès",
      data: stock,
    })
  })

  test("updateStock : doit modifier un stock", async () => {
    req.params.id = "stock1"
    req.body = { quantity: 99 }
    const updated = { _id: "stock1", quantity: 99 }
    stockService.updateStock = jest.fn().mockResolvedValue(updated)

    await stockController.updateStock(req, res)

    expect(res.json).toHaveBeenCalledWith({
      message: "Stock mis à jour avec succès",
      data: updated,
    })
  })

  test("deleteStock : doit supprimer un stock", async () => {
    req.params.id = "stock1"
    stockService.deleteStock = jest.fn().mockResolvedValue({ _id: "stock1" })

    await stockController.deleteStock(req, res)

    expect(res.json).toHaveBeenCalledWith({
      message: "Stock supprimé avec succès",
      data: { _id: "stock1" },
    })
  })

  test("incrementStock : doit incrémenter un stock", async () => {
    req.params.id = "stock1"
    req.body.quantity = 5
    const stock = { _id: "stock1", quantity: 15 }

    stockService.incrementStock = jest.fn().mockResolvedValue(stock)

    await stockController.incrementStock(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(stock)
  })

  test("decrementStockForOrder : doit décrémenter le stock et émettre via socket", async () => {
    req.body.orderDetails = [{ product_id: "p1", quantity: 2 }]
    const result = {
      success: true,
      updatedStocks: [{ product_id: "p1", quantity: 8 }],
    }

    stockService.decrementStockForOrder = jest.fn().mockResolvedValue(result)

    await stockController.decrementStockForOrder(req, res)

    expect(res.json).toHaveBeenCalledWith(result)
  })

  test("checkStockAvailability : doit vérifier le stock", async () => {
    req.body.orderDetails = [{ product_id: "p1", quantity: 3 }]
    const response = { insufficientStock: [] }

    stockService.checkStockAvailability = jest.fn().mockResolvedValue(response)

    await stockController.checkStockAvailability(req, res)

    expect(res.json).toHaveBeenCalledWith(response)
  })

  test("getStocksWithProducts : doit retourner les stocks avec produits", async () => {
    const mockResult = [{ product_id: { name: "Clavier" }, quantity: 12 }]
    stockService.getAllStocksWithProducts = jest
      .fn()
      .mockResolvedValue(mockResult)

    await stockController.getStocksWithProducts(req, res)

    expect(res.json).toHaveBeenCalledWith({
      message: "Stock.Products récupérés avec succès ",
      data: mockResult,
    })
  })

  test("updateStockByProductId : met à jour un stock via product_id", async () => {
    req.params.product_id = "p1"
    req.body = { quantity: 99 }

    stockService.updateStockByProductId = jest
      .fn()
      .mockResolvedValue({ _id: "s1", product_id: "p1", quantity: 99 })

    await stockController.updateStockByProductId(req, res)

    expect(res.json).toHaveBeenCalledWith({
      message: "Stock mis à jour avec succès pour le produit",
      data: { _id: "s1", product_id: "p1", quantity: 99 },
    })
  })
})
