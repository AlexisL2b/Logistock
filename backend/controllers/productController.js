import ProductService from "../services/productService.js"

export const getProductById = async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id)
    res.status(200).json(product)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const { page, limit, ...filters } = req.query
    const products = await ProductService.getAllProducts(
      filters,
      Number(page),
      Number(limit)
    )
    res.status(200).json(products)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des produits" })
  }
}

export const createProduct = async (req, res) => {
  try {
    const newProduct = await ProductService.createProduct(req.body)
    res.status(201).json(newProduct)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await ProductService.updateProduct(
      req.params.id,
      req.body
    )
    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const result = await ProductService.deleteProduct(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
