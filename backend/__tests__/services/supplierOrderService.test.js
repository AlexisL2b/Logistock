import supplierOrderService from "../../services/supplierOrderService.js"
import supplierOrderDAO from "../../dao/supplierOrderDAO.js"
import { jest } from "@jest/globals"

describe("🧪 supplierOrderService", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  test("create : doit appeler supplierOrderDAO.create avec les bonnes données", async () => {
    const orderData = { supplier_id: "123", statut: "Reçue", details: [] }
    const fakeCreated = { _id: "id123", ...orderData }

    jest.spyOn(supplierOrderDAO, "create").mockResolvedValue(fakeCreated)

    const result = await supplierOrderService.create(orderData)

    expect(supplierOrderDAO.create).toHaveBeenCalledWith(orderData)
    expect(result).toEqual(fakeCreated)
  })

  test("getAll : doit retourner toutes les commandes", async () => {
    const fakeOrders = [{ _id: "o1" }, { _id: "o2" }]
    jest.spyOn(supplierOrderDAO, "getAll").mockResolvedValue(fakeOrders)

    const result = await supplierOrderService.getAll()

    expect(supplierOrderDAO.getAll).toHaveBeenCalled()
    expect(result).toEqual(fakeOrders)
  })

  test("getById : doit retourner une commande par ID", async () => {
    const fakeOrder = { _id: "abc123" }

    jest.spyOn(supplierOrderDAO, "getById").mockResolvedValue(fakeOrder)

    const result = await supplierOrderService.getById("abc123")

    expect(supplierOrderDAO.getById).toHaveBeenCalledWith("abc123")
    expect(result).toEqual(fakeOrder)
  })

  test("update : doit mettre à jour une commande", async () => {
    const updatedOrder = { _id: "id123", statut: "Reçue" }

    jest.spyOn(supplierOrderDAO, "update").mockResolvedValue(updatedOrder)

    const result = await supplierOrderService.update("id123", {
      statut: "Reçue",
    })

    expect(supplierOrderDAO.update).toHaveBeenCalledWith("id123", {
      statut: "Reçue",
    })
    expect(result).toEqual(updatedOrder)
  })

  test("delete : doit supprimer une commande", async () => {
    const deletedOrder = { _id: "sup123" }

    jest.spyOn(supplierOrderDAO, "delete").mockResolvedValue(deletedOrder)

    const result = await supplierOrderService.delete("sup123")

    expect(supplierOrderDAO.delete).toHaveBeenCalledWith("sup123")
    expect(result).toEqual(deletedOrder)
  })
})
