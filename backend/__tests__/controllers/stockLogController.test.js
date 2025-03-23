import stockLogController from "../../controllers/stockLogController.js"
import stockLogService from "../../services/stockLogService.js"
import { jest } from "@jest/globals"

describe("🧪 stockLogController (mocks manuels)", () => {
  let req
  let res

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    jest.clearAllMocks()
  })

  test("getAll : doit retourner tous les logs de stock", async () => {
    const fakeLogs = [{ event: "création", quantity: 10 }]
    stockLogService.getAllStockLogs = jest.fn().mockResolvedValue(fakeLogs)

    await stockLogController.getAll(req, res)

    expect(stockLogService.getAllStockLogs).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(fakeLogs)
  })

  test("getById : doit retourner un log par ID", async () => {
    const fakeLog = { _id: "log123", event: "entrée", quantity: 5 }
    req.params.id = "log123"
    stockLogService.getStockLogById = jest.fn().mockResolvedValue(fakeLog)

    await stockLogController.getById(req, res)

    expect(stockLogService.getStockLogById).toHaveBeenCalledWith("log123")
    expect(res.json).toHaveBeenCalledWith(fakeLog)
  })

  test("getById : doit gérer une erreur si le log n'existe pas", async () => {
    req.params.id = "inexistant"
    stockLogService.getStockLogById = jest
      .fn()
      .mockRejectedValue(new Error("Introuvable"))

    await stockLogController.getById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: "Introuvable" })
  })

  test("create : doit ajouter un log", async () => {
    const newLog = { stock_id: "stock123", event: "entrée", quantity: 15 }
    const createdLog = { ...newLog, _id: "log456" }
    req.body = newLog
    stockLogService.addStockLog = jest.fn().mockResolvedValue(createdLog)

    await stockLogController.create(req, res)

    expect(stockLogService.addStockLog).toHaveBeenCalledWith(newLog)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(createdLog)
  })

  test("create : doit gérer une erreur de création", async () => {
    req.body = {}
    stockLogService.addStockLog = jest
      .fn()
      .mockRejectedValue(new Error("Erreur de création"))

    await stockLogController.create(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: "Erreur de création" })
  })

  test("update : doit modifier un log", async () => {
    req.params.id = "log123"
    req.body = { quantity: 50 }
    const updated = { _id: "log123", event: "entrée", quantity: 50 }

    stockLogService.updateStockLog = jest.fn().mockResolvedValue(updated)

    await stockLogController.update(req, res)

    expect(stockLogService.updateStockLog).toHaveBeenCalledWith("log123", {
      quantity: 50,
    })
    expect(res.json).toHaveBeenCalledWith(updated)
  })

  test("update : doit gérer une erreur si le log est introuvable", async () => {
    req.params.id = "not-found"
    req.body = { quantity: 50 }
    stockLogService.updateStockLog = jest
      .fn()
      .mockRejectedValue(new Error("Introuvable"))

    await stockLogController.update(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: "Introuvable" })
  })

  test("remove : doit supprimer un log", async () => {
    req.params.id = "logToDelete"
    stockLogService.deleteStockLog = jest.fn().mockResolvedValue()

    await stockLogController.remove(req, res)

    expect(stockLogService.deleteStockLog).toHaveBeenCalledWith("logToDelete")
    expect(res.json).toHaveBeenCalledWith({
      message: "Log de stock supprimé avec succès",
    })
  })

  test("remove : doit gérer une erreur de suppression", async () => {
    req.params.id = "log404"
    stockLogService.deleteStockLog = jest
      .fn()
      .mockRejectedValue(new Error("Introuvable"))

    await stockLogController.remove(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: "Introuvable" })
  })
})
