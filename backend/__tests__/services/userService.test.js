import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import bcrypt from "bcryptjs"
import UserService from "../../services/userService.js"
import User from "../../models/userModel.js"
import UserDAO from "../../dao/userDAO.js"
import { jest } from "@jest/globals"

// 📌 Simuler MongoDB en mémoire
let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  if (!mongoUri) {
    throw new Error("⚠️ MongoDB URI non défini !")
  }

  console.log("🔹 URI MongoDB:", mongoUri) // Debugging

  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

beforeEach(async () => {
  await User.deleteMany()
})

// 📌 Correction du mock de UserDAO
jest.mock("../../dao/userDAO.js")
UserDAO.findById = jest.fn()
UserDAO.findBuyers = jest.fn()
UserDAO.findAll = jest.fn()
UserDAO.updateUser = jest.fn()
UserDAO.deleteUser = jest.fn()

// Vérification du mock
console.log("findById type:", typeof UserDAO.findById)
console.log("findBuyers type:", typeof UserDAO.findBuyers)

// 🔹 Test : Récupérer un profil utilisateur
test("Récupérer un profil utilisateur", async () => {
  const userId = new mongoose.Types.ObjectId()
  const mockUser = { _id: userId, name: "Alice", email: "alice@example.com" }

  UserDAO.findById.mockResolvedValue(mockUser)

  const user = await UserService.getUserProfile(userId)

  expect(user).toEqual(mockUser)
})

// 🔹 Test : Erreur si l'utilisateur n'existe pas
test("Échec si l'utilisateur est introuvable", async () => {
  UserDAO.findById.mockResolvedValue(null)

  await expect(
    UserService.getUserProfile(new mongoose.Types.ObjectId())
  ).rejects.toThrow("Utilisateur introuvable.")
})

// 🔹 Test : Récupérer tous les acheteurs
test("Récupérer tous les acheteurs", async () => {
  const buyers = [{ name: "John" }, { name: "Jane" }]
  UserDAO.findBuyers.mockResolvedValue(buyers)

  const result = await UserService.getBuyers()

  expect(result).toEqual(buyers)
})

// 🔹 Test : Échec si aucun acheteur trouvé
test("Échec si aucun acheteur trouvé", async () => {
  UserDAO.findBuyers.mockResolvedValue([])

  await expect(UserService.getBuyers()).rejects.toThrow(
    "Aucun acheteur trouvé."
  )
})

// 🔹 Test : Créer un utilisateur
test("Créer un utilisateur avec succès", async () => {
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    password: "secure123",
    role: { _id: new mongoose.Types.ObjectId() },
    sales_point: { _id: new mongoose.Types.ObjectId() },
  }

  const newUser = new User(userData)
  jest.spyOn(User.prototype, "save").mockResolvedValue(newUser)

  const result = await UserService.createUser(userData)

  expect(result).toEqual(newUser)
})

// 🔹 Test : Échec si e-mail déjà utilisé
test("Échec de création si e-mail déjà utilisé", async () => {
  jest.spyOn(User, "findOne").mockResolvedValue(true)

  await expect(
    UserService.createUser({
      email: "test@example.com",
      role: { _id: new mongoose.Types.ObjectId() },
      sales_point: { _id: new mongoose.Types.ObjectId() },
    })
  ).rejects.toThrow("L'adresse e-mail est déjà utilisée.")
})

// 🔹 Test : Mise à jour utilisateur (changement de mot de passe)
test("Mettre à jour un utilisateur avec succès", async () => {
  const userId = new mongoose.Types.ObjectId()
  const existingUser = {
    _id: userId,
    email: "bob@example.com",
    password: await bcrypt.hash("oldPassword", 10),
  }

  UserDAO.findById.mockResolvedValue(existingUser)

  const updateData = {
    oldPassword: "oldPassword",
    password: "newPassword",
  }

  UserDAO.updateUser.mockResolvedValue({
    ...existingUser,
    password: "hashedNewPassword",
  })

  const updatedUser = await UserService.updateUser(userId, updateData)

  expect(updatedUser.password).toBe("hashedNewPassword")
})

// 🔹 Test : Erreur si ancien mot de passe incorrect
test("Échec si ancien mot de passe incorrect", async () => {
  const userId = new mongoose.Types.ObjectId()
  const existingUser = {
    _id: userId,
    email: "bob@example.com",
    password: await bcrypt.hash("correctPassword", 10),
  }

  UserDAO.findById.mockResolvedValue(existingUser)

  await expect(
    UserService.updateUser(userId, {
      oldPassword: "wrongPassword",
      password: "newPassword",
    })
  ).rejects.toThrow("L'ancien mot de passe est incorrect.")
})

// 🔹 Test : Supprimer un utilisateur
test("Supprimer un utilisateur avec succès", async () => {
  const userId = new mongoose.Types.ObjectId()
  UserDAO.deleteUser.mockResolvedValue(true)

  const result = await UserService.deleteUser(userId)
  expect(result).toBe(true)
})
