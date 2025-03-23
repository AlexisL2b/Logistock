import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Order from "../../models/orderModel.js"

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
  await Order.deleteMany()
})

describe("Modèle Order", () => {
  test("devrait créer et sauvegarder une commande avec succès", async () => {
    const validOrder = new Order({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Jean",
        lastname: "Dupont",
        address: "123 Rue Principale",
        email: "jean@exemple.com",
      },
      statut: "En attente",
      totalAmount: 199.99,
      details: [
        {
          product_id: new mongoose.Types.ObjectId(),
          name: "Clavier",
          reference: "CLAV001",
          quantity: 2,
          price: 49.99,
        },
      ],
    })

    const saved = await validOrder.save()
    expect(saved._id).toBeDefined()
    expect(saved.buyer.firstname).toBe("Jean")
    expect(saved.details.length).toBe(1)
    expect(saved.totalAmount).toBe(199.99)
  })

  test("devrait échouer si des champs requis sont manquants", async () => {
    const invalidOrder = new Order({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Jean",
        lastname: "Dupont",
        address: "123 Rue Principale",
        // ❌ email manquant
      },
      // ❌ statut manquant
      totalAmount: 120,
      details: [
        {
          product_id: new mongoose.Types.ObjectId(),
          name: "Souris",
          reference: "SOU123",
          quantity: 1,
          price: 30,
        },
      ],
    })

    let err
    try {
      await invalidOrder.save()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors["buyer.email"]).toBeDefined()
    expect(err.errors["statut"]).toBeDefined()
  })

  test("devrait autoriser la création même si details est vide", async () => {
    const orderWithoutDetails = new Order({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Anna",
        lastname: "Martin",
        address: "456 Avenue Nord",
        email: "anna@example.com",
      },
      statut: "En attente",
      totalAmount: 50,
      details: [], // ❌ vide
    })

    let err
    try {
      await orderWithoutDetails.save()
    } catch (error) {
      err = error
    }

    // Mongoose autorise par défaut les arrays vides
    expect(err).toBeUndefined()
  })
})
