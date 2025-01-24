import axios from "axios"

// Récupérer les produits
export const getProducts = async () => {
  const response = await axios.get("/api/products")
  return response.data
}

// Mettre à jour le stock d'un produit
export const updateProductStock = async (productId, newStock) => {
  const response = await axios.put(`/api/products/${productId}`, {
    quantite_stock: newStock,
  })
  return response.data
}
