import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import OrderShipment from "../../models/orderShipmentModel.js"
import Order from "../../models/orderModel.js"
import Transporter from "../../models/transporterModel.js"
import orderShipmentDAO from "../../dao/orderShipmentDAO.js"

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

afterEach(async () => {
  await OrderShipment.deleteMany()
  await Order.deleteMany()
  await Transporter.deleteMany()
})

describe("OrderShipmentDAO", () => {
  test("devrait créer un départ de commande", async () => {
    const transporter = await Transporter.create({
      name: "DHL",
      phone: "0123456789",
    })
    const order = await Order.create({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Jean",
        lastname: "Dupont",
        address: "123 rue de Paris",
        email: "jean@example.com",
      },
      statut: "en cours",
      totalAmount: 100,
      details: [],
    })

    const shipment = await orderShipmentDAO.create({
      transporter_id: transporter._id,
      order_id: order._id,
    })

    expect(shipment).toBeDefined()
    expect(shipment.order_id.toString()).toBe(order._id.toString())
    expect(shipment.transporter_id.toString()).toBe(transporter._id.toString())
  })

  test("devrait retourner tous les départs de commandes", async () => {
    const transporter = await Transporter.create({ name: "Chronopost" })
    const order = await Order.create({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Alice",
        lastname: "Martin",
        address: "5 avenue République",
        email: "alice@example.com",
      },
      statut: "livrée",
      totalAmount: 200,
      details: [],
    })

    await OrderShipment.create({
      transporter_id: transporter._id,
      order_id: order._id,
    })

    const results = await orderShipmentDAO.findAll()
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]).toHaveProperty("order_id")
    expect(results[0]).toHaveProperty("transporter_id")
  })

  test("devrait trouver un départ de commande par ID", async () => {
    const transporter = await Transporter.create({ name: "UPS" })
    const order = await Order.create({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Tom",
        lastname: "Benoit",
        address: "8 chemin des Vignes",
        email: "tom@example.com",
      },
      statut: "confirmée",
      totalAmount: 120,
      details: [],
    })

    const shipment = await OrderShipment.create({
      transporter_id: transporter._id,
      order_id: order._id,
    })

    const found = await orderShipmentDAO.findById(shipment._id)
    expect(found).toBeDefined()
    expect(found.order_id._id.toString()).toBe(order._id.toString())
  })

  test("devrait trouver un départ par ID de commande", async () => {
    const transporter = await Transporter.create({ name: "La Poste" })
    const order = await Order.create({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Emma",
        lastname: "Leclerc",
        address: "12 rue de la Gare",
        email: "emma@example.com",
      },
      statut: "en attente",
      totalAmount: 75,
      details: [],
    })

    await OrderShipment.create({
      transporter_id: transporter._id,
      order_id: order._id,
    })

    const found = await orderShipmentDAO.findByCommandeId(order._id)
    expect(found.length).toBe(1)
    expect(found[0].order_id.toString()).toBe(order._id.toString())
  })

  test("devrait mettre à jour un départ de commande", async () => {
    const transporter1 = await Transporter.create({ name: "GLS" })
    const transporter2 = await Transporter.create({ name: "Colissimo" })
    const order = await Order.create({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Lucas",
        lastname: "Robert",
        address: "Rue du centre",
        email: "lucas@example.com",
      },
      statut: "expédiée",
      totalAmount: 180,
      details: [],
    })

    const shipment = await OrderShipment.create({
      transporter_id: transporter1._id,
      order_id: order._id,
    })

    const updated = await orderShipmentDAO.update(shipment._id, {
      transporter_id: transporter2._id,
    })

    expect(updated.transporter_id.toString()).toBe(transporter2._id.toString())
  })

  test("devrait supprimer un départ de commande", async () => {
    const transporter = await Transporter.create({ name: "DB Schenker" })
    const order = await Order.create({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Sophie",
        lastname: "Dumont",
        address: "Place Bellecour",
        email: "sophie@example.com",
      },
      statut: "annulée",
      totalAmount: 50,
      details: [],
    })

    const shipment = await OrderShipment.create({
      transporter_id: transporter._id,
      order_id: order._id,
    })

    const deleted = await orderShipmentDAO.delete(shipment._id)
    expect(deleted._id.toString()).toBe(shipment._id.toString())
  })
})
