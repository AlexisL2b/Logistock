import mongoose from "mongoose"
import RoleService from "../../services/roleService.js"
import RoleDAO from "../../dao/roleDAO.js"
import User from "../../models/userModel.js"
import { MongoMemoryServer } from "mongodb-memory-server"
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

// ✅ Mock des DAO et du modèle User
jest.mock("../../dao/roleDAO.js")
RoleDAO.findAll = jest.fn()
RoleDAO.findById = jest.fn()
RoleDAO.create = jest.fn()
RoleDAO.update = jest.fn()
RoleDAO.delete = jest.fn()

jest.mock("../../models/userModel.js")
User.updateMany = jest.fn()

describe("RoleService", () => {
  /**
   * ✅ Test : Récupérer tous les rôles
   */
  test("✅ getAllRoles : Récupère tous les rôles", async () => {
    const mockRoles = [
      { _id: "role1", name: "Admin" },
      { _id: "role2", name: "User" },
    ]
    RoleDAO.findAll.mockResolvedValue(mockRoles)

    const result = await RoleService.getAllRoles()

    expect(RoleDAO.findAll).toHaveBeenCalled()
    expect(result).toEqual(mockRoles)
  })

  /**
   * ✅ Test : Récupérer un rôle par ID
   */
  test("✅ getRoleById : Récupère un rôle existant", async () => {
    const mockRole = { _id: "role1", name: "Admin" }
    RoleDAO.findById.mockResolvedValue(mockRole)

    const result = await RoleService.getRoleById("role1")

    expect(RoleDAO.findById).toHaveBeenCalledWith("role1")
    expect(result).toEqual(mockRole)
  })

  test("❌ getRoleById : Erreur si le rôle est introuvable", async () => {
    RoleDAO.findById.mockResolvedValue(null)

    await expect(RoleService.getRoleById("unknown")).rejects.toThrow(
      "Rôle introuvable"
    )
  })

  /**
   * ✅ Test : Ajouter un rôle
   */
  test("✅ addRole : Ajoute un rôle", async () => {
    const newRole = { name: "Manager" }
    RoleDAO.create.mockResolvedValue({ _id: "role3", ...newRole })

    const result = await RoleService.addRole(newRole)

    expect(RoleDAO.create).toHaveBeenCalledWith(newRole)
    expect(result).toEqual({ _id: "role3", ...newRole })
  })

  test("❌ addRole : Erreur si le champ 'nom' est manquant", async () => {
    await expect(RoleService.addRole({})).rejects.toThrow(
      "Le champ 'nom' est requis"
    )
  })

  /**
   * ✅ Test : Mettre à jour un rôle
   */
  test("✅ updateRole : Met à jour un rôle existant et modifie les utilisateurs associés", async () => {
    const updatedRole = { _id: "role1", name: "Super Admin" }
    RoleDAO.update.mockResolvedValue(updatedRole)

    const result = await RoleService.updateRole("role1", {
      name: "Super Admin",
    })

    expect(RoleDAO.update).toHaveBeenCalledWith("role1", {
      name: "Super Admin",
    })
    expect(User.updateMany).toHaveBeenCalledWith(
      { "role._id": "role1" },
      { $set: { "role.name": "Super Admin" } }
    )
    expect(result).toEqual(updatedRole)
  })

  test("❌ updateRole : Erreur si le rôle est introuvable", async () => {
    RoleDAO.update.mockResolvedValue(null)

    await expect(
      RoleService.updateRole("unknown", { name: "New Role" })
    ).rejects.toThrow("Rôle introuvable")
  })

  /**
   * ✅ Test : Supprimer un rôle
   */
  test("✅ deleteRole : Supprime un rôle existant et le retire des utilisateurs", async () => {
    RoleDAO.delete.mockResolvedValue({ _id: "role1", name: "User" })

    const result = await RoleService.deleteRole("role1")

    expect(RoleDAO.delete).toHaveBeenCalledWith("role1")
    expect(User.updateMany).toHaveBeenCalledWith(
      { "role._id": "role1" },
      { $unset: { role: "" } }
    )
    expect(result).toEqual({ _id: "role1", name: "User" })
  })

  test("❌ deleteRole : Erreur si le rôle est introuvable", async () => {
    RoleDAO.delete.mockResolvedValue(null)

    await expect(RoleService.deleteRole("unknown")).rejects.toThrow(
      "Rôle introuvable"
    )
  })
})
