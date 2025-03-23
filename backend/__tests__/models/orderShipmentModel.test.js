import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import OrderShipment from "../../models/orderShipmentModel.js"

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
})

describe("Modèle OrderShipment", () => {
  test("devrait créer et enregistrer une expédition de commande avec succès", async () => {
    const orderShipment = new OrderShipment({
      order_id: new mongoose.Types.ObjectId(),
      transporter_id: new mongoose.Types.ObjectId(),
    })

    const saved = await orderShipment.save()

    expect(saved._id).toBeDefined()
    expect(saved.date_shipment).toBeDefined()
    expect(saved.order_id).toBeInstanceOf(mongoose.Types.ObjectId)
    expect(saved.transporter_id).toBeInstanceOf(mongoose.Types.ObjectId)
  })

  test("devrait échouer si des champs obligatoires sont manquants", async () => {
    const incompleteShipment = new OrderShipment({
      // order_id manquant
      transporter_id: new mongoose.Types.ObjectId(),
    })

    let err
    try {
      await incompleteShipment.save()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors["order_id"]).toBeDefined()
  })

  test("devrait définir date_shipment par défaut à la date actuelle", async () => {
    const now = Date.now()
    const shipment = await OrderShipment.create({
      order_id: new mongoose.Types.ObjectId(),
      transporter_id: new mongoose.Types.ObjectId(),
    })

    expect(new Date(shipment.date_shipment).getTime()).toBeGreaterThanOrEqual(
      now
    )
  })
})
