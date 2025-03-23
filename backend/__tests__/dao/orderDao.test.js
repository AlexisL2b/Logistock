import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Order from "../../models/orderModel.js"
import orderDAO from "../../dao/orderDAO.js"

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

describe("OrderDAO", () => {
  test("devrait créer une nouvelle commande", async () => {
    const orderData = {
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Jean",
        lastname: "Dupont",
        address: "123 Rue Principale",
        email: "jean@example.com",
      },
      statut: "En attente",
      totalAmount: 100,
      details: [
        {
          product_id: new mongoose.Types.ObjectId(),
          name: "Produit A",
          reference: "REF123",
          quantity: 2,
          price: 50,
        },
      ],
    }

    const result = await orderDAO.createOrder(orderData)

    expect(result).toBeDefined()
    expect(result.buyer.firstname).toBe("Jean")
    expect(result.totalAmount).toBe(100)
  })

  test("devrait retourner toutes les commandes", async () => {
    await orderDAO.createOrder({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Alice",
        lastname: "Martin",
        address: "1 Rue A",
        email: "alice@mail.com",
      },
      statut: "En attente",
      totalAmount: 200,
      details: [],
    })

    await orderDAO.createOrder({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Bob",
        lastname: "Leroy",
        address: "2 Rue B",
        email: "bob@mail.com",
      },
      statut: "Validée",
      totalAmount: 300,
      details: [],
    })

    const orders = await orderDAO.findAllOrders()
    expect(orders.length).toBe(2)
  })

  test("devrait retrouver une commande par son ID", async () => {
    const created = await orderDAO.createOrder({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Nina",
        lastname: "Lopez",
        address: "3 Rue C",
        email: "nina@mail.com",
      },
      statut: "En cours",
      totalAmount: 120,
      details: [],
    })

    const found = await orderDAO.findById(created._id)
    expect(found.email).toBeUndefined()
    expect(found.buyer.firstname).toBe("Nina")
  })

  test("devrait retrouver les commandes d’un acheteur donné", async () => {
    const buyerId = new mongoose.Types.ObjectId()

    await orderDAO.createOrder({
      buyer: {
        _id: buyerId,
        firstname: "Marc",
        lastname: "Durand",
        address: "4 Rue D",
        email: "marc@mail.com",
      },
      statut: "En préparation",
      totalAmount: 180,
      details: [],
    })

    const orders = await orderDAO.findByUserId(buyerId)
    expect(orders.length).toBe(1)
    expect(orders[0].buyer.lastname).toBe("Durand")
  })

  test("devrait mettre à jour une commande", async () => {
    const created = await orderDAO.createOrder({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Emma",
        lastname: "Bernard",
        address: "5 Rue E",
        email: "emma@mail.com",
      },
      statut: "En attente",
      totalAmount: 90,
      details: [],
    })

    const updated = await orderDAO.updateOrder(created._id, {
      statut: "Livrée",
    })

    expect(updated.statut).toBe("Livrée")
  })

  test("devrait supprimer une commande", async () => {
    const created = await orderDAO.createOrder({
      buyer: {
        _id: new mongoose.Types.ObjectId(),
        firstname: "Luc",
        lastname: "Petit",
        address: "6 Rue F",
        email: "luc@mail.com",
      },
      statut: "Annulée",
      totalAmount: 60,
      details: [],
    })

    const deleted = await orderDAO.delete(created._id)
    expect(deleted._id.toString()).toBe(created._id.toString())

    const after = await Order.findById(created._id)
    expect(after).toBeNull()
  })
})
