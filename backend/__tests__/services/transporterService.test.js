import TransporterService from "../../services/transporterService.js"
import TransporterDAO from "../../dao/transporterDAO.js"
import { jest } from "@jest/globals"

describe("🧪 TransporterService", () => {
  beforeEach(() => {
    jest.resetAllMocks()

    // Mock manuel des méthodes DAO
    TransporterDAO.findAll = jest.fn()
    TransporterDAO.findById = jest.fn()
    TransporterDAO.create = jest.fn()
    TransporterDAO.update = jest.fn()
    TransporterDAO.delete = jest.fn()
  })

  test("getAllTransporters : doit retourner tous les transporteurs", async () => {
    const fakeData = [{ name: "T1" }, { name: "T2" }]
    TransporterDAO.findAll.mockResolvedValue(fakeData)

    const result = await TransporterService.getAllTransporters()
    expect(result).toEqual(fakeData)
    expect(TransporterDAO.findAll).toHaveBeenCalled()
  })

  test("getTransporterById : doit retourner un transporteur", async () => {
    const fakeTransporter = { _id: "id123", name: "Speedy" }
    TransporterDAO.findById.mockResolvedValue(fakeTransporter)

    const result = await TransporterService.getTransporterById("id123")
    expect(result).toEqual(fakeTransporter)
    expect(TransporterDAO.findById).toHaveBeenCalledWith("id123")
  })

  test("getTransporterById : doit lancer une erreur si introuvable", async () => {
    TransporterDAO.findById.mockResolvedValue(null)

    await expect(TransporterService.getTransporterById("404")).rejects.toThrow(
      "Transporteur introuvable"
    )
  })

  test("addTransporter : doit créer un transporteur", async () => {
    const input = { name: "LivraMax" }
    const created = { _id: "1", ...input }

    TransporterDAO.create.mockResolvedValue(created)

    const result = await TransporterService.addTransporter(input)
    expect(result).toEqual(created)
    expect(TransporterDAO.create).toHaveBeenCalledWith(input)
  })

  test("addTransporter : doit lancer une erreur si nom manquant", async () => {
    await expect(
      TransporterService.addTransporter({ phone: "0102030405" })
    ).rejects.toThrow("Le champ 'nom' est requis")
  })

  test("updateTransporter : doit modifier un transporteur", async () => {
    const updated = { _id: "abc", name: "MajExpress" }
    TransporterDAO.update.mockResolvedValue(updated)

    const result = await TransporterService.updateTransporter("abc", {
      name: "MajExpress",
    })

    expect(result).toEqual(updated)
    expect(TransporterDAO.update).toHaveBeenCalledWith("abc", {
      name: "MajExpress",
    })
  })

  test("updateTransporter : doit lancer une erreur si introuvable", async () => {
    TransporterDAO.update.mockResolvedValue(null)

    await expect(
      TransporterService.updateTransporter("notfound", { name: "X" })
    ).rejects.toThrow("Transporteur introuvable")
  })

  test("deleteTransporter : doit supprimer un transporteur", async () => {
    TransporterDAO.delete.mockResolvedValue({ _id: "t1", name: "T" })

    const result = await TransporterService.deleteTransporter("t1")
    expect(result).toEqual({
      message: "Transporteur supprimé avec succès",
    })
  })

  test("deleteTransporter : doit lancer une erreur si introuvable", async () => {
    TransporterDAO.delete.mockResolvedValue(null)

    await expect(
      TransporterService.deleteTransporter("idInconnu")
    ).rejects.toThrow("Transporteur introuvable")
  })
})
