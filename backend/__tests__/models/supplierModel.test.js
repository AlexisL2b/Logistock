// __tests__/models/supplierModel.test.js

import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Supplier from "../../models/supplierModel.js"

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
  await Supplier.deleteMany()
})

describe("🧪 Modèle Supplier", () => {
  test("✅ doit créer un fournisseur avec succès", async () => {
    const supplierData = {
      name: "Fournisseur Test",
      contact: "Jean Dupont",
      phone: "0601020304",
      email: "test@supplier.com",
    }

    const supplier = await Supplier.create(supplierData)

    expect(supplier._id).toBeDefined()
    expect(supplier.name).toBe("Fournisseur Test")
    expect(supplier.contact).toBe("Jean Dupont")
    expect(supplier.phone).toBe("0601020304")
    expect(supplier.email).toBe("test@supplier.com")
  })

  test("❌ doit échouer si le champ 'name' est manquant", async () => {
    const supplierData = {
      contact: "Jean Dupont",
      phone: "0601020304",
      email: "test@supplier.com",
    }

    let error
    try {
      await Supplier.create(supplierData)
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.errors["name"]).toBeDefined()
  })

  test("✅ peut créer un fournisseur sans les champs facultatifs", async () => {
    const supplierData = {
      name: "Fournisseur Minimal",
    }

    const supplier = await Supplier.create(supplierData)

    expect(supplier._id).toBeDefined()
    expect(supplier.name).toBe("Fournisseur Minimal")
    expect(supplier.contact).toBeUndefined()
    expect(supplier.phone).toBeUndefined()
    expect(supplier.email).toBeUndefined()
  })
})
