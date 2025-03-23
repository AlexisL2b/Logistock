import SupplierService from "../../services/supplierService.js"
import SupplierDAO from "../../dao/supplierDAO.js"
import productDAO from "../../dao/productDAO.js"
import { jest } from "@jest/globals"

describe("🧪 SupplierService (mocks manuels)", () => {
  beforeEach(() => {
    // Remet les mocks à zéro à chaque test
    SupplierDAO.findAll = jest.fn()
    SupplierDAO.findById = jest.fn()
    SupplierDAO.create = jest.fn()
    SupplierDAO.update = jest.fn()
    SupplierDAO.delete = jest.fn()

    productDAO.findBySupplierId = jest.fn()
  })

  test("getAllSuppliers : doit retourner tous les fournisseurs", async () => {
    const fakeSuppliers = [{ name: "F1" }, { name: "F2" }]
    SupplierDAO.findAll.mockResolvedValue(fakeSuppliers)

    const result = await SupplierService.getAllSuppliers()
    expect(result).toEqual(fakeSuppliers)
  })

  test("getSupplierById : doit retourner un fournisseur", async () => {
    const supplier = { _id: "abc123", name: "Fournisseur A" }
    SupplierDAO.findById.mockResolvedValue(supplier)

    const result = await SupplierService.getSupplierById("abc123")
    expect(result).toEqual(supplier)
    expect(SupplierDAO.findById).toHaveBeenCalledWith("abc123")
  })

  test("getSupplierById : doit lancer une erreur si introuvable", async () => {
    SupplierDAO.findById.mockResolvedValue(null)

    await expect(SupplierService.getSupplierById("inexistant")).rejects.toThrow(
      "Fournisseur introuvable"
    )
  })

  test("addSupplier : doit créer un fournisseur", async () => {
    const data = { name: "Nouveau Fournisseur" }
    const created = { _id: "id1", ...data }

    SupplierDAO.create.mockResolvedValue(created)
    const result = await SupplierService.addSupplier(data)

    expect(result).toEqual(created)
    expect(SupplierDAO.create).toHaveBeenCalledWith(data)
  })

  test("addSupplier : doit lancer une erreur si le nom est manquant", async () => {
    await expect(SupplierService.addSupplier({})).rejects.toThrow(
      "Le champ 'nom' est requis"
    )
  })

  test("updateSupplier : doit modifier un fournisseur", async () => {
    const updated = { _id: "123", name: "F-modifié" }

    SupplierDAO.update.mockResolvedValue(updated)
    const result = await SupplierService.updateSupplier("123", {
      name: "F-modifié",
    })

    expect(result).toEqual(updated)
    expect(SupplierDAO.update).toHaveBeenCalledWith("123", {
      name: "F-modifié",
    })
  })

  test("updateSupplier : doit lancer une erreur si le fournisseur n'existe pas", async () => {
    SupplierDAO.update.mockResolvedValue(null)

    await expect(
      SupplierService.updateSupplier("notFoundId", { name: "A" })
    ).rejects.toThrow("Fournisseur introuvable")
  })

  test("deleteSupplier : doit supprimer un fournisseur si pas de produits liés", async () => {
    productDAO.findBySupplierId.mockResolvedValue([])
    SupplierDAO.delete.mockResolvedValue({ _id: "abc123", name: "X" })

    const result = await SupplierService.deleteSupplier("abc123")

    expect(result).toEqual({ message: "Fournisseur supprimé avec succès" })
    expect(productDAO.findBySupplierId).toHaveBeenCalledWith("abc123")
    expect(SupplierDAO.delete).toHaveBeenCalledWith("abc123")
  })

  test("deleteSupplier : doit refuser la suppression si des produits sont liés", async () => {
    productDAO.findBySupplierId.mockResolvedValue([
      { name: "Produit A" },
      { name: "Produit B" },
    ])

    await expect(SupplierService.deleteSupplier("id1")).rejects.toThrow(
      "Impossible de supprimer le fournisseur, il est associé aux produits suivants : Produit A, Produit B"
    )
  })

  test("deleteSupplier : doit lancer une erreur si le fournisseur n'existe pas", async () => {
    productDAO.findBySupplierId.mockResolvedValue([])
    SupplierDAO.delete.mockResolvedValue(null)

    await expect(
      SupplierService.deleteSupplier("idInexistant")
    ).rejects.toThrow("Fournisseur introuvable")
  })
})
