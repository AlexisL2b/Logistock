import orderShipmentController from "../../controllers/orderShipmentController.js"
import orderShipmentService from "../../services/orderShipmentService.js"
import { jest } from "@jest/globals"

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

beforeEach(() => {
  jest.clearAllMocks()

  // 🎯 Mock manuel de chaque méthode du service
  orderShipmentService.getAllOrderShipments = jest.fn()
  orderShipmentService.getOrderShipmentById = jest.fn()
  orderShipmentService.getOrderShipmentByCommandeId = jest.fn()
  orderShipmentService.addOrderShipment = jest.fn()
  orderShipmentService.updateOrderShipment = jest.fn()
  orderShipmentService.deleteOrderShipment = jest.fn()
})

describe("orderShipmentController", () => {
  it("should return all order shipments", async () => {
    const mockShipments = [{ _id: "1" }, { _id: "2" }]
    orderShipmentService.getAllOrderShipments.mockResolvedValue(mockShipments)

    const req = {}
    const res = mockRes()

    await orderShipmentController.getAll(req, res)

    expect(orderShipmentService.getAllOrderShipments).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(mockShipments)
  })

  it("should return shipment by ID", async () => {
    const shipment = { _id: "abc" }
    orderShipmentService.getOrderShipmentById.mockResolvedValue(shipment)

    const req = { params: { id: "abc" } }
    const res = mockRes()

    await orderShipmentController.getById(req, res)

    expect(orderShipmentService.getOrderShipmentById).toHaveBeenCalledWith(
      "abc"
    )
    expect(res.json).toHaveBeenCalledWith(shipment)
  })

  it("should return shipment by commande ID", async () => {
    const shipment = { _id: "xyz" }
    orderShipmentService.getOrderShipmentByCommandeId.mockResolvedValue(
      shipment
    )

    const req = { params: { id: "xyz" } }
    const res = mockRes()

    await orderShipmentController.getByCommandeId(req, res)

    expect(
      orderShipmentService.getOrderShipmentByCommandeId
    ).toHaveBeenCalledWith("xyz")
    expect(res.json).toHaveBeenCalledWith(shipment)
  })

  it("should create a shipment", async () => {
    const newShipment = { _id: "new" }
    orderShipmentService.addOrderShipment.mockResolvedValue(newShipment)

    const req = { body: { order_id: "order123", transporter_id: "trans123" } }
    const res = mockRes()

    await orderShipmentController.create(req, res)

    expect(orderShipmentService.addOrderShipment).toHaveBeenCalledWith(req.body)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(newShipment)
  })

  it("should update a shipment", async () => {
    const updatedShipment = { _id: "update" }
    orderShipmentService.updateOrderShipment.mockResolvedValue(updatedShipment)

    const req = { params: { id: "up1" }, body: { transporter_id: "newId" } }
    const res = mockRes()

    await orderShipmentController.update(req, res)

    expect(orderShipmentService.updateOrderShipment).toHaveBeenCalledWith(
      "up1",
      req.body
    )
    expect(res.json).toHaveBeenCalledWith(updatedShipment)
  })

  it("should delete a shipment", async () => {
    const deleted = { _id: "del123" }
    orderShipmentService.deleteOrderShipment.mockResolvedValue(deleted)

    const req = { params: { id: "del123" } }
    const res = mockRes()

    await orderShipmentController.remove(req, res)

    expect(orderShipmentService.deleteOrderShipment).toHaveBeenCalledWith(
      "del123"
    )
    expect(res.json).toHaveBeenCalledWith({
      message: "Départ de commande supprimé avec succès",
      data: deleted,
    })
  })
})
