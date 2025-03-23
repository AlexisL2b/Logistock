import ProductService from "../services/productService.js"

const productController = {
  // ✅ Récupérer tous les produits
  getAll: async function (req, res) {
    try {
      const products = await ProductService.getAllProducts()
      console.log("products depuis productController.js", products)
      res.json(products)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  // ✅ Récupérer un produit par ID
  getById: async function (req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id)
      res.json(product)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // ✅ Créer un nouveau produit
  create: async function (req, res) {
    try {
      console.log("req.body depuis productController.js", req.body)
      const newProduct = await ProductService.createProduct(req.body)
      res.status(201).json(newProduct)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  },

  // ✅ Mettre à jour un produit
  update: async function (req, res) {
    try {
      const updatedProduct = await ProductService.updateProduct(
        req.params.id,
        req.body
      )
      res.status(200).json(updatedProduct)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },

  // ✅ Supprimer un produit
  remove: async function (req, res) {
    try {
      const result = await ProductService.deleteProduct(req.params.id)
      res.status(200).json(result)
    } catch (error) {
      res.status(404).json({ message: error.message })
    }
  },
}

export default productController
