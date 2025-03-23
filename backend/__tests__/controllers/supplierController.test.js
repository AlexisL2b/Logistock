import supplierController from "../../controllers/supplierController.js"
import SupplierService from "../../services/supplierService.js"
import { jest } from "@jest/globals"

describe("🧪 supplierController (mocks manuels)", () => {
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

    // Reset manuel des méthodes mockées
    SupplierService.getAllSuppliers = jest.fn()
    SupplierService.getSupplierById = jest.fn()
    SupplierService.addSupplier = jest.fn()
    SupplierService.updateSupplier = jest.fn()
    SupplierService.deleteSupplier = jest.fn()
  })

  test("getAll : doit retourner tous les fournisseurs", async () => {
    const fakeSuppliers = [{ name: "F1" }, { name: "F2" }]
    SupplierService.getAllSuppliers.mockResolvedValue(fakeSuppliers)

    await supplierController.getAll(req, res)

    expect(res.json).toHaveBeenCalledWith(fakeSuppliers)
  })

  test("getAll : doit gérer une erreur serveur", async () => {
    SupplierService.getAllSuppliers.mockRejectedValue(
      new Error("Erreur serveur")
    )

    await supplierController.getAll(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: "Erreur serveur" })
  })

  test("getById : doit retourner un fournisseur", async () => {
    req.params.id = "sup123"
    const supplier = { _id: "sup123", name: "Fournisseur A" }
    SupplierService.getSupplierById.mockResolvedValue(supplier)

    await supplierController.getById(req, res)

    expect(res.json).toHaveBeenCalledWith(supplier)
  })

  test("getById : doit retourner une erreur si introuvable", async () => {
    req.params.id = "notFound"
    SupplierService.getSupplierById.mockRejectedValue(new Error("Introuvable"))

    await supplierController.getById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: "Introuvable" })
  })

  test("create : doit ajouter un fournisseur", async () => {
    req.body = { name: "Fournisseur A" }
    const newSupplier = { _id: "sup1", name: "Fournisseur A" }

    SupplierService.addSupplier.mockResolvedValue(newSupplier)

    await supplierController.create(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(newSupplier)
  })

  test("create : doit gérer une erreur de validation", async () => {
    req.body = {}
    SupplierService.addSupplier.mockRejectedValue(new Error("Nom requis"))

    await supplierController.create(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: "Nom requis" })
  })

  test("update : doit modifier un fournisseur", async () => {
    req.params.id = "sup1"
    req.body = { name: "MAJ" }
    const updated = { _id: "sup1", name: "MAJ" }

    SupplierService.updateSupplier.mockResolvedValue(updated)

    await supplierController.update(req, res)

    expect(res.json).toHaveBeenCalledWith(updated)
  })

  test("update : doit gérer une erreur si le fournisseur n'existe pas", async () => {
    req.params.id = "notFound"
    SupplierService.updateSupplier.mockRejectedValue(new Error("Introuvable"))

    await supplierController.update(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: "Introuvable" })
  })

  test("remove : doit supprimer un fournisseur", async () => {
    req.params.id = "sup1"
    const result = { message: "Fournisseur supprimé avec succès" }

    SupplierService.deleteSupplier.mockResolvedValue(result)

    await supplierController.remove(req, res)

    expect(res.json).toHaveBeenCalledWith(result)
  })

  test("remove : doit gérer une erreur si suppression impossible", async () => {
    req.params.id = "sup1"
    SupplierService.deleteSupplier.mockRejectedValue(
      new Error("Erreur suppression")
    )

    await supplierController.remove(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: "Erreur suppression" })
  })
})
