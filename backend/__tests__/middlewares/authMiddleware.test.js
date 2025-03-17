import jwt from "jsonwebtoken"
import { protect } from "../../middlewares/authMiddleware"
import httpMocks from "node-mocks-http"
import { jest } from "@jest/globals"

describe("Middleware protect", () => {
  let req, res, next

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn() // Simule le `next()` utilisé dans Express
    jest.restoreAllMocks() // Réinitialise les mocks avant chaque test
  })

  test("❌ Devrait renvoyer une erreur 401 si le token est manquant", () => {
    protect(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res._getJSONData()).toEqual({
      message: "Accès refusé, token manquant !",
    })
    expect(next).not.toHaveBeenCalled()
  })

  test("❌ Devrait renvoyer une erreur 401 si le token est invalide", () => {
    req.cookies = { authToken: "fakeToken" }

    // Utilisation de `jest.spyOn` pour bien mocker `jwt.verify`
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token")
    })

    protect(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res._getJSONData()).toEqual({ message: "Token invalide !" })
    expect(next).not.toHaveBeenCalled()
  })

  test("✅ Devrait appeler next() si le token est valide", () => {
    const mockUser = { id: "123", email: "test@example.com" }
    req.cookies = { authToken: "validToken" }

    // Utilisation de `jest.spyOn` pour éviter les erreurs
    jest.spyOn(jwt, "verify").mockReturnValue(mockUser)

    protect(req, res, next)

    expect(jwt.verify).toHaveBeenCalledWith(
      "validToken",
      process.env.JWT_SECRETQ
    )
    expect(req.user).toEqual(mockUser)
    expect(next).toHaveBeenCalled()
  })
})
