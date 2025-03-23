import ProductService from "../../services/productService.js"
import ProductDAO from "../../dao/productDAO.js"
import StockDAO from "../../dao/stockDAO.js"
import StockLogDAO from "../../dao/stockLogDAO.js"
import orderDAO from "../../dao/orderDAO.js"
import { jest } from "@jest/globals"

beforeEach(() => {
  jest.clearAllMocks()

  // Mock manuels
  ProductDAO.findAll = jest.fn()
  ProductDAO.findById = jest.fn()
  ProductDAO.findByReference = jest.fn()
  ProductDAO.create = jest.fn()
  ProductDAO.updateProduct = jest.fn()
  ProductDAO.deleteProduct = jest.fn()

  StockDAO.findByProductId = jest.fn()
  StockDAO.createStock = jest.fn()
  StockDAO.incrementStock = jest.fn()
  StockDAO.deleteByProductId = jest.fn()

  StockLogDAO.create = jest.fn()
  orderDAO.findOrdersByStatusAndProductId = jest.fn()
})

describe("ProductService", () => {
  // ✅ Récupération
  test("getAllProducts retourne tous les produits", async () => {
    const mockProducts = [{ name: "Produit 1" }, { name: "Produit 2" }]
    ProductDAO.findAll.mockResolvedValue(mockProducts)

    const result = await ProductService.getAllProducts()

    expect(ProductDAO.findAll).toHaveBeenCalled()
    expect(result).toEqual(mockProducts)
  })

  test("getProductById retourne un produit", async () => {
    const mockProduct = { _id: "prod123", name: "Produit A" }
    ProductDAO.findById.mockResolvedValue(mockProduct)

    const result = await ProductService.getProductById("prod123")

    expect(ProductDAO.findById).toHaveBeenCalledWith("prod123")
    expect(result).toEqual(mockProduct)
  })

  test("getProductById lance une erreur si non trouvé", async () => {
    ProductDAO.findById.mockResolvedValue(null)

    await expect(ProductService.getProductById("invalide")).rejects.toThrow(
      "Produit introuvable"
    )
  })

  // ✅ Création
  test("createProduct crée un nouveau produit avec stock", async () => {
    const data = {
      name: "Chaise",
      reference: "CHA123",
      description: "Chaise ergonomique",
      price: 100,
      quantity: 5,
      category_id: "cat001",
      supplier_id: "sup001",
    }

    ProductDAO.findByReference.mockResolvedValue(null)
    ProductDAO.create.mockResolvedValue({ _id: "prod999", ...data })
    StockDAO.createStock.mockResolvedValue({ _id: "stock999" })
    StockLogDAO.create.mockResolvedValue(true)

    const result = await ProductService.createProduct(data)

    expect(ProductDAO.create).toHaveBeenCalled()
    expect(StockDAO.createStock).toHaveBeenCalled()
    expect(StockLogDAO.create).toHaveBeenCalled()
    expect(result.message).toBe("Produit et stock créés")
  })

  test("createProduct met à jour le stock si produit existe", async () => {
    const existingProduct = {
      _id: "prod123",
      name: "Chaise",
      reference: "CHA123",
    }
    const data = {
      ...existingProduct,
      description: "Chaise confortable",
      price: 150, // ✅ Ajoute un prix valide
      quantity: 10,
      category_id: "cat01",
      supplier_id: "sup01",
    }

    ProductDAO.findByReference.mockResolvedValue(existingProduct)
    StockDAO.findByProductId.mockResolvedValue({ _id: "stock123" })
    StockDAO.incrementStock.mockResolvedValue(true)

    const result = await ProductService.createProduct(data)

    expect(StockDAO.incrementStock).toHaveBeenCalledWith("stock123", 10)
    expect(result.message).toBe("Produit existant, stock mis à jour")
  })

  test("createProduct crée un stock si inexistant pour produit existant", async () => {
    const product = { _id: "prod123", reference: "CHA123" }
    const data = {
      name: "Chaise",
      reference: "CHA123",
      description: "Une chaise",
      price: 120,
      quantity: 7,
      category_id: "cat01",
      supplier_id: "sup01",
    }

    ProductDAO.findByReference.mockResolvedValue(product)
    StockDAO.findByProductId.mockResolvedValue(null)
    StockDAO.createStock.mockResolvedValue({ _id: "stockX" })
    StockLogDAO.create.mockResolvedValue(true)

    const result = await ProductService.createProduct(data)

    expect(StockDAO.createStock).toHaveBeenCalled()
    expect(StockLogDAO.create).toHaveBeenCalled()
    expect(result.message).toBe("Produit existant, stock mis à jour")
  })

  test("createProduct : erreurs de validation", async () => {
    await expect(ProductService.createProduct({})).rejects.toThrow()
  })

  // ✅ Update
  test("updateProduct met à jour un produit", async () => {
    const updated = { name: "Modifié", reference: "MOD123" }

    ProductDAO.updateProduct.mockResolvedValue(updated)

    const result = await ProductService.updateProduct("prod123", updated)

    expect(ProductDAO.updateProduct).toHaveBeenCalledWith(
      "prod123",
      expect.any(Object)
    )
    expect(result).toEqual(updated)
  })

  test("updateProduct : erreur si produit introuvable", async () => {
    ProductDAO.updateProduct.mockResolvedValue(null)

    await expect(
      ProductService.updateProduct("idInvalide", {})
    ).rejects.toThrow(
      "Échec de la mise à jour. Produit introuvable avec l'ID: idInvalide"
    )
  })

  // ✅ Suppression
  test("deleteProduct supprime un produit et crée un log", async () => {
    const id = "prod123"

    orderDAO.findOrdersByStatusAndProductId.mockResolvedValue([])
    StockDAO.findByProductId.mockResolvedValue({ _id: "stock1" })
    StockLogDAO.create.mockResolvedValue(true)
    StockDAO.deleteByProductId.mockResolvedValue(true)
    ProductDAO.deleteProduct.mockResolvedValue({ _id: id })

    const result = await ProductService.deleteProduct(id)

    expect(orderDAO.findOrdersByStatusAndProductId).toHaveBeenCalled()
    expect(StockLogDAO.create).toHaveBeenCalled()
    expect(ProductDAO.deleteProduct).toHaveBeenCalled()
    expect(result.message).toBe("Produit supprimé avec succès")
  })

  test("deleteProduct : erreur si commandes en cours", async () => {
    orderDAO.findOrdersByStatusAndProductId.mockResolvedValue([{ _id: "cmd1" }])

    await expect(ProductService.deleteProduct("prod123")).rejects.toThrow(
      "Impossible de supprimer ce/ces produit(s) : il est/sont encore utilisé(s) dans des commandes en cours."
    )
  })

  test("deleteProduct : erreur si pas de stock", async () => {
    orderDAO.findOrdersByStatusAndProductId.mockResolvedValue([])
    StockDAO.findByProductId.mockResolvedValue(null)

    await expect(ProductService.deleteProduct("prod123")).rejects.toThrow(
      "Aucun stock trouvé pour ce produit."
    )
  })

  test("deleteProduct : erreur si suppression échoue", async () => {
    orderDAO.findOrdersByStatusAndProductId.mockResolvedValue([])
    StockDAO.findByProductId.mockResolvedValue({ _id: "stock1" })
    StockDAO.deleteByProductId.mockResolvedValue(true)
    StockLogDAO.create.mockResolvedValue(true)
    ProductDAO.deleteProduct.mockResolvedValue(null)

    await expect(ProductService.deleteProduct("prod123")).rejects.toThrow(
      "Échec de la suppression. Produit introuvable avec l'ID: prod123"
    )
  })
})
