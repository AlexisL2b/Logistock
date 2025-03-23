import supplierOrderController from "../../controllers/supplierOrderController.js"
import supplierOrderService from "../../services/supplierOrderService.js"
import { jest } from "@jest/globals"

// ❌ Supprime jest.mock automatique
// jest.mock("../../services/supplierOrderService.js") <-- à retirer

describe("🧪 supplierOrderController", () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    // ✅ Mock manuels ici
    supplierOrderService.create = jest.fn()
    supplierOrderService.getAll = jest.fn()
    supplierOrderService.getById = jest.fn()
    supplierOrderService.update = jest.fn()
    supplierOrderService.delete = jest.fn()
  })

  test("create : doit créer une commande fournisseur", async () => {
    const fakeOrder = { _id: "1", statut: "Reçue" }
    req.body = { statut: "Reçue" }
    supplierOrderService.create.mockResolvedValue(fakeOrder)

    await supplierOrderController.create(req, res)

    expect(supplierOrderService.create).toHaveBeenCalledWith(req.body)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(fakeOrder)
  })

  test("getAll : doit retourner toutes les commandes", async () => {
    const fakeOrders = [{ _id: "1" }, { _id: "2" }]
    supplierOrderService.getAll.mockResolvedValue(fakeOrders)

    await supplierOrderController.getAll(req, res)

    expect(supplierOrderService.getAll).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(fakeOrders)
  })

  test("getById : doit retourner une commande fournisseur", async () => {
    const fakeOrder = { _id: "abc123" }
    req.params.id = "abc123"
    supplierOrderService.getById.mockResolvedValue(fakeOrder)

    await supplierOrderController.getById(req, res)

    expect(supplierOrderService.getById).toHaveBeenCalledWith("abc123")
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(fakeOrder)
  })

  test("getById : retourne 404 si la commande est introuvable", async () => {
    req.params.id = "notFound"
    supplierOrderService.getById.mockResolvedValue(null)

    await supplierOrderController.getById(req, res)

    expect(supplierOrderService.getById).toHaveBeenCalledWith("notFound")
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      message: "Commande fournisseur introuvable",
    })
  })

  test("update : doit modifier une commande fournisseur", async () => {
    const updated = { _id: "abc123", statut: "Reçue" }
    req.params.id = "abc123"
    req.body = { statut: "Reçue" }
    supplierOrderService.update.mockResolvedValue(updated)

    await supplierOrderController.update(req, res)

    expect(supplierOrderService.update).toHaveBeenCalledWith("abc123", {
      statut: "Reçue",
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(updated)
  })

  test("update : retourne 404 si la commande est introuvable", async () => {
    req.params.id = "notFound"
    supplierOrderService.update.mockResolvedValue(null)

    await supplierOrderController.update(req, res)

    expect(supplierOrderService.update).toHaveBeenCalledWith("notFound", {})
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      message: "Commande fournisseur introuvable",
    })
  })

  test("delete : doit supprimer une commande fournisseur", async () => {
    req.params.id = "sup123"
    supplierOrderService.delete.mockResolvedValue({ _id: "sup123" })

    await supplierOrderController.delete(req, res)

    expect(supplierOrderService.delete).toHaveBeenCalledWith("sup123")
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: "Commande fournisseur supprimée avec succès",
    })
  })

  test("delete : retourne 404 si la commande n'existe pas", async () => {
    req.params.id = "inconnu"
    supplierOrderService.delete.mockResolvedValue(null)

    await supplierOrderController.delete(req, res)

    expect(supplierOrderService.delete).toHaveBeenCalledWith("inconnu")
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      message: "Commande fournisseur introuvable",
    })
  })
})
