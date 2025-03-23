import orderController from "../../controllers/orderController.js"
import OrderService from "../../services/orderService.js"
import { jest } from "@jest/globals"

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

beforeEach(() => {
  OrderService.getAllOrders = jest.fn()
  OrderService.addOrder = jest.fn()
  OrderService.updateOrder = jest.fn()
  OrderService.getOrdersByBuyerId = jest.fn()
  OrderService.confirmPayment = jest.fn()
  OrderService.getOrderById = jest.fn()
  OrderService.deleteOrder = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe("orderController", () => {
  describe("getAll", () => {
    it("should return all orders", async () => {
      const mockOrders = [{ id: "1" }]
      OrderService.getAllOrders.mockResolvedValue(mockOrders)
      const req = {}
      const res = mockRes()

      await orderController.getAll(req, res)

      expect(OrderService.getAllOrders).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(mockOrders)
    })
  })

  describe("create", () => {
    it("should create an order", async () => {
      const reqBody = { buyer_id: "u123", details: [{ product_id: "p1" }] }
      OrderService.addOrder.mockResolvedValue({ order: reqBody })
      const req = { body: reqBody }
      const res = mockRes()

      await orderController.create(req, res)

      expect(OrderService.addOrder).toHaveBeenCalledWith(reqBody)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: "Commande créée avec succès",
        order: reqBody,
      })
    })

    it("should return 400 if missing buyer or details", async () => {
      const req = { body: {} }
      const res = mockRes()

      await orderController.create(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: "L'acheteur et les détails de commande sont requis.",
      })
    })
  })

  describe("update", () => {
    it("should update an order", async () => {
      const updatedOrder = { statut: "confirmée" }
      OrderService.updateOrder.mockResolvedValue(updatedOrder)
      const req = { params: { id: "o1" }, body: updatedOrder }
      const res = mockRes()

      await orderController.update(req, res)

      expect(OrderService.updateOrder).toHaveBeenCalledWith("o1", updatedOrder)
      expect(res.json).toHaveBeenCalledWith({
        message: "Commande mise à jour avec succès",
        order: updatedOrder,
      })
    })

    it("should return 404 on error", async () => {
      OrderService.updateOrder.mockRejectedValue(new Error("Not found"))
      const req = { params: { id: "bad" }, body: {} }
      const res = mockRes()

      await orderController.update(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: "Not found" })
    })
  })

  describe("getByBuyer", () => {
    it("should return buyer orders", async () => {
      const mockOrders = [{ id: "1" }]
      OrderService.getOrdersByBuyerId.mockResolvedValue(mockOrders)
      const req = { params: { buyer_id: "b1" } }
      const res = mockRes()

      await orderController.getByBuyer(req, res)

      expect(OrderService.getOrdersByBuyerId).toHaveBeenCalledWith("b1")
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockOrders)
    })
  })

  describe("confirmPayment", () => {
    it("should confirm a payment", async () => {
      const updatedOrder = { statut: "payée" }
      OrderService.confirmPayment.mockResolvedValue(updatedOrder)
      const req = { body: { orderId: "o1", paymentIntentId: "pi_1" } }
      const res = mockRes()

      await orderController.confirmPayment(req, res)

      expect(OrderService.confirmPayment).toHaveBeenCalledWith("o1", "pi_1")
      expect(res.json).toHaveBeenCalledWith({
        message: "Paiement confirmé",
        order: updatedOrder,
      })
    })

    it("should return 400 if missing data", async () => {
      const req = { body: {} }
      const res = mockRes()

      await orderController.confirmPayment(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: "orderId et paymentIntentId requis.",
      })
    })
  })

  describe("getById", () => {
    it("should return order by ID", async () => {
      const mockOrder = { id: "1" }
      OrderService.getOrderById.mockResolvedValue(mockOrder)
      const req = { params: { id: "1" } }
      const res = mockRes()

      await orderController.getById(req, res)

      expect(OrderService.getOrderById).toHaveBeenCalledWith("1")
      expect(res.json).toHaveBeenCalledWith(mockOrder)
    })
  })

  describe("remove", () => {
    it("should delete order", async () => {
      const deletedOrder = { id: "d1" }
      OrderService.deleteOrder.mockResolvedValue(deletedOrder)
      const req = { params: { id: "d1" } }
      const res = mockRes()

      await orderController.remove(req, res)

      expect(OrderService.deleteOrder).toHaveBeenCalledWith("d1")
      expect(res.json).toHaveBeenCalledWith({
        message: "Commande supprimée avec succès",
        data: deletedOrder,
      })
    })
  })
})
