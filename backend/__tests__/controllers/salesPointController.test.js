import salesPointController from "../../controllers/salesPointController.js"
import salesPointService from "../../services/salesPointService.js"
import { jest } from "@jest/globals"

jest.mock("../../services/salesPointService.js") // mock automatique
// ou mock manuel ici :
salesPointService.getAllSalesPoints = jest.fn()
salesPointService.getSalesPointById = jest.fn()
salesPointService.addSalesPoint = jest.fn()
salesPointService.updateSalesPoint = jest.fn()
salesPointService.deleteSalesPoint = jest.fn()
salesPointService.getSalesPointsWithoutUsers = jest.fn()

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe("salesPointController", () => {
  afterEach(() => jest.clearAllMocks())

  test("getAll : doit retourner tous les points de vente", async () => {
    const mockSalesPoints = [{ name: "Point A" }]
    salesPointService.getAllSalesPoints.mockResolvedValue(mockSalesPoints)

    const req = {}
    const res = mockRes()

    await salesPointController.getAll(req, res)

    expect(res.json).toHaveBeenCalledWith(mockSalesPoints)
  })

  test("getById : doit retourner un point de vente par ID", async () => {
    const req = { params: { id: "123" } }
    const res = mockRes()
    const mockPoint = { name: "Point B" }

    salesPointService.getSalesPointById.mockResolvedValue(mockPoint)

    await salesPointController.getById(req, res)

    expect(salesPointService.getSalesPointById).toHaveBeenCalledWith("123")
    expect(res.json).toHaveBeenCalledWith({
      message: "Point de vente récupéré avec succès",
      data: mockPoint,
    })
  })

  test("create : doit créer un point de vente", async () => {
    const req = { body: { name: "Nouveau", address: "123 rue" } }
    const res = mockRes()
    const mockCreated = { _id: "1", ...req.body }

    salesPointService.addSalesPoint.mockResolvedValue(mockCreated)

    await salesPointController.create(req, res)

    expect(salesPointService.addSalesPoint).toHaveBeenCalledWith(req.body)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: "Point de vente ajouté avec succès",
      data: mockCreated,
    })
  })

  test("update : doit mettre à jour un point de vente", async () => {
    const req = { params: { id: "123" }, body: { name: "Modifié" } }
    const res = mockRes()
    const updated = { _id: "123", name: "Modifié" }

    salesPointService.updateSalesPoint.mockResolvedValue(updated)

    await salesPointController.update(req, res)

    expect(salesPointService.updateSalesPoint).toHaveBeenCalledWith(
      "123",
      req.body
    )
    expect(res.json).toHaveBeenCalledWith({
      message: "Point de vente mis à jour avec succès",
      data: updated,
    })
  })

  test("remove : doit supprimer un point de vente", async () => {
    const req = { params: { id: "123" } }
    const res = mockRes()
    const deleted = { _id: "123", name: "À supprimer" }

    salesPointService.deleteSalesPoint.mockResolvedValue(deleted)

    await salesPointController.remove(req, res)

    expect(salesPointService.deleteSalesPoint).toHaveBeenCalledWith("123")
    expect(res.json).toHaveBeenCalledWith({
      message: "Point de vente supprimé avec succès",
      data: deleted,
    })
  })

  test("getWithoutUsers : doit retourner les points sans utilisateur", async () => {
    const req = {}
    const res = mockRes()
    const mockPoints = [{ name: "Sans utilisateur" }]

    salesPointService.getSalesPointsWithoutUsers.mockResolvedValue(mockPoints)

    await salesPointController.getWithoutUsers(req, res)

    expect(salesPointService.getSalesPointsWithoutUsers).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({
      message: "Points de vente sans utilisateur récupérés avec succès",
      data: mockPoints,
    })
  })

  test("getById : doit gérer les erreurs", async () => {
    const req = { params: { id: "404" } }
    const res = mockRes()
    salesPointService.getSalesPointById.mockRejectedValue(
      new Error("Introuvable")
    )

    await salesPointController.getById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: "Introuvable" })
  })
})
