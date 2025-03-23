import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import Role from "../../models/roleModel.js"

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
  await Role.deleteMany()
})

describe("Modèle Role", () => {
  test("crée et sauvegarde un rôle valide", async () => {
    const role = new Role({ name: "admin" })
    const savedRole = await role.save()

    expect(savedRole._id).toBeDefined()
    expect(savedRole.name).toBe("admin")
  })

  test("échoue si le champ name est manquant", async () => {
    const role = new Role({})
    let err
    try {
      await role.save()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors.name).toBeDefined()
  })

  test("échoue si le rôle n'est pas dans l'enum", async () => {
    const role = new Role({ name: "superuser" }) // non autorisé

    let err
    try {
      await role.save()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.errors.name.kind).toBe("enum")
  })

  test("échoue si le nom est en doublon", async () => {
    await Role.create({ name: "gestionnaire" })

    let err
    try {
      await Role.create({ name: "gestionnaire" })
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.code).toBe(11000) // code Mongo pour duplicata unique
  })
})
