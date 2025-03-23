import productController from "../../controllers/productController.js"
import ProductService from "../../services/productService.js"
import { jest } from "@jest/globals"

// 🧪 Mock manuel de chaque fonction du service
ProductService.getAllProducts = jest.fn()
ProductService.getProductById = jest.fn()
ProductService.createProduct = jest.fn()
ProductService.updateProduct = jest.fn()
ProductService.deleteProduct = jest.fn()

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe("🎯 productController", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("getAll : doit retourner la liste des produits", async () => {
    const req = {}
    const res = mockResponse()

    const produitsMock = [{ name: "Produit A" }, { name: "Produit B" }]
    ProductService.getAllProducts.mockResolvedValue(produitsMock)

    await productController.getAll(req, res)

    expect(ProductService.getAllProducts).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(produitsMock)
  })

  test("getById : doit retourner un produit par ID", async () => {
    const req = { params: { id: "prod123" } }
    const res = mockResponse()

    const produitMock = { _id: "prod123", name: "Clavier" }
    ProductService.getProductById.mockResolvedValue(produitMock)

    await productController.getById(req, res)

    expect(ProductService.getProductById).toHaveBeenCalledWith("prod123")
    expect(res.json).toHaveBeenCalledWith(produitMock)
  })

  test("getById : renvoie une erreur si le produit est introuvable", async () => {
    const req = { params: { id: "fakeid" } }
    const res = mockResponse()
    const error = new Error("Produit introuvable")

    ProductService.getProductById.mockRejectedValue(error)

    await productController.getById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: error.message })
  })

  test("create : doit créer un produit", async () => {
    const req = { body: { name: "Nouveau Produit" } }
    const res = mockResponse()

    const produitCréé = { _id: "prod999", name: "Nouveau Produit" }
    ProductService.createProduct.mockResolvedValue(produitCréé)

    await productController.create(req, res)

    expect(ProductService.createProduct).toHaveBeenCalledWith(req.body)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(produitCréé)
  })

  test("create : renvoie une erreur si la création échoue", async () => {
    const req = { body: { name: "Erreur produit" } }
    const res = mockResponse()
    const error = new Error("Création échouée")

    ProductService.createProduct.mockRejectedValue(error)

    await productController.create(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: error.message })
  })

  test("update : met à jour un produit", async () => {
    const req = { params: { id: "prod321" }, body: { name: "Modifié" } }
    const res = mockResponse()

    const produitMaj = { _id: "prod321", name: "Modifié" }
    ProductService.updateProduct.mockResolvedValue(produitMaj)

    await productController.update(req, res)

    expect(ProductService.updateProduct).toHaveBeenCalledWith(
      "prod321",
      req.body
    )
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(produitMaj)
  })

  test("update : renvoie une erreur si le produit est introuvable", async () => {
    const req = { params: { id: "idInexistant" }, body: {} }
    const res = mockResponse()
    const error = new Error("Produit non trouvé")

    ProductService.updateProduct.mockRejectedValue(error)

    await productController.update(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: error.message })
  })

  test("remove : supprime un produit", async () => {
    const req = { params: { id: "prodDel" } }
    const res = mockResponse()

    const result = { message: "Produit supprimé avec succès" }
    ProductService.deleteProduct.mockResolvedValue(result)

    await productController.remove(req, res)

    expect(ProductService.deleteProduct).toHaveBeenCalledWith("prodDel")
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(result)
  })

  test("remove : renvoie une erreur si la suppression échoue", async () => {
    const req = { params: { id: "idErr" } }
    const res = mockResponse()
    const error = new Error("Suppression impossible")

    ProductService.deleteProduct.mockRejectedValue(error)

    await productController.remove(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: error.message })
  })
})
