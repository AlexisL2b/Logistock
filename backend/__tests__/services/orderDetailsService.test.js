import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import OrderDetailsService from "../../services/orderDetailsService.js"
import OrderDetailsDAO from "../../dao/orderDetailsDAO.js"
import { jest } from "@jest/globals"

// 📌 Simuler MongoDB en mémoire
let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  if (!mongoUri) {
    throw new Error("⚠️ MongoDB URI non défini !")
  }

  console.log("🔹 URI MongoDB:", mongoUri)
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
jest.mock("../../dao/orderDetailsDAO.js")
OrderDetailsDAO.findAll = jest.fn()
OrderDetailsDAO.findById = jest.fn()
OrderDetailsDAO.create = jest.fn()
OrderDetailsDAO.update = jest.fn()
OrderDetailsDAO.delete = jest.fn()

describe("OrderDetailsService", () => {
  /**
   * ✅ Test : Ajouter des détails de commande
   */
  test("✅ addOrderDetails : Ajoute des détails de commande avec succès", async () => {
    const orderDetails = { order_id: "order1", product: "Laptop", quantity: 2 }
    OrderDetailsDAO.create.mockResolvedValue(orderDetails)

    const result = await OrderDetailsService.addOrderDetails(orderDetails)

    expect(OrderDetailsDAO.create).toHaveBeenCalledWith(orderDetails)
    expect(result).toEqual({
      message: "Détails de commande ajoutés avec succès",
    })
  })

  test("❌ addOrderDetails : Erreur si 'order_id' est manquant", async () => {
    await expect(OrderDetailsService.addOrderDetails({})).rejects.toThrow(
      "Le champ 'commande_id' est requis."
    )
  })

  /**
   * ✅ Test : Récupérer tous les détails de commande
   */
  test("✅ getAllOrderDetails : Récupère tous les détails de commande", async () => {
    const mockOrderDetails = [
      { _id: "1", order_id: "order1", product: "Laptop", quantity: 2 },
      { _id: "2", order_id: "order2", product: "Phone", quantity: 3 },
    ]
    OrderDetailsDAO.findAll.mockResolvedValue(mockOrderDetails)

    const result = await OrderDetailsService.getAllOrderDetails()

    expect(OrderDetailsDAO.findAll).toHaveBeenCalled()
    expect(result).toEqual(mockOrderDetails)
  })

  /**
   * ✅ Test : Récupérer les détails de commande par ID
   */
  test("✅ getOrderDetailsById : Récupère les détails de commande existants", async () => {
    const mockOrderDetails = {
      _id: "1",
      order_id: "order1",
      product: "Laptop",
      quantity: 2,
    }
    OrderDetailsDAO.findById.mockResolvedValue(mockOrderDetails)

    const result = await OrderDetailsService.getOrderDetailsById("1")

    expect(OrderDetailsDAO.findById).toHaveBeenCalledWith("1")
    expect(result).toEqual(mockOrderDetails)
  })

  test("❌ getOrderDetailsById : Erreur si les détails de commande sont introuvables", async () => {
    OrderDetailsDAO.findById.mockResolvedValue(null)

    await expect(
      OrderDetailsService.getOrderDetailsById("unknown")
    ).rejects.toThrow("Détails de commande introuvables")
  })

  /**
   * ✅ Test : Mettre à jour les détails de commande
   */
  test("✅ updateOrderDetails : Met à jour les détails de commande", async () => {
    const updatedData = { quantity: 5 }
    OrderDetailsDAO.update.mockResolvedValue({ _id: "1", ...updatedData })

    const result = await OrderDetailsService.updateOrderDetails(
      "1",
      updatedData
    )

    expect(OrderDetailsDAO.update).toHaveBeenCalledWith("1", updatedData)
    expect(result).toEqual({ _id: "1", ...updatedData })
  })

  test("❌ updateOrderDetails : Erreur si les détails de commande sont introuvables", async () => {
    OrderDetailsDAO.update.mockResolvedValue(null)

    await expect(
      OrderDetailsService.updateOrderDetails("unknown", {})
    ).rejects.toThrow("Détails de commande introuvables")
  })

  /**
   * ✅ Test : Supprimer des détails de commande
   */
  test("✅ deleteOrderDetails : Supprime les détails de commande avec succès", async () => {
    OrderDetailsDAO.delete.mockResolvedValue({ _id: "1" })

    const result = await OrderDetailsService.deleteOrderDetails("1")

    expect(OrderDetailsDAO.delete).toHaveBeenCalledWith("1")
    expect(result).toEqual({ _id: "1" })
  })

  test("❌ deleteOrderDetails : Erreur si les détails de commande sont introuvables", async () => {
    OrderDetailsDAO.delete.mockResolvedValue(null)

    await expect(
      OrderDetailsService.deleteOrderDetails("unknown")
    ).rejects.toThrow("Détails de commande introuvables")
  })
})
