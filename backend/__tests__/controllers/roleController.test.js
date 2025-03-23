import roleController from "../../controllers/roleController.js"
import roleService from "../../services/roleService.js"
import { jest } from "@jest/globals"

// 🔧 Mocks manuels
roleService.getAllRoles = jest.fn()
roleService.getRoleById = jest.fn()
roleService.addRole = jest.fn()
roleService.updateRole = jest.fn()
roleService.deleteRole = jest.fn()

describe("roleController", () => {
  const mockRes = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn()
    return res
  }

  describe("getAll", () => {
    test("doit retourner tous les rôles", async () => {
      const roles = [{ name: "admin" }, { name: "gestionnaire" }]
      roleService.getAllRoles.mockResolvedValue(roles)

      const req = {}
      const res = mockRes()

      await roleController.getAll(req, res)

      expect(roleService.getAllRoles).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(roles)
    })

    test("doit gérer une erreur serveur", async () => {
      roleService.getAllRoles.mockRejectedValue(new Error("Erreur serveur"))
      const req = {}
      const res = mockRes()

      await roleController.getAll(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur serveur" })
    })
  })

  describe("getById", () => {
    test("doit retourner un rôle par ID", async () => {
      const role = { name: "admin" }
      roleService.getRoleById.mockResolvedValue(role)

      const req = { params: { id: "123" } }
      const res = mockRes()

      await roleController.getById(req, res)

      expect(roleService.getRoleById).toHaveBeenCalledWith("123")
      expect(res.json).toHaveBeenCalledWith(role)
    })

    test("doit retourner 404 si rôle introuvable", async () => {
      roleService.getRoleById.mockRejectedValue(new Error("Introuvable"))

      const req = { params: { id: "404" } }
      const res = mockRes()

      await roleController.getById(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: "Introuvable" })
    })
  })

  describe("create", () => {
    test("doit créer un nouveau rôle", async () => {
      const newRole = { name: "logisticien" }
      roleService.addRole.mockResolvedValue(newRole)

      const req = { body: { name: "logisticien" } }
      const res = mockRes()

      await roleController.create(req, res)

      expect(roleService.addRole).toHaveBeenCalledWith(req.body)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(newRole)
    })

    test("doit retourner 400 en cas d'erreur", async () => {
      roleService.addRole.mockRejectedValue(new Error("Champ requis"))

      const req = { body: {} }
      const res = mockRes()

      await roleController.create(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: "Champ requis" })
    })
  })

  describe("update", () => {
    test("doit mettre à jour un rôle", async () => {
      const updated = { name: "gestionnaire" }
      roleService.updateRole.mockResolvedValue(updated)

      const req = { params: { id: "123" }, body: { name: "gestionnaire" } }
      const res = mockRes()

      await roleController.update(req, res)

      expect(roleService.updateRole).toHaveBeenCalledWith("123", req.body)
      expect(res.json).toHaveBeenCalledWith(updated)
    })

    test("doit retourner 404 si mise à jour échoue", async () => {
      roleService.updateRole.mockRejectedValue(new Error("Introuvable"))

      const req = { params: { id: "999" }, body: {} }
      const res = mockRes()

      await roleController.update(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: "Introuvable" })
    })
  })

  describe("remove", () => {
    test("doit supprimer un rôle", async () => {
      const mockDeleted = { _id: "123", name: "logisticien" }
      roleService.deleteRole.mockResolvedValue(mockDeleted)

      const req = { params: { id: "123" } }
      const res = mockRes()

      await roleController.remove(req, res)

      expect(roleService.deleteRole).toHaveBeenCalledWith("123")
      expect(res.json).toHaveBeenCalledWith({
        message: "Rôle supprimé avec succès",
        data: mockDeleted,
      })
    })

    test("doit retourner 400 si suppression échoue", async () => {
      roleService.deleteRole.mockRejectedValue(new Error("Erreur suppression"))

      const req = { params: { id: "fail" } }
      const res = mockRes()

      await roleController.remove(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur suppression" })
    })
  })
})
