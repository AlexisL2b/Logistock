import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import OrderService from "../../services/orderService.js"
import OrderDAO from "../../dao/orderDAO.js"
import UserDAO from "../../dao/userDAO.js"
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

// ✅ Mocks des DAO
jest.mock("../../dao/orderDAO.js")
OrderDAO.findAllOrders = jest.fn()
OrderDAO.findById = jest.fn()
OrderDAO.findByUserId = jest.fn()
OrderDAO.createOrder = jest.fn()
OrderDAO.updateOrder = jest.fn()
OrderDAO.updateOrderPaymentStatus = jest.fn()
OrderDAO.delete = jest.fn()

jest.mock("../../dao/userDAO.js")
UserDAO.findById = jest.fn()

describe("OrderService", () => {
  /**
   * ✅ Test : Récupérer toutes les commandes
   */
  test("✅ getAllOrders : Récupère toutes les commandes", async () => {
    const mockOrders = [
      { _id: "order1", totalAmount: 100 },
      { _id: "order2", totalAmount: 200 },
    ]
    OrderDAO.findAllOrders.mockResolvedValue(mockOrders)

    const result = await OrderService.getAllOrders()

    expect(OrderDAO.findAllOrders).toHaveBeenCalled()
    expect(result).toEqual(mockOrders)
  })

  /**
   * ✅ Test : Récupérer une commande par ID
   */
  test("✅ getOrderById : Récupère une commande existante", async () => {
    const mockOrder = { _id: "order1", totalAmount: 100 }
    OrderDAO.findById.mockResolvedValue(mockOrder)

    const result = await OrderService.getOrderById("order1")

    expect(OrderDAO.findById).toHaveBeenCalledWith("order1")
    expect(result).toEqual(mockOrder)
  })

  test("❌ getOrderById : Erreur si la commande est introuvable", async () => {
    OrderDAO.findById.mockResolvedValue(null)
    await expect(OrderService.getOrderById("unknown")).rejects.toThrow(
      "Commande introuvable"
    )
  })

  /**
   * ✅ Test : Récupérer les commandes d'un acheteur
   */
  test("✅ getOrdersByBuyerId : Récupère les commandes d'un acheteur", async () => {
    const mockOrders = [{ _id: "order1" }, { _id: "order2" }]
    OrderDAO.findByUserId.mockResolvedValue(mockOrders)

    const result = await OrderService.getOrdersByBuyerId("buyer1")

    expect(OrderDAO.findByUserId).toHaveBeenCalledWith("buyer1")
    expect(result).toEqual(mockOrders)
  })

  /**
   * ✅ Test : Ajouter une commande
   */
  test("✅ addOrder : Ajoute une commande si l'acheteur existe", async () => {
    const buyer = {
      _id: "buyer1",
      firstname: "John",
      lastname: "Doe",
      address: "123 Rue",
      sales_point: { name: "Shop" },
      email: "john@example.com",
    }
    UserDAO.findById.mockResolvedValue(buyer)

    const newOrder = { buyer_id: "buyer1", totalAmount: 150, details: [] }
    OrderDAO.createOrder.mockResolvedValue({ _id: "order1", ...newOrder })

    const result = await OrderService.addOrder(newOrder)

    expect(UserDAO.findById).toHaveBeenCalledWith("buyer1")
    expect(OrderDAO.createOrder).toHaveBeenCalled()
    expect(result).toEqual({ order: { _id: "order1", ...newOrder } })
  })

  test("❌ addOrder : Erreur si l'acheteur est introuvable", async () => {
    UserDAO.findById.mockResolvedValue(null) // Simule un acheteur inexistant

    await expect(
      OrderService.addOrder({
        buyer_id: "unknown",
        totalAmount: 150,
        details: [],
      })
    ).rejects.toThrow("Acheteur introuvable")
  })

  /**
   * ✅ Test : Mettre à jour une commande
   */
  test("✅ updateOrder : Met à jour une commande existante", async () => {
    const updatedOrder = { _id: "order1", totalAmount: 200 }
    OrderDAO.updateOrder.mockResolvedValue(updatedOrder)

    const result = await OrderService.updateOrder("order1", updatedOrder)

    expect(OrderDAO.updateOrder).toHaveBeenCalledWith("order1", updatedOrder)
    expect(result).toEqual(updatedOrder)
  })

  test("❌ updateOrder : Erreur si la commande est introuvable", async () => {
    OrderDAO.updateOrder.mockResolvedValue(null)
    await expect(OrderService.updateOrder("unknown", {})).rejects.toThrow(
      "Commande introuvable"
    )
  })

  /**
   * ✅ Test : Confirmer un paiement
   */
  test("✅ confirmPayment : Confirme un paiement Stripe", async () => {
    OrderDAO.updateOrderPaymentStatus.mockResolvedValue(true)

    const result = await OrderService.confirmPayment("order1", "payment123")

    expect(OrderDAO.updateOrderPaymentStatus).toHaveBeenCalledWith(
      "order1",
      "payment123",
      "succeeded"
    )
    expect(result).toBe(true)
  })

  /**
   * ✅ Test : Supprimer une commande
   */
  test("✅ deleteOrder : Supprime une commande existante", async () => {
    OrderDAO.delete.mockResolvedValue(true)

    const result = await OrderService.deleteOrder("order1")

    expect(OrderDAO.delete).toHaveBeenCalledWith("order1")
    expect(result).toBe(true)
  })

  test("❌ deleteOrder : Erreur si la commande est introuvable", async () => {
    OrderDAO.delete.mockResolvedValue(null)
    await expect(OrderService.deleteOrder("unknown")).rejects.toThrow(
      "Commande introuvable"
    )
  })
})
